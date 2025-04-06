import boom from "@hapi/boom";
import prisma from "../config/db.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export class AuthService {
  async register(userData) {
    try {
      const existentUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { username: userData.username }],
        },
      });

      if (existentUser) {
        throw boom.conflict(
          existentUser.email === userData.email
            ? "Email already registered"
            : "Username already taken",
          {
            available: false,
            conflictField:
              existentUser.email === userData.email ? "email" : "username",
          }
        );
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      return this.sanitizeUser(user);
    } catch (error) {
      console.error("Error en AuthService.register:", error);

      if (error.code === "P2002") {
        const conflictField = error.meta?.target?.includes("email")
          ? "email"
          : "username";
        throw boom.conflict(`${conflictField} already registered`, {
          prismaError: error.meta,
        });
      }

      if (error instanceof PrismaClientKnownRequestError) {
        throw boom.badImplementation("Database error", {
          prismaCode: error.code,
          meta: error.meta,
        });
      }

      if (boom.isBoom(error)) {
        throw error;
      }

      throw boom.badImplementation("Registration failed", {
        originalError: error.message,
        stack: error.stack,
      });
    }
  }

  async login(identifier, password) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw boom.unauthorized("Invalid credentials");
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user, [
        "password",
        "avatar",
        "createdAt",
        "updatedAt",
        "phone",
      ]),
      token,
    };
  }

  sanitizeUser(user, fieldsToExclude = ["password"]) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !fieldsToExclude.includes(key))
    );
  }
}
