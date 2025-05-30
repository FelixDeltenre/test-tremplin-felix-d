CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  genre ENUM('homme', 'femme') NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  objet ENUM('demande de visite', 'etre rappele', 'plus de photos') NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disponibilites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  jour ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche') NOT NULL,
  heure INT NOT NULL,
  minute INT NOT NULL,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
