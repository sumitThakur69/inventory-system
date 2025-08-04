const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  createVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
  checkLowStock
} = require('../controllers/adminController');

const router = express.Router();

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/vendors', createVendor);
router.get('/vendors', getAllVendors);
router.put('/vendors/:id', updateVendor);
router.delete('/vendors/:id', deleteVendor);
router.get('/low-stock', checkLowStock);
