import type { IChildProfile } from "./IChildProfile";

export interface IChildRepository {
  getChildrenForUser(
    userId: string
  ): IChildProfile[];

  createChild(
    userId: string,
    displayName: string,
    avatar: string
  ): IChildProfile;

  ownsChild(
    userId: string,
    childId: string
  ): boolean;
}