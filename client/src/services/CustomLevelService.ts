import type {
  ICustomLevel,
  ICustomLevelItemInput,
} from "../interfaces/ICustomLevel";

import type {
  ICustomLevelService,
} from "../interfaces/ICustomLevelService";

import { authService } from "./authService";

interface CustomLevelsResponse {
  customLevels: ICustomLevel[];
}

interface CustomLevelResponse {
  customLevel: ICustomLevel;
}

export interface GeneratedCustomLevel {
  title: string;

  items: ICustomLevelItemInput[];
}

interface GeneratedCustomLevelResponse {
  generatedLevel: GeneratedCustomLevel;
}

const API_BASE_URL =
  "http://localhost:3000";

export class CustomLevelService
  implements ICustomLevelService
{
  async getCustomLevels(
    childId: string
  ): Promise<ICustomLevel[]> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/custom-levels?childId=${encodeURIComponent(
        childId
      )}`,
      {
        headers: {
          Authorization:
            `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          "Could not load custom levels."
        )
      );
    }

    const data =
      (await response.json()) as CustomLevelsResponse;

    return data.customLevels;
  }

  async generateCustomLevel(
    childId: string,
    childName: string,
    topic: string
  ): Promise<GeneratedCustomLevel> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/custom-levels/generate`,
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
          childName,
          topic,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          "Could not generate a custom level."
        )
      );
    }

    const data =
      (await response.json()) as GeneratedCustomLevelResponse;

    return data.generatedLevel;
  }

  async createCustomLevel(
    childId: string,
    title: string,
    items: ICustomLevelItemInput[]
  ): Promise<ICustomLevel> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/custom-levels`,
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
          title,
          items,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          "Could not create custom level."
        )
      );
    }

    const data =
      (await response.json()) as CustomLevelResponse;

    return data.customLevel;
  }

  async deleteCustomLevel(
    childId: string,
    customLevelId: string
  ): Promise<void> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/custom-levels/${customLevelId}?childId=${encodeURIComponent(
        childId
      )}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          "Could not delete custom level."
        )
      );
    }
  }

  private async getErrorMessage(
    response: Response,
    fallbackMessage: string
  ): Promise<string> {
    try {
      const data =
        (await response.json()) as {
          message?: string;
        };

      return (
        data.message ??
        fallbackMessage
      );
    } catch {
      return fallbackMessage;
    }
  }
}

export const customLevelService =
  new CustomLevelService();