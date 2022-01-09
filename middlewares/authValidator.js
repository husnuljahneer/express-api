const Joi = require('joi') 

const schemas = { 
  signup: Joi.object().keys({ 
    name: Joi.string()
    .min(3)
    .max(30)
    .required(),
    email: Joi.string()
    .email()
    .required(),
    password: Joi.string()
    .min(6)
    .max(30)
    .required(),
  }),
  login: Joi.object().keys({ 
    email: Joi.string()
    .email()
    .required(),
    password: Joi.string()
    .min(6)
    .max(30)
    .required(),
  })
}; 
module.exports = schemas;