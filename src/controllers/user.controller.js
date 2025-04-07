import { UserService } from "../services/user.service.js";

const service = new UserService();

export class UserController {
  async getAllUsers(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        order = "desc",
        role,
        isActive,
      } = req.query;

      const result = await service.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        search,
        sortBy,
        order,
        filters: {
          role,
          isActive: isActive ? isActive === "true" : undefined,
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

  async profile(req, res, next) {
    try {
      const user = await service.getProfile(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await service.updateProfile(req.user.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
