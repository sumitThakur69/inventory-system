const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getProducts,
  getProductDetails,
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/customerController');

const router = express.Router();

// Apply customer authorization
router.use(protect);
router.use(authorize('customer'));

router.get('/products', getProducts);
router.get('/products/:id', getProductDetails);
router.post('/orders', createOrder);
router.get('/orders', getMyOrders);
router.get('/orders/:id', getOrderById);
