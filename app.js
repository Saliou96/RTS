const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour servir le frontend statique
app.use(express.static(path.join(__dirname, 'public')));

// Exemple de liste d'équipements disponibles (vous pouvez la remplacer par vos données)
const equipments = [
  { id: 1, name: 'Émetteur 1', type: 'emitter', defaultPower: 20 },
  { id: 2, name: 'Récepteur 1', type: 'receiver', defaultPower: -30 },
  // Ajoutez d'autres équipements ici
];

// Endpoint pour obtenir la liste des équipements disponibles
app.get('/api/equipments', (req, res) => {
  res.json(equipments);
});

// Endpoint pour calculer la puissance reçue et l'analyse de la liaison
app.post('/api/calculate', (req, res) => {
  const { equipmentId, emissionPower, fiberLength, attenuation } = req.body;

  // Trouver l'équipement sélectionné
  const selectedEquipment = equipments.find(equipment => equipment.id === equipmentId);

  // Vérifier si l'équipement a été trouvé
  if (!selectedEquipment) {
    return res.status(400).json({ error: 'Équipement non trouvé' });
  }

  // Calcul de la puissance reçue
  const receivedPower = emissionPower - fiberLength * attenuation;

  // Analyse de la liaison simulée
  let analysis = 'Analyse de la liaison : Le signal est de bonne qualité.';
  if (receivedPower < selectedEquipment.defaultPower - 10) {
    analysis = 'Analyse de la liaison : Le signal est faible, une amplification est recommandée.';
  }

  // Réponse avec les résultats
  res.json({ receivedPower, analysis });
});

// Gestion de la route par défaut pour servir le fichier index.html (frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
