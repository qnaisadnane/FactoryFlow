import { OrdreFabricationService } from '../services/OrdreFabricationService.js';

const create = async (req, res, next) => {
  try {
    const { produitId, quantite, operateurId } = req.body;
    const ordre = await OrdreFabricationService.creerOrdre({
      produitId,
      quantite,
      operateurId,
      adminId: req.user.id,
    });
    res.status(201).json({ success: true, data: ordre });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { statut, produit, dateDebut, dateFin, page, limit } = req.query;
    const resultat = await OrdreFabricationService.listerOrdres({
      statut,
      produit,
      dateDebut,
      dateFin,
      page,
      limit,
    });
    res.status(200).json({ success: true, ...resultat });
  } catch (error) {
    next(error);
  }
};

export const OrdreFabricationController = {
  create,
  getAll,
};

