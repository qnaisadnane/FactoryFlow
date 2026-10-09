import mongoose from 'mongoose';

const InstallationStatusSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },
  estInstalle: { type: Boolean, required: true, default: false },
  installedAt: { type: Date, default: null },
});

export const InstallationStatus = mongoose.model('InstallationStatus', InstallationStatusSchema);