
const Joi = require('joi');

const contactValidation = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  phone: Joi.string().required().messages({
    'any.required': 'Phone is required',
  }),
});

module.exports = contactValidation;