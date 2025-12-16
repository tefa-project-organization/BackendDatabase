import dotenv from "dotenv";
dotenv.config(); // HARUS PALING ATAS

import express from "express";
import cors from "cors";
import httpStatus from "http-status-codes";
import fs from "fs";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import router from "./routes.js";
import handleError from "./exceptions/handler.exception.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

/* ==========================
   BASIC MIDDLEWARE
========================== */
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/* ==========================
   CORS CONFIG (WAJIB BENAR)
========================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-anda.vercel.app", // GANTI sesuai frontend prod
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow server-to-server / postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin); // ⚠️ HARUS origin, BUKAN true
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept"
],

};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));




/* ==========================
   ROUTES
========================== */
app.use("/api/v1", router);

/* ==========================
   FILE DOWNLOAD
========================== */
app.get("/api/download", (req, res, next) => {
  const filePath = req.query.path;

  if (!filePath) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      code: httpStatus.BAD_REQUEST,
      message: "File path not provided.",
    });
  }

  const resolvedPath = path.resolve(filePath);

  fs.access(resolvedPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: false,
        code: httpStatus.NOT_FOUND,
        message: "File not found.",
      });
    }

    res.sendFile(resolvedPath, (err) => {
      if (err) return next(err);
    });
  });
});

/* ==========================
   ROOT
========================== */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

/* ==========================
   404 HANDLER
========================== */
app.use((req, res) => {
  res.status(httpStatus.StatusCodes.NOT_FOUND).json({
    errors: {
      status: httpStatus.StatusCodes.NOT_FOUND,
      data: null,
      error: {
        code: httpStatus.StatusCodes.NOT_FOUND,
        message: "ENDPOINT_NOTFOUND",
      },
    },
  });
});

/* ==========================
   ERROR HANDLER
========================== */
app.use(handleError);

/* ==========================
   SERVER + SOCKET.IO
========================== */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* ==========================
   START SERVER
========================== */
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/* ==========================
   BIGINT FIX
========================== */
BigInt.prototype.toJSON = function () {
  return Number(this.toString());
};
