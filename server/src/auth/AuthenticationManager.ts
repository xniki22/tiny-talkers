import { randomUUID } from "crypto";
import argon2 from "argon2";

import { db } from "../database/database";

import type { IUser } from "./IUser";
import type { IAuthenticationManager } from "./IAuthenticationManager";

interface UserRow {
  user_id: string;
  email: string;
  password_hash: string;
}

interface SessionUserRow {
  user_id: string;
  email: string;
}

const SESSION_DURATION_DAYS = 7;

export class AuthenticationManager
  implements IAuthenticationManager
{
  async register(
    email: string,
    password: string
  ): Promise<IUser> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser = db
      .prepare(`
        SELECT user_id
        FROM users
        WHERE email = ?
      `)
      .get(normalizedEmail);

    if (existingUser) {
      throw new Error(
        "An account with this email already exists."
      );
    }

    const userId = randomUUID();

    const passwordHash =
      await argon2.hash(password);

    const createdAt =
      new Date().toISOString();

    db.prepare(`
      INSERT INTO users (
        user_id,
        email,
        password_hash,
        created_at
      )
      VALUES (?, ?, ?, ?)
    `).run(
      userId,
      normalizedEmail,
      passwordHash,
      createdAt
    );

    return {
      userId,
      email: normalizedEmail,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    user: IUser;
    sessionId: string;
  }> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const row = db
      .prepare(`
        SELECT
          user_id,
          email,
          password_hash
        FROM users
        WHERE email = ?
      `)
      .get(normalizedEmail) as
        | UserRow
        | undefined;

    if (!row) {
      throw new Error(
        "Invalid email or password."
      );
    }

    const passwordMatches =
      await argon2.verify(
        row.password_hash,
        password
      );

    if (!passwordMatches) {
      throw new Error(
        "Invalid email or password."
      );
    }

    const sessionId = randomUUID();

    const createdAt =
      new Date();

    const expiresAt =
      new Date(createdAt);

    expiresAt.setDate(
      expiresAt.getDate() +
        SESSION_DURATION_DAYS
    );

    db.prepare(`
      INSERT INTO sessions (
        session_id,
        user_id,
        created_at,
        expires_at
      )
      VALUES (?, ?, ?, ?)
    `).run(
      sessionId,
      row.user_id,
      createdAt.toISOString(),
      expiresAt.toISOString()
    );

    return {
      user: {
        userId: row.user_id,
        email: row.email,
      },
      sessionId,
    };
  }

  getUserBySession(
    sessionId: string
  ): IUser | null {
    const now =
      new Date().toISOString();

    const row = db
      .prepare(`
        SELECT
          users.user_id,
          users.email
        FROM sessions
        INNER JOIN users
          ON users.user_id =
             sessions.user_id
        WHERE sessions.session_id = ?
        AND sessions.expires_at > ?
      `)
      .get(
        sessionId,
        now
      ) as
        | SessionUserRow
        | undefined;

    if (!row) {
      return null;
    }

    return {
      userId: row.user_id,
      email: row.email,
    };
  }

  logout(
    sessionId: string
  ): void {
    db.prepare(`
      DELETE FROM sessions
      WHERE session_id = ?
    `).run(sessionId);
  }
}