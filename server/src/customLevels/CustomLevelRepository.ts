import { randomUUID } from "crypto";

import { db } from "../database/database";

import type {
  CustomLearningItemType,
  ICustomLevel,
  ICustomLevelItem,
} from "./ICustomLevel";

import type {
  CustomLevelItemInput,
  ICustomLevelRepository,
} from "./ICustomLevelRepository1";

interface CustomLevelRow {
  custom_level_id: string;
  child_id: string;
  title: string;
}

interface CustomLevelItemRow {
  item_id: string;
  custom_level_id: string;
  text: string;
  item_type: CustomLearningItemType;
  order_number: number;
}

export class CustomLevelRepository
  implements ICustomLevelRepository
{
  getCustomLevelsForChild(
    childId: string
  ): ICustomLevel[] {
    const levelRows =
      db
        .prepare(`
          SELECT
            custom_level_id,
            child_id,
            title
          FROM custom_levels
          WHERE child_id = ?
          ORDER BY created_at ASC
        `)
        .all(
          childId
        ) as CustomLevelRow[];

    return levelRows.map(
      (levelRow) => ({
        customLevelId:
          levelRow.custom_level_id,

        childId:
          levelRow.child_id,

        title:
          levelRow.title,

        items:
          this.getItemsForLevel(
            levelRow.custom_level_id
          ),
      })
    );
  }

  getCustomLevel(
    childId: string,
    customLevelId: string
  ): ICustomLevel | null {
    const levelRow =
      db
        .prepare(`
          SELECT
            custom_level_id,
            child_id,
            title
          FROM custom_levels
          WHERE custom_level_id = ?
          AND child_id = ?
        `)
        .get(
          customLevelId,
          childId
        ) as
          | CustomLevelRow
          | undefined;

    if (!levelRow) {
      return null;
    }

    return {
      customLevelId:
        levelRow.custom_level_id,

      childId:
        levelRow.child_id,

      title:
        levelRow.title,

      items:
        this.getItemsForLevel(
          levelRow.custom_level_id
        ),
    };
  }

  createCustomLevel(
    childId: string,
    title: string,
    items: CustomLevelItemInput[]
  ): ICustomLevel {
    const customLevelId =
      randomUUID();

    const createdAt =
      new Date().toISOString();

    const insertLevel =
      db.prepare(`
        INSERT INTO custom_levels (
          custom_level_id,
          child_id,
          title,
          created_at
        )
        VALUES (?, ?, ?, ?)
      `);

    const insertItem =
      db.prepare(`
        INSERT INTO custom_level_items (
          item_id,
          custom_level_id,
          text,
          item_type,
          order_number,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `);

    const createLevel =
      db.transaction(() => {
        insertLevel.run(
          customLevelId,
          childId,
          title,
          createdAt
        );

        items.forEach(
          (item, index) => {
            insertItem.run(
              randomUUID(),
              customLevelId,
              item.text,
              item.type,
              index + 1,
              createdAt
            );
          }
        );
      });

    createLevel();

    const createdLevel =
      this.getCustomLevel(
        childId,
        customLevelId
      );

    if (!createdLevel) {
      throw new Error(
        "Custom level could not be created."
      );
    }

    return createdLevel;
  }

  deleteCustomLevel(
    childId: string,
    customLevelId: string
  ): boolean {
    const result =
      db
        .prepare(`
          DELETE FROM custom_levels
          WHERE custom_level_id = ?
          AND child_id = ?
        `)
        .run(
          customLevelId,
          childId
        );

    return result.changes > 0;
  }

  private getItemsForLevel(
    customLevelId: string
  ): ICustomLevelItem[] {
    const rows =
      db
        .prepare(`
          SELECT
            item_id,
            custom_level_id,
            text,
            item_type,
            order_number
          FROM custom_level_items
          WHERE custom_level_id = ?
          ORDER BY order_number ASC
        `)
        .all(
          customLevelId
        ) as CustomLevelItemRow[];

    return rows.map((row) => ({
      itemId:
        row.item_id,

      customLevelId:
        row.custom_level_id,

      text:
        row.text,

      type:
        row.item_type,

      orderNumber:
        row.order_number,
    }));
  }
}