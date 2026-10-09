import mongoose from 'mongoose';

const dbConnexion = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connecté');
};

export default dbConnexion;
