import Joi from "joi";

const create = Joi.object({
  role_id: Joi.number().required(),
  project_teams_id: Joi.number().optional(),
  employee_id: Joi.number().required(),
  job_description: Joi.string().max(500).optional(),
  end_at: Joi.date().optional()
});

const update = create.fork(Object.keys(create.describe().keys), field => field.optional());

export default { create, update };
