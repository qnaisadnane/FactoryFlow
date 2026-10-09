import 'dotenv/config';
import app from './app.js';
import dbConnexion from './config/database.js';

const demarrerServeur = async () => {
  try {
    await dbConnexion();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
  } catch (error) {
    console.error('Impossible de démarrer :', error.message);
    process.exit(1);
  }
};

demarrerServeur();
