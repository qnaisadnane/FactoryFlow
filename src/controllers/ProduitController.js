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

const getAll = async (req, res, next) => {
  try {
    const produits = await ProduitService.listerTous();
    res.status(200).json({ success: true, data: produits });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const produit = await ProduitService.obtenirParId(req.params.id);
    res.status(200).json({ success: true, data: produit });
  } catch (error) {
    next(error);
  }
};

export const ProduitController = {
  create,
  getAll,
  getById,
};

