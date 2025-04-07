import Joi from "joi";
import { createPaginationSchema } from "./shared/pagination.schema.js";

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(70).required(),
  phone: Joi.string()
    .min(10)
    .max(10)
    .required()
    .regex(/^[0-9]+$/),
  username: Joi.string().min(3).max(30).required(),
  avatar: Joi.string().required(),
});

export const userPaginationSchema = createPaginationSchema({
  sortFields: ["id", "email", "username", "createdAt", "role"],
  extraFilters: {
    role: Joi.string().valid("USER", "VENUE_ADMIN", "SUPERADMIN"),
    isActive: Joi.boolean(),
  },
});
