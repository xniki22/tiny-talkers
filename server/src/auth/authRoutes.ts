import { Router } from "express";

import { AuthenticationManager } from "./AuthenticationManager";
import {
  loginRateLimiter,
  registerRateLimiter,
} from "./authRateLimiters";

const router = Router();

const authenticationManager =
  new AuthenticationManager();

router.post(
  "/register",
  registerRateLimiter,
  async (request, response) => {
    const {
      email,
      password,
    } = request.body;

    if (
      typeof email !== "string" ||
      email.trim() === ""
    ) {
      response.status(400).json({
        message:
          "Email is required.",
      });

      return;
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      response.status(400).json({
        message:
          "Password must be at least 8 characters.",
      });

      return;
    }

    try {
      const user =
        await authenticationManager.register(
          email,
          password
        );

      response.status(201).json({
        user,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed.";

      response.status(400).json({
        message,
      });
    }
  }
);

router.post(
  "/login",
  loginRateLimiter,
  async (request, response) => {
    const {
      email,
      password,
    } = request.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      response.status(400).json({
        message:
          "Email and password are required.",
      });

      return;
    }

    try {
      const {
        user,
        sessionId,
      } =
        await authenticationManager.login(
          email,
          password
        );

      response.json({
        user,
        sessionId,
      });
    } catch {
      response.status(401).json({
        message:
          "Invalid email or password.",
      });
    }
  }
);

router.get(
  "/me",
  (request, response) => {
    const authorization =
      request.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      response.status(401).json({
        message:
          "Authentication required.",
      });

      return;
    }

    const sessionId =
      authorization.slice(
        "Bearer ".length
      );

    const user =
      authenticationManager
        .getUserBySession(
          sessionId
        );

    if (!user) {
      response.status(401).json({
        message:
          "Session is invalid or expired.",
      });

      return;
    }

    response.json({
      user,
    });
  }
);

router.post(
  "/logout",
  (request, response) => {
    const authorization =
      request.headers.authorization;

    if (
      authorization &&
      authorization.startsWith(
        "Bearer "
      )
    ) {
      const sessionId =
        authorization.slice(
          "Bearer ".length
        );

      authenticationManager.logout(
        sessionId
      );
    }

    response.status(204).send();
  }
);

export const authRoutes = router;