import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,

  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'operateur']
  }
},
  {
    timestamps: true
  }
);
export const User = mongoose.model("User", UserSchema);