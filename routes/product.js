const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  createCategory,
  getAllCategories
} = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.put('/:id/stock', protect, authorize('admin', 'vendor'), updateStock);
router.post('/categories', protect, authorize('admin'), createCategory);

module.exports = router;