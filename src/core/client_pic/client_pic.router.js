import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import Client_PICController from "./client_pic.controller.js";
import Client_PICValidator from "./client_pic.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = Client_PICValidator,
  controller = new Client_PICController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  // auth(['ADMIN']),
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

const client_picRouter = r;
export default client_picRouter;
