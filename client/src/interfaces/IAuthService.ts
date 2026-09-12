import type { IUser } from "./IUser";

export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<IUser>;

  register(
    email: string,
    password: string
  ): Promise<IUser>;

  logout(): Promise<void>;

  getCurrentUser(): Promise<IUser | null>;

  isAuthenticated(): boolean;

  getSessionId(): string | null;
}