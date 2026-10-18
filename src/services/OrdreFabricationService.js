import { OrdreFabricationRepository } from '../repositories/OrdreFabricationRepository.js';
import { ProduitRepository } from '../repositories/ProduitRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';

// Créer un ordre de fabrication (Admin)
const creerOrdre = async ({ produitId, quantite, operateurId, adminId }) => {
  const quantiteNum = Number(quantite);
  if (!quantiteNum || quantiteNum <= 0) {
    const error = new Error('La quantité doit être supérieure à 0');
    error.statusCode = 400;
    throw error;
  }

  // Vérifier le produit et charger sa composition
  const produit = await ProduitRepository.findById(produitId);
  if (!produit) {
    const error = new Error('Produit introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (!produit.composition || produit.composition.length === 0) {
    const error = new Error('Le produit sélectionné ne possède pas de composition définie');
    error.statusCode = 400;
    throw error;
  }

  // Vérifier l'opérateur
  const operateur = await UserRepository.findById(operateurId);
  if (!operateur) {
    const error = new Error('Opérateur introuvable');
    error.statusCode = 404;
    throw error;
  }

  // Créer le snapshot de composition figé
  const compositionSnapshot = produit.composition.map((item) => ({
    matiere: item.matiere._id || item.matiere,
    nomMatiere: item.matiere.nom || '',
    quantiteUnitaire: item.quantiteUnitaire,
    quantiteTotale: item.quantiteUnitaire * quantiteNum,
  }));

  return await OrdreFabricationRepository.create({
    produit: produit._id,
    quantite: quantiteNum,
    statut: 'planifié',
    composition: compositionSnapshot,
    operateurAssigné: operateur._id,
    créePar: adminId,
    dateCreation: new Date(),
  });
};

// Lister tous les ordres avec filtres et pagination (Admin)
const listerOrdres = async ({ statut, produit, dateDebut, dateFin, page = 1, limit = 10 }) => {
  const filter = {};

  if (statut) {
    filter.statut = statut;
  }

  if (produit) {
    filter.produit = produit;
  }

  if (dateDebut || dateFin) {
    filter.dateCreation = {};
    if (dateDebut) {
      filter.dateCreation.$gte = new Date(dateDebut);
    }
    if (dateFin) {
      filter.dateCreation.$lte = new Date(dateFin);
    }
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);

  return await OrdreFabricationRepository.findAll(filter, pageNum, limitNum);
};

// Obtenir le détail complet d'un ordre
const obtenirParId = async (id) => {
  const ordre = await OrdreFabricationRepository.findById(id);
  if (!ordre) {
    const error = new Error('Ordre de fabrication introuvable');
    error.statusCode = 404;
    throw error;
  }
  return ordre;
};

// Modifier un ordre (uniquement si statut === 'planifié')
const modifierOrdre = async (id, { quantite, operateurId }) => {
  const ordre = await OrdreFabricationRepository.findById(id);
  if (!ordre) {
    const error = new Error('Ordre de fabrication introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (ordre.statut !== 'planifié') {
    const error = new Error('Seuls les ordres planifiés peuvent être modifiés');
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};

  if (operateurId) {
    const operateur = await UserRepository.findById(operateurId);
    if (!operateur) {
      const error = new Error('Opérateur introuvable');
      error.statusCode = 404;
      throw error;
    }
    updateData.operateurAssigné = operateur._id;
  }

  if (quantite) {
    const quantiteNum = Number(quantite);
    if (!quantiteNum || quantiteNum <= 0) {
      const error = new Error('La quantité doit être supérieure à 0');
      error.statusCode = 400;
      throw error;
    }
    updateData.quantite = quantiteNum;

    // Recalculer les quantités totales de la composition
    updateData.composition = ordre.composition.map((item) => ({
      matiere: item.matiere._id || item.matiere,
      nomMatiere: item.nomMatiere,
      quantiteUnitaire: item.quantiteUnitaire,
      quantiteTotale: item.quantiteUnitaire * quantiteNum,
    }));
  }

  return await OrdreFabricationRepository.update(id, updateData);
};

// Annuler un ordre planifié (Admin)
const annulerOrdre = async (id) => {
  const ordre = await OrdreFabricationRepository.findById(id);
  if (!ordre) {
    const error = new Error('Ordre de fabrication introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (ordre.statut !== 'planifié') {
    const error = new Error('Seuls les ordres avec le statut planifié peuvent être annulés');
    error.statusCode = 400;
    throw error;
  }

  return await OrdreFabricationRepository.update(id, { statut: 'annulé' });
};

export const OrdreFabricationService = {
  creerOrdre,
  listerOrdres,
  obtenirParId,
  modifierOrdre,
  annulerOrdre,
};



