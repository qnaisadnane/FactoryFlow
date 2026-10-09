const errormiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
  });
};

export default errormiddleware;