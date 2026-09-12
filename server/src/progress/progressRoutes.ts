import { Router } from "express";

import { AuthenticationManager } from "../auth/AuthenticationManager";
import { ChildRepository } from "../children/ChildRepository";
import { ProgressRepository } from "./ProgressRepository";

const router = Router();

const progressRepository =
  new ProgressRepository();

const childRepository =
  new ChildRepository();

const authenticationManager =
  new AuthenticationManager();

function getAuthenticatedUserId(
  authorization: string | undefined
): string | null {
  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer "
    )
  ) {
    return null;
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

  return user?.userId ?? null;
}

function canAccessChild(
  userId: string,
  childId: string
): boolean {
  return childRepository.ownsChild(
    userId,
    childId
  );
}

router.get(
  "/:childId",
  (request, response) => {
    const userId =
      getAuthenticatedUserId(
        request.headers.authorization
      );

    if (!userId) {
      response.status(401).json({
        message:
          "Authentication required.",
      });

      return;
    }

    const { childId } =
      request.params;

    if (
      !canAccessChild(
        userId,
        childId
      )
    ) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    const completedLevelIds =
      progressRepository
        .getCompletedLevels(
          childId
        );

    response.json({
      childId,
      completedLevelIds,
    });
  }
);

router.get(
  "/:childId/levels/:levelId/items",
  (request, response) => {
    const userId =
      getAuthenticatedUserId(
        request.headers.authorization
      );

    if (!userId) {
      response.status(401).json({
        message:
          "Authentication required.",
      });

      return;
    }

    const {
      childId,
      levelId,
    } = request.params;

    if (
      !canAccessChild(
        userId,
        childId
      )
    ) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    const completedItemIds =
      progressRepository
        .getCompletedItems(
          childId,
          levelId
        );

    response.json({
      childId,
      levelId,
      completedItemIds,
    });
  }
);

router.post(
  "/complete-item",
  (request, response) => {
    const userId =
      getAuthenticatedUserId(
        request.headers.authorization
      );

    if (!userId) {
      response.status(401).json({
        message:
          "Authentication required.",
      });

      return;
    }

    const {
      childId,
      levelId,
      itemId,
    } = request.body;

    if (
      typeof childId !== "string" ||
      typeof levelId !== "string" ||
      typeof itemId !== "string" ||
      childId.trim() === "" ||
      levelId.trim() === "" ||
      itemId.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childId, levelId, and itemId are required.",
      });

      return;
    }

    if (
      !canAccessChild(
        userId,
        childId
      )
    ) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    progressRepository.completeItem(
      childId,
      levelId,
      itemId
    );

    const completedItemIds =
      progressRepository
        .getCompletedItems(
          childId,
          levelId
        );

    response.json({
      childId,
      levelId,
      completedItemIds,
    });
  }
);

router.post(
  "/complete-level",
  (request, response) => {
    const userId =
      getAuthenticatedUserId(
        request.headers.authorization
      );

    if (!userId) {
      response.status(401).json({
        message:
          "Authentication required.",
      });

      return;
    }

    const {
      childId,
      levelId,
    } = request.body;

    if (
      typeof childId !== "string" ||
      typeof levelId !== "string" ||
      childId.trim() === "" ||
      levelId.trim() === ""
    ) {
      response.status(400).json({
        message:
          "childId and levelId are required.",
      });

      return;
    }

    if (
      !canAccessChild(
        userId,
        childId
      )
    ) {
      response.status(403).json({
        message:
          "You do not have access to this child.",
      });

      return;
    }

    progressRepository.completeLevel(
      childId,
      levelId
    );

    const completedLevelIds =
      progressRepository
        .getCompletedLevels(
          childId
        );

    response.json({
      childId,
      completedLevelIds,
    });
  }
);

export const progressRoutes =
  router;