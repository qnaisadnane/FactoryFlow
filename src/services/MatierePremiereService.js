import { MatierePremiereRepository } from '../repositories/MatierePremiereRepository.js';

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

export const MatierePremiereService = {
  creerMatiere,
  listerToutes,
  obtenirParId,
  modifierMatiere,
};
