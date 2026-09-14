import express from "express";
import multer from "multer";

import isAuth from "../middlewares/isAuth.js";
import { checkAtsScore } from "../controllers/ats.controller.js";

const atsRouter = express.Router();

const upload = multer({
  dest: "uploads/",
});

atsRouter.post(
  "/check",
  isAuth,
  upload.single("resume"),
  checkAtsScore
);

export default atsRouter;
