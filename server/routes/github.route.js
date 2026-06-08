import express from "express";

import {
  analyzeGithubProfile,
} from "../controllers/github.controller.js";

import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post(
  "/analyze",
  isAuth,
  analyzeGithubProfile
);

export default router;