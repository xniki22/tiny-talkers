import express from "express";
import cors from "cors";

import { progressRoutes } from "./progress/progressRoutes";
import { childRoutes } from "./children/childRoutes";
import { authRoutes } from "./auth/authRoutes";
import { customLevelRoutes } from "./customLevels/customLevelRoutes";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get(
  "/health",
  (_request, response) => {
    response.json({
      status: "ok",
      message:
        "Tiny Talkers server is running",
    });
  }
);

app.use(
  "/auth",
  authRoutes
);

app.use(
  "/progress",
  progressRoutes
);

app.use(
  "/children",
  childRoutes
);

app.use(
  "/custom-levels",
  customLevelRoutes
);