import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import employeesService from "./employees.service.js";

class employeesController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new employeesService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "employeess successfully retrieved");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("employees not found");

    return this.ok(res, data, "employees successfully retrieved");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "employees successfully created");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "employees successfully updated");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "employees successfully deleted");
  });
}

export default employeesController;
