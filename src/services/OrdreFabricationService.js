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

export const OrdreFabricationService = {
  creerOrdre,
};
