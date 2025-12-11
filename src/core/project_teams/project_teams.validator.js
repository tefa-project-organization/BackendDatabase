import Joi from "joi";

export const project_teamsValidator = {
  create: Joi.object({
    project_teams_name: Joi.string().max(100).required(),
    project_teams_email: Joi.string().max(500).optional(),
    manager_id : Joi.number().required(),
    project_id : Joi.number().required()
  }),
  update: Joi.object({
    // no-data
  }),
};

export default project_teamsValidator;
