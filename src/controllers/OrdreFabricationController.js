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

const getById = async (req, res, next) => {
  try {
    const ordre = await OrdreFabricationService.obtenirParId(req.params.id);
    res.status(200).json({ success: true, data: ordre });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { quantite, operateurId } = req.body;
    const ordre = await OrdreFabricationService.modifierOrdre(req.params.id, {
      quantite,
      operateurId,
    });
    res.status(200).json({ success: true, data: ordre });
  } catch (error) {
    next(error);
  }
};

export const OrdreFabricationController = {
  create,
  getAll,
  getById,
  update,
};


