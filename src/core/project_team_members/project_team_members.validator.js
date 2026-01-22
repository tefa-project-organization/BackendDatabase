import Joi from "joi";
import { start } from "repl";

const create = Joi.object({
  role_id: Joi.number().required(),
  project_teams_id: Joi.number().optional(),
  employee_id: Joi.number().required(),
  job_description: Joi.string().max(500).optional(),  
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional()
});

const update = Joi.object({
  role_id: Joi.number().optional(),
  project_teams_id: Joi.number().optional().allow(null, ''),
  employee_id: Joi.number().optional().allow(null, ''),
  job_description: Joi.string().max(500).optional().allow(null, ''),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional()
});

export default { create, update };
