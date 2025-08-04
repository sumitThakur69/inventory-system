const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getMyProducts,
  updateProductStock,
  getSupplyHistory,
  getLowStockProducts
} = require('../controllers/vendorController');

const router = express.Router();

// Apply vendor authorization
router.use(protect);
router.use(authorize('vendor'));

router.get('/products', getMyProducts);
router.put('/products/:id/stock', updateProductStock);
router.get('/supply-history', getSupplyHistory);
router.get('/low-stock', getLowStockProducts);

module.exports = router;