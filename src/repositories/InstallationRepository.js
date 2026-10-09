import { InstallationStatus } from '../Models/InstallationStatus.js';
import { User } from '../Models/User.js';

const getStatus = async () => {
  return await InstallationStatus.findOne({ _id: 'singleton' });
};

const createStatus = async (session) => {
  const [status] = await InstallationStatus.create(
    [{ _id: 'singleton', estInstalle: true, installedAt: new Date() }],
    { session }
  );
  return status;
};

const createAdminUser = async (userData, session) => {
  const [user] = await User.create([userData], { session });
  return user;
};

export const InstallationRepository = { getStatus, createStatus, createAdminUser };