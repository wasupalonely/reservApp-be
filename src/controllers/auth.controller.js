import { AuthService } from "../services/auth.service.js";

const service = new AuthService();

export class AuthController {
  async register(req, res, next) {
    try {
      const user = await service.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const user = await service.login(req.body.identifier, req.body.password);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
