import { Router } from "express";
import DashboardController from "./dashboard.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router();
const controller = new DashboardController();

r.get(
  "/summary",
  auth(),
  controller.summary
);

const dashboard = r
export default dashboard;
