import { ProduitRepository } from '../repositories/ProduitRepository.js';
import { MatierePremiereRepository } from '../repositories/MatierePremiereRepository.js';

// Valider les contraintes de composition
const validerComposition = async (composition) => {
  if (!composition || !Array.isArray(composition) || composition.length === 0) {
    const error = new Error('La composition doit contenir au moins une matière première');
    error.statusCode = 400;
    throw error;
  }

  const matieresVues = new Set();

  for (const item of composition) {
    if (!item.matiere) {
      const error = new Error('Chaque élément de la composition doit spécifier une matière');
      error.statusCode = 400;
      throw error;
    }

    const matiereId = item.matiere.toString();
    if (matieresVues.has(matiereId)) {
      const error = new Error('Une matière première ne peut pas être présente en double dans la composition');
      error.statusCode = 400;
      throw error;
    }
    matieresVues.add(matiereId);

    const quantite = Number(item.quantiteUnitaire);
    if (!quantite || quantite <= 0) {
      const error = new Error('La quantité unitaire doit être supérieure à 0');
      error.statusCode = 400;
      throw error;
    }

    const matiereExiste = await MatierePremiereRepository.findById(item.matiere);
    if (!matiereExiste) {
      const error = new Error(`La matière première avec l'ID "${item.matiere}" n'existe pas`);
      error.statusCode = 400;
      throw error;
    }
  }
};

// Créer un produit
const creerProduit = async ({ reference, nom, composition }) => {
  if (!reference || !nom) {
    const error = new Error('La référence et le nom sont obligatoires');
    error.statusCode = 400;
    throw error;
  }

  const existant = await ProduitRepository.findByReference(reference);
  if (existant) {
    const error = new Error(`La référence "${reference}" existe déjà`);
    error.statusCode = 409;
    throw error;
  }

  await validerComposition(composition);

  return await ProduitRepository.create({ reference, nom, composition });
};

// Lister tous les produits
const listerTous = async () => {
  return await ProduitRepository.findAll();
};

// Obtenir un produit par son ID
const obtenirParId = async (id) => {
  const produit = await ProduitRepository.findById(id);
  if (!produit) {
    const error = new Error('Produit introuvable');
    error.statusCode = 404;
    throw error;
  }
  return produit;
};

// Modifier un produit
const modifierProduit = async (id, data) => {
  const existant = await ProduitRepository.findById(id);
  if (!existant) {
    const error = new Error('Produit introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (data.reference && data.reference !== existant.reference) {
    const doublon = await ProduitRepository.findByReference(data.reference);
    if (doublon) {
      const error = new Error(`La référence "${data.reference}" existe déjà`);
      error.statusCode = 409;
      throw error;
    }
  }

  if (data.composition) {
    await validerComposition(data.composition);
  }

  return await ProduitRepository.update(id, data);
};

export const ProduitService = {
  creerProduit,
  listerTous,
  obtenirParId,
  modifierProduit,
};