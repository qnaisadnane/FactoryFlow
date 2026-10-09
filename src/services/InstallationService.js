import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { InstallationRepository } from '../repositories/InstallationRepository.js';

const getStatus = async () => {
  const status = await InstallationRepository.getStatus();
  return { installed: status ? status.estInstalle : false };
};

const installer = async ({ nom, email, password }) => {
  const status = await InstallationRepository.getStatus();
  if (status && status.estInstalle) {
    const error = new Error('Application déjà installée');
    error.statusCode = 409;
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await InstallationRepository.createAdminUser(
      { nom, email, password: hashedPassword, role: 'admin' },
      session
    );
    await InstallationRepository.createStatus(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return { message: 'Installation réussie' };
};

export const InstallationService = { getStatus, installer };
