import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import clientsService from "./clients.service.js";

class clientsController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new clientsService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "clientss successfully retrieved");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("clients not found");

    return this.ok(res, data, "clients successfully retrieved");
  });

  create = this.wrapper(async (req, res) => {
  console.log("HEADERS:", req.headers);
console.log("RAW BODY:", req.rawBody);
console.log("REQ BODY:", req.body);


  const employees_id = req.employees?.id;
  const data = await this.#service.create(req.body, employees_id);
  return this.created(res, data, "clients successfully created");
});




  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "clients successfully updated");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "clients successfully deleted");
  });
}

export default clientsController;
