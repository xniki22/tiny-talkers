import {
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import request from "supertest";

import { app } from "../../src/app";
import { db } from "../../src/database/database";

beforeEach(() => {
  db.exec(`
    DELETE FROM sessions;
    DELETE FROM custom_level_items;
    DELETE FROM custom_levels;
    DELETE FROM child_item_progress;
    DELETE FROM child_progress;
    DELETE FROM children;
    DELETE FROM users;
  `);
});

describe(
  "Authentication security",
  () => {
    test(
      "registers a parent with a valid email and password",
      async () => {
        const response =
          await request(app)
            .post("/auth/register")
            .send({
              email:
                "parent@example.com",
              password:
                "SecurePass123!",
            });

        expect(
          response.status
        ).toBe(201);

        expect(
          response.body.user
        ).toBeDefined();

        expect(
          response.body.user.email
        ).toBe(
          "parent@example.com"
        );
      }
    );

    test(
      "does not return the password hash after registration",
      async () => {
        const response =
          await request(app)
            .post("/auth/register")
            .send({
              email:
                "parent@example.com",
              password:
                "SecurePass123!",
            });

        expect(
          response.status
        ).toBe(201);

        expect(
          response.body.user
            .password_hash
        ).toBeUndefined();

        expect(
          response.body.user
            .passwordHash
        ).toBeUndefined();

        expect(
          response.body.password
        ).toBeUndefined();
      }
    );

    test(
      "rejects passwords shorter than 8 characters",
      async () => {
        const response =
          await request(app)
            .post("/auth/register")
            .send({
              email:
                "parent@example.com",
              password:
                "short",
            });

        expect(
          response.status
        ).toBe(400);
      }
    );

    test(
      "logs in with the correct password",
      async () => {
        await request(app)
          .post("/auth/register")
          .send({
            email:
              "parent@example.com",
            password:
              "SecurePass123!",
          });

        const response =
          await request(app)
            .post("/auth/login")
            .send({
              email:
                "parent@example.com",
              password:
                "SecurePass123!",
            });

        expect(
          response.status
        ).toBe(200);

        expect(
          typeof response.body
            .sessionId
        ).toBe("string");

        expect(
          response.body.sessionId
            .length
        ).toBeGreaterThan(0);
      }
    );

    test(
      "rejects an incorrect password",
      async () => {
        await request(app)
          .post("/auth/register")
          .send({
            email:
              "parent@example.com",
            password:
              "SecurePass123!",
          });

        const response =
          await request(app)
            .post("/auth/login")
            .send({
              email:
                "parent@example.com",
              password:
                "WrongPassword123!",
            });

        expect(
          response.status
        ).toBe(401);
      }
    );

    test(
      "rejects access without a session",
      async () => {
        const response =
          await request(app)
            .get("/auth/me");

        expect(
          response.status
        ).toBe(401);
      }
    );

    test(
      "rejects an invalid session",
      async () => {
        const response =
          await request(app)
            .get("/auth/me")
            .set(
              "Authorization",
              "Bearer invalid-session"
            );

        expect(
          response.status
        ).toBe(401);
      }
    );

    test(
      "logout invalidates the session",
      async () => {
        await request(app)
          .post("/auth/register")
          .send({
            email:
              "parent@example.com",
            password:
              "SecurePass123!",
          });

        const loginResponse =
          await request(app)
            .post("/auth/login")
            .send({
              email:
                "parent@example.com",
              password:
                "SecurePass123!",
            });

        const sessionId =
          loginResponse.body.sessionId;

        const logoutResponse =
          await request(app)
            .post("/auth/logout")
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            );

        expect(
          logoutResponse.status
        ).toBe(204);

        const meResponse =
          await request(app)
            .get("/auth/me")
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            );

        expect(
          meResponse.status
        ).toBe(401);
      }
    );
  }
);