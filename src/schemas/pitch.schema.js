import { createPaginationSchema } from "./shared/pagination.schema";

export const pitchPaginationSchema = createPaginationSchema({
    sortFields: ["id", "name", "createdAt", "pricePerHour"],
    extraFilters: {
        venueId: Joi.number().integer(),
        isActive: Joi.boolean(),
        type: Joi.string().valid("SYNTHETIC_FOOTBALL", "BEACH_VOLLEY"),
    }
});