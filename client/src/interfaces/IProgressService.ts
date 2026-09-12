export interface IProgressService {
  getCompletedLevels(
    childId: string
  ): Promise<string[]>;

  completeLevel(
    childId: string,
    levelId: string
  ): Promise<string[]>;

  getCompletedItems(
    childId: string,
    levelId: string
  ): Promise<string[]>;

  completeItem(
    childId: string,
    levelId: string,
    itemId: string
  ): Promise<string[]>;
}