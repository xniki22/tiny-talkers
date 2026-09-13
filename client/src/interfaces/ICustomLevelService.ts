import type {
  ICustomLevel,
  ICustomLevelItemInput,
} from "./ICustomLevel";

export interface ICustomLevelService {
  getCustomLevels(
    childId: string
  ): Promise<ICustomLevel[]>;

  createCustomLevel(
    childId: string,
    title: string,
    items: ICustomLevelItemInput[]
  ): Promise<ICustomLevel>;

  deleteCustomLevel(
    childId: string,
    customLevelId: string
  ): Promise<void>;
}