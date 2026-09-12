import type { ILearningItem } from "./ILearningItem";

export interface ILevel {
  levelId: string;
  levelNumber: number;
  title: string;
  description: string;
  icon: string;
  items: ILearningItem[];
}