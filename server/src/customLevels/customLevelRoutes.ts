import { Router } from "express";

import { AuthenticationManager } from "../auth/AuthenticationManager";
import { ChildRepository } from "../children/ChildRepository";

import { CustomLevelRepository } from "./CustomLevelRepository";
import { CustomLevelAIService } from "./CustomLevelAIService";

import type {
  CustomLearningItemType,
} from "./ICustomLevel";

const router = Router();

const authenticationManager =
  new AuthenticationManager();

const childRepository =
  new ChildRepository();

const customLevelRepository =
  new CustomLevelRepository();

const customLevelAIService =
  new CustomLevelAIService();

const validItemTypes:
  CustomLearningItemType[] = [
    "WORD",
    "PHRASE",
    "SENTENCE",
  ];

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

    const childId =
      request.query.childId;

    if (
      typeof childId !== "string" ||
      childId.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childId is required.",
      });

      return;
    }

    const ownsChild =
      childRepository.ownsChild(
        user.userId,
        childId
      );

    if (!ownsChild) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    const customLevels =
      customLevelRepository
        .getCustomLevelsForChild(
          childId
        );

    response.json({
      customLevels,
    });
  }
);

router.post(
  "/generate",
  async (
    request,
    response
  ) => {
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
      childId,
      childName,
      topic,
    } = request.body;

    if (
      typeof childId !== "string" ||
      childId.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childId is required.",
      });

      return;
    }

    const ownsChild =
      childRepository.ownsChild(
        user.userId,
        childId
      );

    if (!ownsChild) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    if (
      typeof childName !== "string" ||
      childName.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childName is required.",
      });

      return;
    }

    if (
      typeof topic !== "string" ||
      topic.trim() === ""
    ) {
      response.status(400).json({
        message:
          "Please enter what you would like your child to practice.",
      });

      return;
    }

    if (
      topic.trim().length > 300
    ) {
      response.status(400).json({
        message:
          "Practice request must be 300 characters or fewer.",
      });

      return;
    }

    try {
      const generatedLevel =
        await customLevelAIService
          .generateLevel(
            childName.trim(),
            topic.trim()
          );

      response.json({
        generatedLevel,
      });
    } catch (error) {
      console.error(
        "Custom level AI generation failed:",
        error
      );

      response.status(500).json({
        message:
          "Could not generate a custom level.",
      });
    }
  }
);

router.get(
  "/:customLevelId",
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

    const childId =
      request.query.childId;

    if (
      typeof childId !== "string" ||
      childId.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childId is required.",
      });

      return;
    }

    const ownsChild =
      childRepository.ownsChild(
        user.userId,
        childId
      );

    if (!ownsChild) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    const customLevel =
      customLevelRepository
        .getCustomLevel(
          childId,
          request.params.customLevelId
        );

    if (!customLevel) {
      response.status(404).json({
        message:
          "Custom level was not found.",
      });

      return;
    }

    response.json({
      customLevel,
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
      childId,
      title,
      items,
    } = request.body;

    if (
      typeof childId !== "string" ||
      childId.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childId is required.",
      });

      return;
    }

    const ownsChild =
      childRepository.ownsChild(
        user.userId,
        childId
      );

    if (!ownsChild) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    if (
      typeof title !== "string" ||
      title.trim() === ""
    ) {
      response.status(400).json({
        message:
          "title is required.",
      });

      return;
    }

    if (
      title.trim().length > 80
    ) {
      response.status(400).json({
        message:
          "title must be 80 characters or fewer.",
      });

      return;
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      response.status(400).json({
        message:
          "At least one learning item is required.",
      });

      return;
    }

    if (items.length > 5) {
      response.status(400).json({
        message:
          "A custom level can contain at most 5 items.",
      });

      return;
    }

    const normalizedItems:
      {
        text: string;
        type: CustomLearningItemType;
      }[] = [];

    for (const item of items) {
      if (
        typeof item !== "object" ||
        item === null
      ) {
        response.status(400).json({
          message:
            "Each learning item must be valid.",
        });

        return;
      }

      if (
        typeof item.text !== "string" ||
        item.text.trim() === ""
      ) {
        response.status(400).json({
          message:
            "Each learning item requires text.",
        });

        return;
      }

      if (
        item.text.trim().length > 120
      ) {
        response.status(400).json({
          message:
            "Learning items must be 120 characters or fewer.",
        });

        return;
      }

      if (
        typeof item.type !== "string" ||
        !validItemTypes.includes(
          item.type as CustomLearningItemType
        )
      ) {
        response.status(400).json({
          message:
            "Each learning item requires a valid type.",
        });

        return;
      }

      normalizedItems.push({
        text:
          item.text.trim(),

        type:
          item.type as CustomLearningItemType,
      });
    }

    const customLevel =
      customLevelRepository
        .createCustomLevel(
          childId,
          title.trim(),
          normalizedItems
        );

    response.status(201).json({
      customLevel,
    });
  }
);

router.delete(
  "/:customLevelId",
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

    const childId =
      request.query.childId;

    if (
      typeof childId !== "string" ||
      childId.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childId is required.",
      });

      return;
    }

    const ownsChild =
      childRepository.ownsChild(
        user.userId,
        childId
      );

    if (!ownsChild) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    const deleted =
      customLevelRepository
        .deleteCustomLevel(
          childId,
          request.params.customLevelId
        );

    if (!deleted) {
      response.status(404).json({
        message:
          "Custom level was not found.",
      });

      return;
    }

    response.status(204).send();
  }
);

export const customLevelRoutes =
  router;