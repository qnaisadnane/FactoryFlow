import { OrdreFabrication } from '../Models/OrdreFabrication.js';

const create = async (data, session) => {
  if (session) {
    const [ordre] = await OrdreFabrication.create([data], { session });
    return ordre;
  }
  return await OrdreFabrication.create(data);
};

const findById = async (id) => {
  return await OrdreFabrication.findById(id)
    .populate('produit', 'reference nom')
    .populate('composition.matiere', 'reference nom uniteMesure')
    .populate('operateurAssigné', 'nom email role')
    .populate('créePar', 'nom email role');
};

const findAll = async (filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const ordres = await OrdreFabrication.find(filter)
    .sort({ dateCreation: -1 })
    .skip(skip)
    .limit(limit)
    .populate('produit', 'reference nom')
    .populate('composition.matiere', 'reference nom uniteMesure')
    .populate('operateurAssigné', 'nom email role')
    .populate('créePar', 'nom email role');

  const total = await OrdreFabrication.countDocuments(filter);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    data: ordres,
  };
};

const update = async (id, data, session) => {
  const options = { new: true, runValidators: true };
  if (session) options.session = session;
  return await OrdreFabrication.findByIdAndUpdate(id, data, options)
    .populate('produit', 'reference nom')
    .populate('composition.matiere', 'reference nom uniteMesure')
    .populate('operateurAssigné', 'nom email role')
    .populate('créePar', 'nom email role');
};

export const OrdreFabricationRepository = {
  create,
  findById,
  findAll,
  update,
};
