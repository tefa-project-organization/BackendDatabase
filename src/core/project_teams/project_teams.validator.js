import Joi from "joi";

export const project_teamsValidator = {
  create: Joi.object({
    project_teams_name: Joi.string().max(100).required(),
    project_teams_email: Joi.string().max(500).optional(),
    manager_id : Joi.number().required(),
    project_id : Joi.number().required(),
    auditor_id : Joi.number().optional()
  }),
  update: Joi.object({
    project_teams_name: Joi.string().max(100).optional().allow(null, ''),
    project_teams_email: Joi.string().max(500).optional().allow(null, ''),
    manager_id : Joi.number().optional().allow(null, ''),
    project_id : Joi.number().optional().allow(null, ''),
    auditor_id : Joi.number().optional().allow(null, '')
  }),
};

export default project_teamsValidator;
