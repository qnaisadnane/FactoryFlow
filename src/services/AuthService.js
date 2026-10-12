import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

const register = async (nom, email, password, role) => {
  const existe = await UserRepository.findByEmail(email);
  if (existe) {
    const error = new Error('Email déjà utilisé');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserRepository.create({ nom, email, password: hashedPassword, role });

  return {
    id: user._id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  };
};

const login = async (email, password) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Email ou mot de passe incorrect');
    error.statusCode = 401;
    throw error;
  }

  const valide = await bcrypt.compare(password, user.password);
  if (!valide) {
    const error = new Error('Email ou mot de passe incorrect');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: { id: user._id, nom: user.nom, email: user.email, role: user.role },
  };
};

export const AuthService = { register, login };
