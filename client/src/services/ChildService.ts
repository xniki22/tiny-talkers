import type { IChildService } from "../interfaces/IChildService";
import type { IChildProfile } from "../interfaces/IChildProfile";

import { authService } from "./authService";

interface ChildrenResponse {
  children: IChildProfile[];
}

interface ChildResponse {
  child: IChildProfile;
}

const API_BASE_URL =
  "http://localhost:3000";

export class ChildService
  implements IChildService
{
  async getChildren():
    Promise<IChildProfile[]> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/children`,
      {
        headers: {
          Authorization:
            `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load child profiles."
      );
    }

    const data =
      (await response.json()) as ChildrenResponse;

    return data.children;
  }

  async createChild(
    displayName: string,
    avatar: string
  ): Promise<IChildProfile> {
    const sessionId =
      authService.getSessionId();

    if (!sessionId) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/children`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          displayName,
          avatar,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to create child profile."
      );
    }

    const data =
      (await response.json()) as ChildResponse;

    return data.child;
  }
}

export const childService =
  new ChildService();