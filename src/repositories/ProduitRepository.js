import { Produit } from '../Models/Produit.js';

const findByReference = async (reference) => {
  return await Produit.findOne({ reference });
};

const findAll = async () => {
  return await Produit.find().populate('composition.matiere');
};

const findById = async (id) => {
  return await Produit.findById(id).populate('composition.matiere');
};

const create = async (data) => {
  return await Produit.create(data);
};

const update = async (id, data) => {
  return await Produit.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('composition.matiere');
};

export const ProduitRepository = {
  findByReference,
  findAll,
  findById,
  create,
  update,
};
