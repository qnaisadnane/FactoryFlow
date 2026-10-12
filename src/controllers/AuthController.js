import { AuthService } from '../services/AuthService.js';

const register = async (req, res, next) => {
  try {
    const { nom, email, password, role } = req.body;
    const user = await AuthService.register(nom, email, password, role);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const AuthController = { register, login };
