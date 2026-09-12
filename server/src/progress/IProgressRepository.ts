export interface IProgressRepository {
  getCompletedLevels(
    childId: string
  ): string[];

  completeLevel(
    childId: string,
    levelId: string
  ): void;

  getCompletedItems(
    childId: string,
    levelId: string
  ): string[];

  completeItem(
    childId: string,
    levelId: string,
    itemId: string
  ): void;
}