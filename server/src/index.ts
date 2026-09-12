import express from "express";
import cors from "cors";

import { progressRoutes } from "./progress/progressRoutes";
import { childRoutes } from "./children/childRoutes";
import { authRoutes } from "./auth/authRoutes";

const app = express();

const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(
    `Tiny Talkers server running at http://localhost:${PORT}`
  );
});