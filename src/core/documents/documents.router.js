import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import documentsController from "./documents.controller.js";
import documentsValidator from "./documents.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import multer from "multer";

const upload = multer();


const r = Router(),
  validator = documentsValidator,
  controller = new documentsController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  // auth(['ADMIN']),
  upload.single("document"),                
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

const documentsRouter = r;
export default documentsRouter;
