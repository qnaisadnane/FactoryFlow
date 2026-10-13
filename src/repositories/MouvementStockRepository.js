import { MouvementStock } from '../Models/MouvementStock.js';

const create = async (data, session) => {
  if (session) {
    const [mouvement] = await MouvementStock.create([data], { session });
    return mouvement;
  }
  return await MouvementStock.create(data);
};

export const MouvementStockRepository = {
  create,
};
