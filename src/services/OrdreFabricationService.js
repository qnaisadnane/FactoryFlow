import { OrdreFabricationRepository } from '../repositories/OrdreFabricationRepository.js';
import { ProduitRepository } from '../repositories/ProduitRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { MatierePremiereRepository } from '../repositories/MatierePremiereRepository.js';
import { MouvementStockRepository } from '../repositories/MouvementStockRepository.js';


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

// Démarrer un ordre de fabrication (Opérateur assigné uniquement)
const demarrerOrdre = async (id, userId) => {
  const ordre = await OrdreFabricationRepository.findById(id);
  if (!ordre) {
    const error = new Error('Ordre de fabrication introuvable');
    error.statusCode = 404;
    throw error;
  }

  const opId = ordre.operateurAssigné?._id ? ordre.operateurAssigné._id.toString() : ordre.operateurAssigné?.toString();
  if (opId !== userId.toString()) {
    const error = new Error('Seul l\'opérateur assigné peut démarrer cet ordre de fabrication');
    error.statusCode = 403;
    throw error;
  }

  if (ordre.statut !== 'planifié') {
    const error = new Error(`Impossible de démarrer un ordre avec le statut "${ordre.statut}"`);
    error.statusCode = 400;
    throw error;
  }

  // Vérifier la disponibilité du stock pour chaque matière
  const manques = [];
  for (const item of ordre.composition) {
    const matiereId = item.matiere?._id || item.matiere;
    const matiere = await MatierePremiereRepository.findById(matiereId);
    const dispo = matiere ? matiere.quantiteDisponible : 0;
    if (!matiere || dispo < item.quantiteTotale) {
      manques.push({
        matiereId,
        nomMatiere: item.nomMatiere || matiere?.nom || 'Inconnue',
        requis: item.quantiteTotale,
        disponible: dispo,
        manquant: item.quantiteTotale - dispo,
      });
    }
  }

  if (manques.length > 0) {
    const error = new Error('Stock insuffisant pour démarrer l\'ordre de fabrication');
    error.statusCode = 400;
    error.details = manques;
    throw error;
  }

  // Déduire les stocks et créer les mouvements de sortie
  for (const item of ordre.composition) {
    const matiereId = item.matiere?._id || item.matiere;
    await MatierePremiereRepository.deductStock(matiereId, item.quantiteTotale);
    await MouvementStockRepository.create({
      matiere: matiereId,
      type: 'sortie',
      quantite: item.quantiteTotale,
      ordreRef: ordre._id,
      creePar: userId,
      date: new Date(),
    });
  }

  return await OrdreFabricationRepository.update(id, {
    statut: 'en_cours',
    dateDemarrage: new Date(),
  });
};

// Terminer un ordre de fabrication (Opérateur assigné uniquement)
const terminerOrdre = async (id, userId) => {
  const ordre = await OrdreFabricationRepository.findById(id);
  if (!ordre) {
    const error = new Error('Ordre de fabrication introuvable');
    error.statusCode = 404;
    throw error;
  }

  const opId = ordre.operateurAssigné?._id ? ordre.operateurAssigné._id.toString() : ordre.operateurAssigné?.toString();
  if (opId !== userId.toString()) {
    const error = new Error('Seul l\'opérateur assigné peut terminer cet ordre de fabrication');
    error.statusCode = 403;
    throw error;
  }

  if (ordre.statut !== 'en_cours') {
    const error = new Error(`Seul un ordre avec le statut "en_cours" peut être terminé (statut actuel: "${ordre.statut}")`);
    error.statusCode = 400;
    throw error;
  }

  return await OrdreFabricationRepository.update(id, {
    statut: 'terminé',
    dateFin: new Date(),
  });
};

export const OrdreFabricationService = {
  creerOrdre,
  listerOrdres,
  obtenirParId,
  modifierOrdre,
  annulerOrdre,
  demarrerOrdre,
  terminerOrdre,
};





