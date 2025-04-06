import Joi from "joi";

// registro de usuarios normales
export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(70).required(),
  phone: Joi.string()
    .min(10)
    .max(10)
    .required()
    .regex(/^[0-9]+$/),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("USER", "VENUE_ADMIN", "SUPERADMIN").default("USER"),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
});
