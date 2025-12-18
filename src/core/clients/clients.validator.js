import Joi from "joi";

export const clientsValidator = {
  create: Joi.object({
    name: Joi.string().required(),
    masked_description: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    npwp: Joi.string().required(),
  }),  
  
  update: Joi.object({
    name: Joi.string().optional(),
    masked_description: Joi.string().allow(null, ""),
    address: Joi.string().allow(null, ""),
    phone: Joi.string().allow(null, ""),
    npwp: Joi.string().allow(null, ""),
  }),
};

export default clientsValidator;
