import Joi from "joi";

export const Client_PICValidator = {
create: Joi.object({
  id: Joi.forbidden(), // ⬅️ kunci masalah

  name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  phone: Joi.string().max(50).required(),
  title: Joi.string().max(100).allow(null, ""),
  client_id: Joi.number().integer().positive().required(),
  project_id: Joi.number().integer().positive().allow(null)
})
,

  update: Joi.object({
  id: Joi.forbidden().optional(), // ⬅️ kunci masalah

  name: Joi.string().max(255).optional(),
  email: Joi.string().email().max(255).optional,
  phone: Joi.string().max(50).optional(),
  title: Joi.string().max(100).optional(),
  client_id: Joi.number().optional(),
  project_id: Joi.number().optional(),
  }),
};

export default Client_PICValidator;
