const Joi = require('joi');

const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    description: Joi.string().allow('').max(1000),
    sku: Joi.string().required().uppercase().min(3).max(20),
    category: Joi.string().required(),
    vendor: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.object({
      current: Joi.number().required().min(0),
      minimum: Joi.number().default(10),
      maximum: Joi.number().default(1000)
    }).required(),
    specifications: Joi.object({
      weight: Joi.number().min(0),
      dimensions: Joi.object({
        length: Joi.number().min(0),
        width: Joi.number().min(0),
        height: Joi.number().min(0)
      }),
      color: Joi.string(),
      material: Joi.string()
    }),
    images: Joi.array().items(Joi.string().uri())
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateOrder = (req, res, next) => {
  const schema = Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required().min(1)
      })
    ).required().min(1),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateOrder
};