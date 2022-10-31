import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid email format").isEmail(),
  body("password", "Password should be from 3 to 16 long").isLength({
    min: 5,
    max: 16,
  }),
  body("username", "Enter user name from 3 to 16 long").isLength({
    min: 3,
    max: 16,
  }),
  body("avatarUrl", "Invalid URL").optional().isURL(""),
  body("role").optional().isIn(["user", "employee", "admin"]),
];

export const postValidation = [
  body("title", "Enter title").isLength({ min: 3 }).isString(),
  body("text", "Enter text").isLength({ min: 3 }).isString(),
  body("tags", "Enter user name from 3 to 16 long").isArray().optional(),
  body("imageUrl", "Invalid URL").optional().isURL(""),
];
