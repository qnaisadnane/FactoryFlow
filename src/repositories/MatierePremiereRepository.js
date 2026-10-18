import { MatierePremiere } from '../Models/MatierePremiere.js';

const findByReference = async (reference) => {
  return await MatierePremiere.findOne({ reference });
};

const findById = async (id) => {
  return await MatierePremiere.findById(id);
};

const findAll = async () => {
  return await MatierePremiere.find();
};

const create = async (data) => {
  return await MatierePremiere.create(data);
};

const update = async (id, data) => {
  return await MatierePremiere.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const incrementStock = async (id, quantite, session) => {
  const options = { new: true };
  if (session) options.session = session;
  return await MatierePremiere.findByIdAndUpdate(
    id,
    { $inc: { quantiteDisponible: quantite } },
    options
  );
};

const findAlertes = async () => {
  return await MatierePremiere.find({
    $expr: { $lt: ['$quantiteDisponible', '$seuilAlerte'] },
  });
};

const deductStock = async (id, quantite, session) => {
  const options = { new: true };
  if (session) options.session = session;
  return await MatierePremiere.findByIdAndUpdate(
    id,
    { $inc: { quantiteDisponible: -quantite } },
    options
  );
};

export const MatierePremiereRepository = {
  findByReference,
  findById,
  findAll,
  create,
  update,
  incrementStock,
  deductStock,
  findAlertes,
};



