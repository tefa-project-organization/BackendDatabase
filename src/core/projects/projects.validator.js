import Joi from "joi";

export const projectsValidator = {
  create: Joi.object({
    project_name: Joi.string().max(100).required(),
    project_description: Joi.string().max(500).optional(),
    project_code: Joi.string().max(50).required(),
    project_type: Joi.string().max(50).required(),
    client_id : Joi.number().required(),
    contract_value : Joi.number().optional(),
    started_at : Joi.date().required(),
    finished_at : Joi.date().optional()
  }),
  update: Joi.object({
    // no-data
  }),
};

export default projectsValidator;
