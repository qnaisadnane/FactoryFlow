import mongoose from 'mongoose';

const OrdreFabricationSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit',
      required: true,
    },
    quantite: {
      type: Number,
      required: true,
      min: 1,
    },
    statut: {
      type: String,
      enum: ['planifié', 'en_cours', 'terminé', 'annulé'],
      default: 'planifié',
    },
    composition: [
      {
        matiere: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MatierePremiere',
          required: true,
        },
        nomMatiere: {
          type: String,
          default: '',
        },
        quantiteUnitaire: {
          type: Number,
          required: true,
        },
        quantiteTotale: {
          type: Number,
          required: true,
        },
      },
    ],
    operateurAssigné: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    créePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateCreation: {
      type: Date,
      default: Date.now,
    },
    dateDemarrage: {
      type: Date,
      default: null,
    },
    dateFin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

OrdreFabricationSchema.index({ statut: 1 });
OrdreFabricationSchema.index({ operateurAssigné: 1 });
OrdreFabricationSchema.index({ dateCreation: -1 });

export const OrdreFabrication = mongoose.model('OrdreFabrication', OrdreFabricationSchema);
