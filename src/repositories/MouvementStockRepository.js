import { MouvementStock } from '../Models/MouvementStock.js';

const create = async (data, session) => {
  if (session) {
    const [mouvement] = await MouvementStock.create([data], { session });
    return mouvement;
  }
  return await MouvementStock.create(data);
};

const findByMatiere = async (matiereId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await MouvementStock.find({ matiere: matiereId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('creePar', 'nom email');
};

const countByMatiere = async (matiereId) => {
  return await MouvementStock.countDocuments({ matiere: matiereId });
};

export const MouvementStockRepository = {
  create,
  findByMatiere,
  countByMatiere,
};

