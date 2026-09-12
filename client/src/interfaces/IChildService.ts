import type { IChildProfile } from "./IChildProfile";

export interface IChildService {
  getChildren(): Promise<IChildProfile[]>;

  createChild(
    displayName: string,
    avatar: string
  ): Promise<IChildProfile>;
}