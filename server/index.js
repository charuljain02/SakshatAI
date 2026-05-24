import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/connectDb.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";

// OPTIONAL
// import isAuth from "./middlewares/isAuth.js";

const app = express();


// ================= MIDDLEWARES =================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());


// ================= ROUTES =================

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/interview", interviewRouter);


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Server Running...");
});


// ================= PORT =================

const PORT = process.env.PORT || 8000;


// ================= DATABASE + SERVER =================

connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});