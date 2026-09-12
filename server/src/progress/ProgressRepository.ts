import { db } from "../database/database";
import type { IProgressRepository } from "./IProgressRepository";

interface LevelProgressRow {
  level_id: string;
}

interface ItemProgressRow {
  item_id: string;
}

export class ProgressRepository
  implements IProgressRepository
{
  getCompletedLevels(
    childId: string
  ): string[] {
    const rows = db
      .prepare(`
        SELECT level_id
        FROM child_progress
        WHERE child_id = ?
        AND completed = 1
      `)
      .all(childId) as LevelProgressRow[];

    return rows.map((row) => row.level_id);
  }

  completeLevel(
    childId: string,
    levelId: string
  ): void {
    const completedAt =
      new Date().toISOString();

    db.prepare(`
      INSERT INTO child_progress (
        child_id,
        level_id,
        completed,
        completed_at
      )
      VALUES (?, ?, 1, ?)

      ON CONFLICT(child_id, level_id)
      DO UPDATE SET
        completed = 1,
        completed_at = excluded.completed_at
    `).run(
      childId,
      levelId,
      completedAt
    );
  }

  getCompletedItems(
    childId: string,
    levelId: string
  ): string[] {
    const rows = db
      .prepare(`
        SELECT item_id
        FROM child_item_progress
        WHERE child_id = ?
        AND level_id = ?
        AND completed = 1
      `)
      .all(
        childId,
        levelId
      ) as ItemProgressRow[];

    return rows.map((row) => row.item_id);
  }

  completeItem(
    childId: string,
    levelId: string,
    itemId: string
  ): void {
    const completedAt =
      new Date().toISOString();

    db.prepare(`
      INSERT INTO child_item_progress (
        child_id,
        level_id,
        item_id,
        completed,
        completed_at
      )
      VALUES (?, ?, ?, 1, ?)

      ON CONFLICT(
        child_id,
        level_id,
        item_id
      )
      DO UPDATE SET
        completed = 1,
        completed_at = excluded.completed_at
    `).run(
      childId,
      levelId,
      itemId,
      completedAt
    );
  }
}