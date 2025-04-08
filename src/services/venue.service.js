import boom from "@hapi/boom";
import prisma from "../config/db.js";
import { ApprovalService } from "./approval.service.js";

export class VenueService {
  approvalService = new ApprovalService();

  async getAllVenues({ page, limit, search, sortBy, order, filters = {} }) {
    const where = {
      ...filters,
      isActive: filters.isActive !== undefined ? filters.isActive : undefined,
      name: filters.name ? filters.name : undefined,
      latitude: filters.latitude ? filters.latitude : undefined,
      longitude: filters.longitude ? filters.longitude : undefined,
      createdById: filters.createdById ? filters.createdById : undefined,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { contactPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [venues, totalItems] = await Promise.all([
      prisma.venue.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        select: {
          id: true,
          name: true,
          latitude: true,
          longitude: true,
          contactPhone: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.venue.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      venues,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  }

  async getVenue(id) {
    const venue = await prisma.venue.findUnique({ where: { id } });
    if (!venue) {
      throw boom.notFound("Venue not found");
    }
    return venue;
  }

  async createVenue(data, userId) {
    if (await this.approvalService.needsApproval()) {
      throw boom.forbidden("Approval pending");
    } else {
      try {
        if (!data.address) {
          const address = await this.getAddressFromCoordinates(
            data.latitude,
            data.longitude
          );

          data.address = address;
        }

        return prisma.$transaction([
          prisma.venue.create({
            data: {
              ...data,
              createdById: userId,
            },
            select: {
              id: true,
              name: true,
              address: true,
              latitude: true,
              longitude: true,
              contactPhone: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          }),
          prisma.user.update({
            where: { id: data.adminId },
            data: { role: "VENUE_ADMIN" },
          }),
        ]);
      } catch (error) {
        console.log("🚀 ~ VenueService ~ createVenue ~ error:", error);
        throw boom.badImplementation("Error creating venue");
      }
    }
  }

  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      const data = await response.json();
      console.log(
        "🚀 ~ VenueService ~ getAddressFromCoordinates ~ data:",
        data
      );
      return data.display_name;
    } catch (error) {
      throw boom.badGateway("Error getting address from coordinates");
    }
  }

  async updateOpeningHours(venueId, openingHours) {
    return prisma.venue.update({
      where: { id: venueId },
      data: { openingHours },
      select: { id: true, name: true, openingHours: true },
    });
  }
}
