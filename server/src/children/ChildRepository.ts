import { randomUUID } from "crypto";

import { db } from "../database/database";

import type { IChildProfile } from "./IChildProfile";
import type { IChildRepository } from "./IChildRepository";

interface ChildRow {
  child_id: string;
  display_name: string;
  avatar: string;
}

interface ChildOwnershipRow {
  child_id: string;
}

export class ChildRepository
  implements IChildRepository
{
  getChildrenForUser(
    userId: string
  ): IChildProfile[] {
    const rows =
      db
        .prepare(`
          SELECT
            child_id,
            display_name,
            avatar
          FROM children
          WHERE user_id = ?
          ORDER BY created_at ASC
        `)
        .all(userId) as ChildRow[];

    return rows.map((row) => ({
      childId: row.child_id,
      displayName: row.display_name,
      avatar: row.avatar,
    }));
  }

  createChild(
    userId: string,
    displayName: string,
    avatar: string
  ): IChildProfile {
    const childId = randomUUID();

    const createdAt =
      new Date().toISOString();

    db.prepare(`
      INSERT INTO children (
        child_id,
        user_id,
        display_name,
        avatar,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)
    `).run(
      childId,
      userId,
      displayName,
      avatar,
      createdAt
    );

    return {
      childId,
      displayName,
      avatar,
    };
  }

  ownsChild(
    userId: string,
    childId: string
  ): boolean {
    const row =
      db
        .prepare(`
          SELECT child_id
          FROM children
          WHERE child_id = ?
          AND user_id = ?
        `)
        .get(
          childId,
          userId
        ) as
          | ChildOwnershipRow
          | undefined;

    return row !== undefined;
  }
}