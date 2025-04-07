import { createPaginationSchema } from "./shared/pagination.schema.js";
import Joi from "joi";

export const openingHoursSchema = Joi.object()
  .pattern(
    Joi.string().valid(
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ),
    Joi.alternatives().try(
      Joi.string().pattern(
        /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]-([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
      ),
      Joi.string().valid("closed", "24/7")
    )
  )
  .min(1)
  .messages({
    "object.min": "Debe incluir al menos un día de horario",
    "any.required": "El horario es obligatorio",
  });

export const venuePaginationSchema = createPaginationSchema({
  sortFields: ["id", "name", "createdAt"],
  extraFilters: {
    isActive: Joi.boolean(),
    name: Joi.string().min(3).max(70),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    createdById: Joi.number().integer().min(1),
  },
});

export const createVenueSchema = Joi.object({
  name: Joi.string().min(3).max(70).required(),
  description: Joi.string().min(3).max(255).required(),
  openingHours: openingHoursSchema.required(),
  contactEmail: Joi.string().email().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  contactPhone: Joi.string()
    .min(10)
    .max(10)
    .required()
    .regex(/^[0-9]+$/),
  adminId: Joi.number().integer().min(1).required(),
  website: Joi.string().uri().optional(),
  // Maybe add social media links
});
