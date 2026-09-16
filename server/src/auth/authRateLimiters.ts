import { rateLimit } from "express-rate-limit";

const shouldSkipRateLimiting = () =>
  process.env.NODE_ENV === "test" &&
  process.env.TEST_RATE_LIMITING !== "true";

export const loginRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: shouldSkipRateLimiting,

    message: {
      error:
        "Too many login attempts. Please try again later.",
    },
  });

export const registerRateLimiter =
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: shouldSkipRateLimiting,

    message: {
      error:
        "Too many registration attempts. Please try again later.",
    },
  });