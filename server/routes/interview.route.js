import express from "express";
import multer from "multer";

import isAuth from "../middlewares/isAuth.js";
import {
  analyzeResume,
  finishInterview,
  generateQuestion,
  getMyInterviews,
  submitAnswer,
  getInterviewReport
} from "../controllers/interview.controller.js";
const interviewRouter = express.Router();

const upload = multer({
  dest: "uploads/",
});

interviewRouter.post(
  "/resume",
  isAuth,
  upload.single("resume"),
  analyzeResume
);
interviewRouter.post(
  "/generate-questions",
  isAuth,
  generateQuestion
);
interviewRouter.post(
  "/submit-answer",
  isAuth,
  submitAnswer
);
interviewRouter.post(
  "/finish",
  isAuth,
  finishInterview
);
interviewRouter.get(
  "/get-interview",
  isAuth,
  getMyInterviews
);
interviewRouter.get(
  "/report/:id",
  isAuth,
  getInterviewReport
);
export default interviewRouter;