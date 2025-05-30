const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', [
  body('genre').isIn(['homme', 'femme']),
  body('nom').notEmpty().isLength({ max: 50 }),
  body('prenom').notEmpty().isLength({ max: 50 }),
  body('email').isEmail(),
  body('telephone').notEmpty().isLength({ max: 12 }),
  body('message').notEmpty().isLength({ max: 1000 }),
  body('objet').isIn(['demande de visite', 'etre rappele', 'plus de photos']),
  body('disponibilites').isArray({ min: 1 }),
  body('disponibilites.*.jour').isIn(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']),
  body('disponibilites.*.heure').isInt({ min: 0, max: 23 }),
  body('disponibilites.*.minute').isInt({ min: 0, max: 59 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { genre, nom, prenom, email, telephone, message, objet, disponibilites } = req.body;

  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO contacts (genre, nom, prenom, email, telephone, message, objet)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [genre, nom, prenom, email, telephone, message, objet]
    );

    const contactId = result.insertId;

    const disponibilitesData = disponibilites.map(d => [contactId, d.jour, d.heure, d.minute]);
    await conn.query(
      `INSERT INTO disponibilites (contact_id, jour, heure, minute) VALUES ?`,
      [disponibilitesData]
    );

    await conn.commit();
    conn.release();

    res.status(201).json({ message: 'Formulaire soumis avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
