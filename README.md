# Test dev web Tremplin

## Démarrer

### Installer les dépendance
Pour lancer le projet il faut `npm install` dans le dossier frontend ainsi que le dossier backend.

### Lancer le docker compose
Puis `docker compose up` à la racine

### Setupe la base de donnée
Enfin il faut mettre en place la base de donnée si ce n'est pas déja le cas avec le script dans backend nomé `schema.sql` dans une base de donnéee nommée formulaire.

### Tout est bon

Le projet est visible depuis le port 3000 (le frontend) communique au serveur node sur le port 3001 et enregistre dans la BD.
