import { Router } from "express";

import { AuthenticationManager } from "../auth/AuthenticationManager";
import { ChildRepository } from "./ChildRepository";

const router = Router();

const childRepository =
  new ChildRepository();

const authenticationManager =
  new AuthenticationManager();

router.get(
  "/",
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

    const children =
      childRepository
        .getChildrenForUser(
          user.userId
        );

    response.json({
      children,
    });
  }
);

router.post(
  "/",
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

    const {
      displayName,
      avatar,
    } = request.body;

    if (
      typeof displayName !== "string" ||
      displayName.trim() === ""
    ) {
      response.status(400).json({
        message:
          "displayName is required.",
      });

      return;
    }

    if (
      typeof avatar !== "string" ||
      avatar.trim() === ""
    ) {
      response.status(400).json({
        message:
          "avatar is required.",
      });

      return;
    }

    const child =
      childRepository.createChild(
        user.userId,
        displayName.trim(),
        avatar.trim()
      );

    response.status(201).json({
      child,
    });
  }
);

export const childRoutes = router;