import BaseController from "../../base/controller.base.js";
import DashboardService from "./dashboard.service.js";

class DashboardController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new DashboardService();
  }

  summary = this.wrapper(async (req, res) => {
    const data = await this.#service.getSummary();
    return this.ok(res, data, "Dashboard summary retrieved");
  });
}

export default DashboardController;
