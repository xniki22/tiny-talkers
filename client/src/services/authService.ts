import type { IAuthService } from "../interfaces/IAuthService";
import type { IUser } from "../interfaces/IUser";

interface LoginResponse {
  user: IUser;
  sessionId: string;
}

interface RegisterResponse {
  user: IUser;
}

interface CurrentUserResponse {
  user: IUser;
}

const API_BASE_URL =
  "http://localhost:3000";

const SESSION_STORAGE_KEY =
  "tiny-talkers-session";

export class AuthService
  implements IAuthService
{
  async login(
    email: string,
    password: string
  ): Promise<IUser> {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          "Login failed."
        )
      );
    }

    const data =
      (await response.json()) as LoginResponse;

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      data.sessionId
    );

    return data.user;
  }

  async register(
    email: string,
    password: string
  ): Promise<IUser> {
    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          "Registration failed."
        )
      );
    }

    const data =
      (await response.json()) as RegisterResponse;

    return this.login(
      data.user.email,
      password
    );
  }

  async getCurrentUser():
    Promise<IUser | null> {
    const sessionId =
      this.getSessionId();

    if (!sessionId) {
      return null;
    }

    const response = await fetch(
      `${API_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${sessionId}`,
        },
      }
    );

    if (response.status === 401) {
      this.clearSession();

      return null;
    }

    if (!response.ok) {
      throw new Error(
        "Failed to check authentication."
      );
    }

    const data =
      (await response.json()) as CurrentUserResponse;

    return data.user;
  }

  async logout(): Promise<void> {
    const sessionId =
      this.getSessionId();

    if (sessionId) {
      try {
        await fetch(
          `${API_BASE_URL}/auth/logout`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${sessionId}`,
            },
          }
        );
      } finally {
        this.clearSession();
      }

      return;
    }

    this.clearSession();
  }

  isAuthenticated(): boolean {
    return this.getSessionId() !== null;
  }

  getSessionId(): string | null {
    return localStorage.getItem(
      SESSION_STORAGE_KEY
    );
  }

  private clearSession(): void {
    localStorage.removeItem(
      SESSION_STORAGE_KEY
    );
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

export const authService =
  new AuthService();