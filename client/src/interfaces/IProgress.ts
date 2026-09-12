export interface IItemProgress {
  itemId: string;
  completed: boolean;
  completedAt?: string;
}

export interface ILevelProgress {
  levelId: string;
  completedItems: number;
  totalItems: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface IChildProgress {
  childId: string;
  completedLevels: number;
  totalLevels: number;
  levelProgress: ILevelProgress[];
}