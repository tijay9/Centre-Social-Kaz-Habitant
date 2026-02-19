-- Migration pour ajouter les champs de validation email aux inscriptions
-- Date: 2025-11-24

-- Modifier le type ENUM pour ajouter le statut EMAIL_CONFIRMED
ALTER TABLE registrations 
MODIFY COLUMN status ENUM('PENDING', 'EMAIL_CONFIRMED', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- Ajouter les nouveaux champs pour la validation email
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS emailToken VARCHAR(255) AFTER status,
ADD COLUMN IF NOT EXISTS emailTokenExpiry DATETIME AFTER emailToken,
ADD COLUMN IF NOT EXISTS emailConfirmedAt DATETIME AFTER emailTokenExpiry,
ADD COLUMN IF NOT EXISTS adminApprovedAt DATETIME AFTER emailConfirmedAt,
ADD COLUMN IF NOT EXISTS adminApprovedBy VARCHAR(64) AFTER adminApprovedAt;

-- Ajouter les index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_email_token ON registrations(emailToken);
CREATE INDEX IF NOT EXISTS idx_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_event ON registrations(eventId);

-- Ajouter la contrainte de clé étrangère pour adminApprovedBy si elle n'existe pas
-- Note: Cette ligne peut échouer si la contrainte existe déjà, c'est normal
ALTER TABLE registrations 
ADD CONSTRAINT fk_registrations_admin 
FOREIGN KEY (adminApprovedBy) REFERENCES users(id)
ON DELETE SET NULL;

-- Afficher un message de confirmation
SELECT 'Migration terminée avec succès!' as message;
