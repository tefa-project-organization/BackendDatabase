import Joi from "joi";

export const projectsValidator = {
  create: Joi.object({
    project_name: Joi.string().max(100).required(),
    description: Joi.string().max(500).optional(),
    project_code: Joi.string().max(50).required(),
    project_type: Joi.string().max(50).required(),
    client_id : Joi.number().required(),
    contract_value : Joi.number().optional(),
    started_at : Joi.date().required(),
    finished_at : Joi.date().optional()
  }),
  update: Joi.object({
  project_name: Joi.string().max(100).optional(),
  description: Joi.string().max(500).optional(),
  project_code: Joi.string().max(50).optional(),
  project_type: Joi.string().max(50).optional(),
  client_id: Joi.number().optional(),
  contract_value: Joi.number().optional(),
  started_at: Joi.date().optional(),
  finished_at: Joi.date().optional()
}).min(1),

};

export default projectsValidator;
