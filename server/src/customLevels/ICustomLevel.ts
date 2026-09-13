export type CustomLearningItemType =
  | "WORD"
  | "PHRASE"
  | "SENTENCE";

export interface ICustomLevelItem {
  itemId: string;
  customLevelId: string;
  text: string;
  type: CustomLearningItemType;
  orderNumber: number;
}

export interface ICustomLevel {
  customLevelId: string;
  childId: string;
  title: string;
  items: ICustomLevelItem[];
}