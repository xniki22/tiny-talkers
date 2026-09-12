import type { IUser } from "./IUser";

export interface IAuthenticationManager {
  register(
    email: string,
    password: string
  ): Promise<IUser>;

  login(
    email: string,
    password: string
  ): Promise<{
    user: IUser;
    sessionId: string;
  }>;

  getUserBySession(
    sessionId: string
  ): IUser | null;

  logout(
    sessionId: string
  ): void;
}