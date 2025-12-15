import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import Client_PICService from "./client_pic.service.js";

class Client_PICController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new Client_PICService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Client_PICs successfully retrieved");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("Client_PIC not found");

    return this.ok(res, data, "Client_PIC successfully retrieved");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "Client_PIC successfully created");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "Client_PIC successfully updated");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "Client_PIC successfully deleted");
  });
}

export default Client_PICController;
