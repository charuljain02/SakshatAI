import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/connectDb.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import githubRoutes from "./routes/github.route.js";
const app = express();


// ================= DATABASE =================

connectDb();


// ================= CORS =================

const allowedOrigins = [
  "http://localhost:5173",
  "https://sakshatai-client.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {

    // Allow requests with no origin
    // (Postman, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
};

app.use(cors(corsOptions));



// ================= MIDDLEWARES =================

app.use(express.json());

app.use(cookieParser());


// ================= ROUTES =================

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/interview", interviewRouter);


app.use("/api/github", githubRoutes);
// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Server Running...");
});


// ================= PORT =================

const PORT = process.env.PORT || 8000;


// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});