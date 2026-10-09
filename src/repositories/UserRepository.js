import { User } from '../Models/User.js';

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findById(id).select('-password');
};

const create = async (userData, session) => {
  const [user] = await User.create([userData], { session });
  return user;
};

export const UserRepository = { findByEmail, findById, create };