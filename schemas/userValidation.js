const Joi = require('joi');

const userValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

module.exports = userValidation;

