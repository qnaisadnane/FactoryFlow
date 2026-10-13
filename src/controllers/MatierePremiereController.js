import { MatierePremiereService } from '../services/MatierePremiereService.js';

const create = async (req, res, next) => {
  try {
    const { reference, nom, uniteMesure, seuilAlerte } = req.body;
    const matiere = await MatierePremiereService.creerMatiere({
      reference,
      nom,
      uniteMesure,
      seuilAlerte,
    });
    res.status(201).json({ success: true, data: matiere });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const matieres = await MatierePremiereService.listerToutes();
    res.status(200).json({ success: true, data: matieres });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const matiere = await MatierePremiereService.obtenirParId(req.params.id);
    res.status(200).json({ success: true, data: matiere });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const matiere = await MatierePremiereService.modifierMatiere(req.params.id, req.body);
    res.status(200).json({ success: true, data: matiere });
  } catch (error) {
    next(error);
  }
};

const ajouterEntree = async (req, res, next) => {
  try {
    const { quantite } = req.body;
    const resultat = await MatierePremiereService.enregistrerEntree(
      req.params.id,
      quantite,
      req.user.id
    );
    res.status(201).json({ success: true, data: resultat });
  } catch (error) {
    next(error);
  }
};

const getMouvements = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const resultat = await MatierePremiereService.obtenirMouvements(
      req.params.id,
      page,
      limit
    );
    res.status(200).json({ success: true, ...resultat });
  } catch (error) {
    next(error);
  }
};

export const MatierePremiereController = {
  create,
  getAll,
  getById,
  update,
  ajouterEntree,
  getMouvements,
};


