import type { ILevel } from "./ILevel";
import type { IChildProgress } from "./IProgress";

export interface ILearningService {
  getLevels(childId: string): Promise<ILevel[]>;

  getProgress(childId: string): Promise<IChildProgress>;

  completeItem(
    childId: string,
    itemId: string
  ): Promise<IChildProgress>;
}