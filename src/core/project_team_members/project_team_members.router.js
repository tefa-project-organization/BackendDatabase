import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import project_team_membersController from "./project_team_members.controller.js";
import project_team_membersValidator from "./project_team_members.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = project_team_membersValidator,
  controller = new project_team_membersController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  "/update/:id",
  auth(["ADMIN"]),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(["ADMIN"]), controller.delete);

const team_members = r;
export default r;
