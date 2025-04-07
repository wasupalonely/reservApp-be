import { Role } from "@prisma/client";
import prisma from "../config/db.js";
import boom from "@hapi/boom";

export class UserService {
  async getAllUsers({ page, limit, search, sortBy, order, filters = {} }) {
    if (filters.role && !Object.values(Role).includes(filters.role)) {
      throw boom.badRequest(
        `Invalid role. Valid values: ${Object.values(Role).join(", ")}`
      );
    }

    const where = {
      ...filters,
      role: filters.role ? filters.role : undefined, // Solo incluye si existe
      isActive: filters.isActive !== undefined ? filters.isActive : undefined,
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      users,
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

  async getProfile(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        avatar: true,
        phone: true,
      },
    });
    if (!user) {
      throw boom.notFound("User not found");
    }

    return user;
  }

  async updateProfile(id, data) {
    try {
      return prisma.user.update({ where: { id }, data });
    } catch (error) {
      throw boom.badImplementation("Error updating user");
    }
  }
}
