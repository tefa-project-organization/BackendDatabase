import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import project_team_membersService from "./project_team_members.service.js";

class project_team_membersController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new project_team_membersService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "project team members retrieved successfully");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("project team member not found");
    return this.ok(res, data, "project team member retrieved successfully");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "project team member created successfully");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "project team member updated successfully");
  });

  delete = this.wrapper(async (req, res) => {
    await this.#service.delete(req.params.id);
    return this.noContent(res, "project team member deleted successfully");
  });
}

export default project_team_membersController;
