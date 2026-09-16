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

async function createParent(
  email: string
): Promise<string> {
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

  expect(
    loginResponse.status
  ).toBe(200);

  return loginResponse.body
    .sessionId;
}

async function createChild(
  sessionId: string,
  displayName: string
): Promise<string> {
  const response =
    await request(app)
      .post("/children")
      .set(
        "Authorization",
        `Bearer ${sessionId}`
      )
      .send({
        displayName,
        avatar: "🐻",
      });

  expect(
    response.status
  ).toBe(201);

  return response.body.child
    .childId;
}

describe(
  "Parent and child authorization",
  () => {
    test(
      "allows a parent to access their own child's progress",
      async () => {
        const parentSession =
          await createParent(
            "parent-a@example.com"
          );

        const childId =
          await createChild(
            parentSession,
            "Child A"
          );

        const response =
          await request(app)
            .get(
              `/progress/${childId}`
            )
            .set(
              "Authorization",
              `Bearer ${parentSession}`
            );

        expect(
          response.status
        ).toBe(200);

        expect(
          response.body.childId
        ).toBe(childId);
      }
    );

    test(
      "prevents a parent from reading another parent's child progress",
      async () => {
        const parentASession =
          await createParent(
            "parent-a@example.com"
          );

        const parentBSession =
          await createParent(
            "parent-b@example.com"
          );

        const childBId =
          await createChild(
            parentBSession,
            "Child B"
          );

        const response =
          await request(app)
            .get(
              `/progress/${childBId}`
            )
            .set(
              "Authorization",
              `Bearer ${parentASession}`
            );

        expect(
          response.status
        ).toBe(403);
      }
    );

    test(
      "prevents a parent from reading another parent's item progress",
      async () => {
        const parentASession =
          await createParent(
            "parent-a@example.com"
          );

        const parentBSession =
          await createParent(
            "parent-b@example.com"
          );

        const childBId =
          await createChild(
            parentBSession,
            "Child B"
          );

        const response =
          await request(app)
            .get(
              `/progress/${childBId}/levels/level-1/items`
            )
            .set(
              "Authorization",
              `Bearer ${parentASession}`
            );

        expect(
          response.status
        ).toBe(403);
      }
    );

    test(
      "prevents a parent from completing an item for another parent's child",
      async () => {
        const parentASession =
          await createParent(
            "parent-a@example.com"
          );

        const parentBSession =
          await createParent(
            "parent-b@example.com"
          );

        const childBId =
          await createChild(
            parentBSession,
            "Child B"
          );

        const response =
          await request(app)
            .post(
              "/progress/complete-item"
            )
            .set(
              "Authorization",
              `Bearer ${parentASession}`
            )
            .send({
              childId: childBId,
              levelId: "level-1",
              itemId: "item-1",
            });

        expect(
          response.status
        ).toBe(403);

        const progressRows =
          db
            .prepare(`
              SELECT *
              FROM child_item_progress
              WHERE child_id = ?
            `)
            .all(childBId);

        expect(
          progressRows
        ).toHaveLength(0);
      }
    );

    test(
      "prevents a parent from completing a level for another parent's child",
      async () => {
        const parentASession =
          await createParent(
            "parent-a@example.com"
          );

        const parentBSession =
          await createParent(
            "parent-b@example.com"
          );

        const childBId =
          await createChild(
            parentBSession,
            "Child B"
          );

        const response =
          await request(app)
            .post(
              "/progress/complete-level"
            )
            .set(
              "Authorization",
              `Bearer ${parentASession}`
            )
            .send({
              childId: childBId,
              levelId: "level-1",
            });

        expect(
          response.status
        ).toBe(403);

        const progressRows =
          db
            .prepare(`
              SELECT *
              FROM child_progress
              WHERE child_id = ?
            `)
            .all(childBId);

        expect(
          progressRows
        ).toHaveLength(0);
      }
    );

    test(
      "prevents a parent from viewing another child's custom levels",
      async () => {
        const parentASession =
          await createParent(
            "parent-a@example.com"
          );

        const parentBSession =
          await createParent(
            "parent-b@example.com"
          );

        const childBId =
          await createChild(
            parentBSession,
            "Child B"
          );

        const response =
          await request(app)
            .get(
              "/custom-levels"
            )
            .query({
              childId: childBId,
            })
            .set(
              "Authorization",
              `Bearer ${parentASession}`
            );

        expect(
          response.status
        ).toBe(403);
      }
    );

    test(
      "prevents a parent from creating a custom level for another parent's child",
      async () => {
        const parentASession =
          await createParent(
            "parent-a@example.com"
          );

        const parentBSession =
          await createParent(
            "parent-b@example.com"
          );

        const childBId =
          await createChild(
            parentBSession,
            "Child B"
          );

        const response =
          await request(app)
            .post(
              "/custom-levels"
            )
            .set(
              "Authorization",
              `Bearer ${parentASession}`
            )
            .send({
              childId: childBId,
              title:
                "Unauthorized Level",
              items: [
                {
                  text: "Cat",
                  type: "WORD",
                },
              ],
            });

        expect(
          response.status
        ).toBe(403);

        const levels =
          db
            .prepare(`
              SELECT *
              FROM custom_levels
              WHERE child_id = ?
            `)
            .all(childBId);

        expect(
          levels
        ).toHaveLength(0);
      }
    );

    test(
      "prevents AI generation for another parent's child",
      async () => {
        const parentASession =
          await createParent(
            "parent-a@example.com"
          );

        const parentBSession =
          await createParent(
            "parent-b@example.com"
          );

        const childBId =
          await createChild(
            parentBSession,
            "Child B"
          );

        const response =
          await request(app)
            .post(
              "/custom-levels/generate"
            )
            .set(
              "Authorization",
              `Bearer ${parentASession}`
            )
            .send({
              childId: childBId,
              childName: "Child B",
              topic:
                "Animals at the zoo",
            });

        expect(
          response.status
        ).toBe(403);
      }
    );
  }
);