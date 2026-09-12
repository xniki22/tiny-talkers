import type { IProgressService } from "../interfaces/IProgressService";

import { authService } from "./authService";

interface CompletedLevelsResponse {
  childId: string;
  completedLevelIds: string[];
}

interface CompletedItemsResponse {
  childId: string;
  levelId: string;
  completedItemIds: string[];
}

const API_BASE_URL =
  "http://localhost:3000";

export class ProgressService
  implements IProgressService
{
  async getCompletedLevels(
    childId: string
  ): Promise<string[]> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/progress/${childId}`,
      {
        headers: {
          Authorization:
            `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load completed levels."
      );
    }

    const data =
      (await response.json()) as CompletedLevelsResponse;

    return data.completedLevelIds;
  }

  async completeLevel(
    childId: string,
    levelId: string
  ): Promise<string[]> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/progress/complete-level`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          childId,
          levelId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to complete level."
      );
    }

    const data =
      (await response.json()) as CompletedLevelsResponse;

    return data.completedLevelIds;
  }

  async getCompletedItems(
    childId: string,
    levelId: string
  ): Promise<string[]> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/progress/${childId}/levels/${levelId}/items`,
      {
        headers: {
          Authorization:
            `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load completed items."
      );
    }

    const data =
      (await response.json()) as CompletedItemsResponse;

    return data.completedItemIds;
  }

  async completeItem(
    childId: string,
    levelId: string,
    itemId: string
  ): Promise<string[]> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/progress/complete-item`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          childId,
          levelId,
          itemId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to complete item."
      );
    }

    const data =
      (await response.json()) as CompletedItemsResponse;

    return data.completedItemIds;
  }
}

export const progressService =
  new ProgressService();