import { MatierePremiereRepository } from '../repositories/MatierePremiereRepository.js';
import { MouvementStockRepository } from '../repositories/MouvementStockRepository.js';


const creerMatiere = async ({ reference, nom, uniteMesure, seuilAlerte }) => {
  if (!reference || !nom || !uniteMesure) {
    const error = new Error('Référence, nom et unité de mesure sont obligatoires');
    error.statusCode = 400;
    throw error;
  }

  const existante = await MatierePremiereRepository.findByReference(reference);
  if (existante) {
    const error = new Error(`La référence "${reference}" existe déjà`);
    error.statusCode = 409;
    throw error;
  }

  return await MatierePremiereRepository.create({
    reference,
    nom,
    uniteMesure,
    seuilAlerte: seuilAlerte || 0,
    quantiteDisponible: 0,
  });
};

const listerToutes = async () => {
  return await MatierePremiereRepository.findAll();
};

const obtenirParId = async (id) => {
  const matiere = await MatierePremiereRepository.findById(id);
  if (!matiere) {
    const error = new Error('Matière première introuvable');
    error.statusCode = 404;
    throw error;
  }
  return matiere;
};

const modifierMatiere = async (id, data) => {
  const matiere = await MatierePremiereRepository.findById(id);
  if (!matiere) {
    const error = new Error('Matière première introuvable');
    error.statusCode = 404;
    throw error;
  }

  const { quantiteDisponible, ...donneesModifiables } = data;

  if (donneesModifiables.reference && donneesModifiables.reference !== matiere.reference) {
    const doublon = await MatierePremiereRepository.findByReference(donneesModifiables.reference);
    if (doublon) {
      const error = new Error(`La référence "${donneesModifiables.reference}" existe déjà`);
      error.statusCode = 409;
      throw error;
    }
  }

  return await MatierePremiereRepository.update(id, donneesModifiables);
};

const enregistrerEntree = async (matiereId, quantite, userId) => {
  const quantiteNum = Number(quantite);
  if (!quantiteNum || quantiteNum <= 0) {
    const error = new Error('La quantité doit être supérieure à 0');
    error.statusCode = 400;
    throw error;
  }

  const matiere = await MatierePremiereRepository.findById(matiereId);
  if (!matiere) {
    const error = new Error('Matière première introuvable');
    error.statusCode = 404;
    throw error;
  }

  const matiereAJour = await MatierePremiereRepository.incrementStock(matiereId, quantiteNum);

  const mouvement = await MouvementStockRepository.create({
    matiere: matiereId,
    type: 'entree',
    quantite: quantiteNum,
    creePar: userId,
    date: new Date(),
  });

  return {
    matiere: matiereAJour,
    mouvement,
  };
};

const obtenirMouvements = async (matiereId, page = 1, limit = 10) => {
  const matiere = await MatierePremiereRepository.findById(matiereId);
  if (!matiere) {
    const error = new Error('Matière première introuvable');
    error.statusCode = 404;
    throw error;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);

  const mouvements = await MouvementStockRepository.findByMatiere(matiereId, pageNum, limitNum);
  const total = await MouvementStockRepository.countByMatiere(matiereId);

  return {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: mouvements,
  };
};

const obtenirAlertes = async () => {
  const alertes = await MatierePremiereRepository.findAlertes();

  return alertes.map((item) => {
    const obj = item.toObject ? item.toObject() : item;
    return {
      ...obj,
      quantiteManquante: Math.max(0, obj.seuilAlerte - obj.quantiteDisponible),
    };
  });
};

export const MatierePremiereService = {
  creerMatiere,
  listerToutes,
  obtenirParId,
  modifierMatiere,
  enregistrerEntree,
  obtenirMouvements,
  obtenirAlertes,
};



