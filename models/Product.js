const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'Vendor is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  stock: {
    current: {
      type: Number,
      required: [true, 'Current stock is required'],
      min: 0,
      default: 0
    },
    minimum: {
      type: Number,
      default: 10
    },
    maximum: {
      type: Number,
      default: 1000
    }
  },
  specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    color: String,
    material: String
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  stockHistory: [{
    action: {
      type: String,
      enum: ['add', 'remove', 'adjust', 'order']
    },
    quantity: Number,
    previousStock: Number,
    newStock: Number,
    reason: String,
    date: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Check for low stock
productSchema.methods.isLowStock = function() {
  return this.stock.current <= this.stock.minimum;
};

// Update stock method
productSchema.methods.updateStock = function(quantity, action, reason, userId) {
  const previousStock = this.stock.current;
  
  if (action === 'add') {
    this.stock.current += quantity;
  } else if (action === 'remove' || action === 'order') {
    this.stock.current = Math.max(0, this.stock.current - quantity);
  } else if (action === 'adjust') {
    this.stock.current = quantity;
  }

  this.stockHistory.push({
    action,
    quantity,
    previousStock,
    newStock: this.stock.current,
    reason,
    updatedBy: userId
  });

  return this.save();
};

module.exports = mongoose.model('Product', productSchema);