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

async function createParentAndChild() {
  const email =
    "parent@example.com";
  const password =
    "SecurePass123!";

  await request(app)
    .post("/auth/register")
    .send({
      email,
      password,
    });

  const loginResponse =
    await request(app)
      .post("/auth/login")
      .send({
        email,
        password,
      });

  const sessionId =
    loginResponse.body.sessionId;

  const childResponse =
    await request(app)
      .post("/children")
      .set(
        "Authorization",
        `Bearer ${sessionId}`
      )
      .send({
        displayName: "Test Child",
        avatar: "🐻",
      });

  return {
    sessionId,
    childId:
      childResponse.body.child
        .childId,
  };
}

describe(
  "Custom level validation",
  () => {
    test(
      "requires authentication to create a custom level",
      async () => {
        const response =
          await request(app)
            .post("/custom-levels")
            .send({
              childId: "fake-child",
              title: "Animals",
              items: [
                {
                  text: "Cat",
                  type: "WORD",
                },
              ],
            });

        expect(
          response.status
        ).toBe(401);
      }
    );

    test(
      "rejects a custom level without a title",
      async () => {
        const {
          sessionId,
          childId,
        } =
          await createParentAndChild();

        const response =
          await request(app)
            .post("/custom-levels")
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            )
            .send({
              childId,
              title: "",
              items: [
                {
                  text: "Cat",
                  type: "WORD",
                },
              ],
            });

        expect(
          response.status
        ).toBe(400);
      }
    );

    test(
      "rejects more than 5 learning items",
      async () => {
        const {
          sessionId,
          childId,
        } =
          await createParentAndChild();

        const items =
          Array.from(
            { length: 6 },
            (_, index) => ({
              text:
                `Word ${index + 1}`,
              type: "WORD",
            })
          );

        const response =
          await request(app)
            .post("/custom-levels")
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            )
            .send({
              childId,
              title: "Too Many",
              items,
            });

        expect(
          response.status
        ).toBe(400);
      }
    );

    test(
      "rejects an invalid learning item type",
      async () => {
        const {
          sessionId,
          childId,
        } =
          await createParentAndChild();

        const response =
          await request(app)
            .post("/custom-levels")
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            )
            .send({
              childId,
              title: "Animals",
              items: [
                {
                  text: "Cat",
                  type: "INVALID",
                },
              ],
            });

        expect(
          response.status
        ).toBe(400);
      }
    );

    test(
      "rejects learning item text longer than 120 characters",
      async () => {
        const {
          sessionId,
          childId,
        } =
          await createParentAndChild();

        const response =
          await request(app)
            .post("/custom-levels")
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            )
            .send({
              childId,
              title: "Animals",
              items: [
                {
                  text: "a".repeat(121),
                  type: "WORD",
                },
              ],
            });

        expect(
          response.status
        ).toBe(400);
      }
    );

    test(
      "creates a valid custom level",
      async () => {
        const {
          sessionId,
          childId,
        } =
          await createParentAndChild();

        const response =
          await request(app)
            .post("/custom-levels")
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            )
            .send({
              childId,
              title: "Animals",
              items: [
                {
                  text: "Cat",
                  type: "WORD",
                },
                {
                  text: "Big dog",
                  type: "PHRASE",
                },
              ],
            });

        expect(
          response.status
        ).toBe(201);

        expect(
          response.body.customLevel
        ).toBeDefined();
      }
    );

    test(
      "rejects an empty AI practice topic",
      async () => {
        const {
          sessionId,
          childId,
        } =
          await createParentAndChild();

        const response =
          await request(app)
            .post(
              "/custom-levels/generate"
            )
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            )
            .send({
              childId,
              childName:
                "Test Child",
              topic: "",
            });

        expect(
          response.status
        ).toBe(400);
      }
    );

    test(
      "rejects an AI practice topic longer than 300 characters",
      async () => {
        const {
          sessionId,
          childId,
        } =
          await createParentAndChild();

        const response =
          await request(app)
            .post(
              "/custom-levels/generate"
            )
            .set(
              "Authorization",
              `Bearer ${sessionId}`
            )
            .send({
              childId,
              childName:
                "Test Child",
              topic: "a".repeat(301),
            });

        expect(
          response.status
        ).toBe(400);
      }
    );
  }
);