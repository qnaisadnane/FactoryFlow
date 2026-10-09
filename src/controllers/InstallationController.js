import { InstallationService } from '../services/InstallationService.js';

const getStatus = async (req, res, next) => {
  try {
    const result = await InstallationService.getStatus();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const installer = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body;
    if (!nom || !email || !password) {
      const error = new Error('nom, email et password sont obligatoires');
      error.statusCode = 400;
      throw error;
    }
    const result = await InstallationService.installer({ nom, email, password });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const InstallationController = { getStatus, installer };
