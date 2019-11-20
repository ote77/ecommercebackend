const Joi = require('@hapi/joi');

const validateOrder = data => {
  const schema = Joi.object({
    itemId: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .required(),
    quantity: Joi.array()
      .items(Joi.number().required())
      .min(1)
      .required()
  });
  return schema.validate(data);
};

const validatePostItem = data => {
  const schema = Joi.object({
    items: Joi.array()
      .items({
        type: Joi.string()
          .min(3)
          .max(50)
          .required(),
        color: Joi.string()
          .min(3)
          .max(50)
          .required(),
        size: Joi.string().valid('S', 'M', 'L'),
        stock: Joi.number().required()
      })
      .min(1)
      .required()
  });
  return schema.validate(data);
};

const validatePutItem = data => {
  const schema = Joi.object({
    type: Joi.string()
      .min(3)
      .max(50),
    color: Joi.string()
      .min(3)
      .max(50),
    size: Joi.string().valid('S', 'M', 'L'),
    stock: Joi.number()
  });
  return schema.validate(data);
};

module.exports = { validateOrder, validatePostItem, validatePutItem };
