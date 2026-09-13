import type {
  CustomLearningItemType,
  ICustomLevel,
} from "./ICustomLevel";

export interface CustomLevelItemInput {
  text: string;
  type: CustomLearningItemType;
}

export interface ICustomLevelRepository {
  getCustomLevelsForChild(
    childId: string
  ): ICustomLevel[];

  getCustomLevel(
    childId: string,
    customLevelId: string
  ): ICustomLevel | null;

  createCustomLevel(
    childId: string,
    title: string,
    items: CustomLevelItemInput[]
  ): ICustomLevel;

  deleteCustomLevel(
    childId: string,
    customLevelId: string
  ): boolean;
}