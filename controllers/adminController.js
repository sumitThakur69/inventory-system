const User = require('../models/User');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { sendLowStockAlert } = require('../services/emailService');

const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock.current', '$stock.minimum'] }
    }).populate('vendor category');

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'name sku')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalOrders,
          totalVendors,
          totalCustomers,
          lowStockCount: lowStockProducts.length
        },
        lowStockProducts,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name sku')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalOrders: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('products');
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock.current', '$stock.minimum'] }
    }).populate('vendor category');

    if (lowStockProducts.length > 0) {
      // Send email alerts
      const adminEmails = [process.env.ADMIN_EMAIL];
      for (const product of lowStockProducts) {
        await sendLowStockAlert(product, adminEmails);
      }
    }

    res.json({
      success: true,
      message: `Found ${lowStockProducts.length} products with low stock`,
      data: lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  createVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
  checkLowStock
};