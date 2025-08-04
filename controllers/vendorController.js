const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

const getMyProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.user.vendorId });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find({ vendor: vendor._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments({ vendor: vendor._id });

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalProducts: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProductStock = async (req, res) => {
  try {
    const { quantity, action, reason } = req.body;
    const vendor = await Vendor.findOne({ _id: req.user.vendorId });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      vendor: vendor._id
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or not assigned to your vendor account' 
      });
    }

    await product.updateStock(quantity, action, reason, req.user.id);

    // Update vendor supply history
    vendor.supplyHistory.push({
      productId: product._id,
      quantity: action === 'add' ? quantity : -quantity,
      notes: reason
    });
    await vendor.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSupplyHistory = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.user.vendorId })
      .populate('supplyHistory.productId', 'name sku');

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    res.json({
      success: true,
      data: vendor.supplyHistory.sort((a, b) => b.date - a.date)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.user.vendorId });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const lowStockProducts = await Product.find({
      vendor: vendor._id,
      $expr: { $lte: ['$stock.current', '$stock.minimum'] }
    }).populate('category', 'name');

    res.json({
      success: true,
      data: lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProducts,
  updateProductStock,
  getSupplyHistory,
  getLowStockProducts
};