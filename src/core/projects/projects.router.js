import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import projectsController from "./projects.controller.js";
import projectsValidator from "./projects.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = projectsValidator,
  controller = new projectsController();

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
    auth(),
    validatorMiddleware({ body: validator.update }),
    controller.update
    );
    
r.delete("/delete/:id", auth(), controller.delete);

const projectsRouter = r;
export default projectsRouter;
