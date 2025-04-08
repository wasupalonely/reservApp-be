import express from "express";
import validateRequest from "../middlewares/validation.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";
import {
  createVenueSchema,
  openingHoursSchema,
  venuePaginationSchema,
} from "../schemas/venue.schema.js";
import { VenueController } from "../controllers/venue.controller.js";

const venueRouter = express.Router();
const controller = new VenueController();

venueRouter.get(
  "/",
  validateRequest(venuePaginationSchema),
  controller.getAllVenues
);
venueRouter.post(
  "/",
  authenticate(["VENUE_ADMIN", "SUPERADMIN"]),
  validateRequest(createVenueSchema),
  controller.createVenue
);
venueRouter.patch(
  "/:id/opening-hours",
  authenticate(["VENUE_ADMIN"]),
  validateRequest(openingHoursSchema, "body"),
  controller.updateOpeningHours
);

export default venueRouter;
