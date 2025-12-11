import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import project_teamsController from "./project_teams.controller.js";
import project_teamsValidator from "./project_teams.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = project_teamsValidator,
  controller = new project_teamsController();

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
    auth(['ADMIN']),
    validatorMiddleware({ body: validator.update }),
    controller.update
    );
    
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const project_teamsRouter = r;
export default project_teamsRouter;
