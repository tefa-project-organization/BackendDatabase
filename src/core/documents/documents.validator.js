import Joi from "joi";

export const documentsValidator = {
create: Joi.object({
  project_id: Joi.number().integer().positive().required(),

  document_types: Joi.string()
    .valid("BA", "OP", "BAST")
    .required(),

  date_signed: Joi.date().optional(),

  document_url: Joi.string()
    .uri()
    .required(),
    
})
.options({ abortEarly: false, allowUnknown: false }),

  update: Joi.object({

  project_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  client_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  client_pic_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  document_types: Joi.number()
    .integer()
    .positive()
    .optional(),

  date_created: Joi.date()
    .optional(),

  date_signed: Joi.date()
    .optional(),
})
};

export default documentsValidator;
