import { ProduitService } from '../services/ProduitService.js';

const create = async (req, res, next) => {
  try {
    const { reference, nom, composition } = req.body;
    const produit = await ProduitService.creerProduit({ reference, nom, composition });
    res.status(201).json({ success: true, data: produit });
  } catch (error) {
    next(error);
  }
};

export const ProduitController = {
  create,
};
