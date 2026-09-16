import {
  afterAll,
  beforeAll,
  describe,
  expect,
  test,
} from "vitest";
import request from "supertest";

process.env.TEST_RATE_LIMITING =
  "true";

let app: typeof import("../../src/app").app;

beforeAll(async () => {
  const appModule =
    await import("../../src/app");

  app = appModule.app;
});

afterAll(() => {
  delete process.env.TEST_RATE_LIMITING;
});

describe(
  "Authentication rate limiting",
  () => {
    test(
      "blocks login requests after 10 attempts",
      async () => {
        for (
          let attempt = 1;
          attempt <= 10;
          attempt++
        ) {
          const response =
            await request(app)
              .post("/auth/login")
              .send({
                email:
                  "rate-limit@example.com",
                password:
                  "WrongPassword123!",
              });

          expect(
            response.status
          ).toBe(401);
        }

        const blockedResponse =
          await request(app)
            .post("/auth/login")
            .send({
              email:
                "rate-limit@example.com",
              password:
                "WrongPassword123!",
            });

        expect(
          blockedResponse.status
        ).toBe(429);

        expect(
          blockedResponse.body.error
        ).toBe(
          "Too many login attempts. Please try again later."
        );
      }
    );

    test(
      "blocks registration requests after 5 attempts",
      async () => {
        for (
          let attempt = 1;
          attempt <= 5;
          attempt++
        ) {
          const response =
            await request(app)
              .post("/auth/register")
              .send({
                email: "",
                password:
                  "SecurePass123!",
              });

          expect(
            response.status
          ).toBe(400);
        }

        const blockedResponse =
          await request(app)
            .post("/auth/register")
            .send({
              email: "",
              password:
                "SecurePass123!",
            });

        expect(
          blockedResponse.status
        ).toBe(429);

        expect(
          blockedResponse.body.error
        ).toBe(
          "Too many registration attempts. Please try again later."
        );
      }
    );
  }
);