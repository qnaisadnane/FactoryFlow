import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

export default authMiddleware;
