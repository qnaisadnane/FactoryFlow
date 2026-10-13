import mongoose from 'mongoose';

const MouvementStockSchema = new mongoose.Schema(
  {
    matiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MatierePremiere',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['entree', 'sortie'],
    },
    quantite: {
      type: Number,
      required: true,
      min: 0.000001,
    },
    ordreRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrdreFabrication',
      default: null,
    },
    creePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


MouvementStockSchema.index({ matiere: 1, date: -1 });

export const MouvementStock = mongoose.model('MouvementStock', MouvementStockSchema);
