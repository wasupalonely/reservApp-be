import { VenueService } from "../services/venue.service.js";

const service = new VenueService();

export class VenueController {
  async getAllVenues(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        order = "desc",
        latitude,
        longitude,
        name,
        createdById,
        isActive,
      } = req.query;

      const result = await service.getAllVenues({
        page: Number(page),
        limit: Number(limit),
        search,
        sortBy,
        order,
        filters: {
          isActive: isActive ? isActive === "true" : undefined,
          name: name ? name : undefined,
          latitude: latitude ? latitude : undefined,
          longitude: longitude ? longitude : undefined,
          createdById: createdById ? createdById : undefined,
        },
      });

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async createVenue(req, res, next) {
    try {
      const user = req.user;
      const venue = await service.createVenue(req.body, user.id);
      res.status(201).json(venue);
    } catch (error) {
      next(error);
    }
  }

  async updateOpeningHours(req, res, next) {
    try {
      const { id } = req.params;
      const newOpeningHours = req.body;

      const updatedVenue = await service.updateOpeningHours(
        parseInt(id),
        newOpeningHours
      );

      res.status(200).json(updatedVenue);
    } catch (error) {
      next(error);
    }
  }
}
