export type LearningItemType =
  | "WORD"
  | "PHRASE"
  | "SENTENCE";

export interface ILearningItem {
  itemId: string;
  levelId: string;
  type: LearningItemType;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  orderNumber: number;
}