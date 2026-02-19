// Configuration générale de l'application
export const APP_CONFIG = {
  name: 'Centre Social Dorothy',
  description: 'Centre Social Kaz\'Habitant en Martinique - Accompagnement des seniors, familles, enfants et jeunes',
  version: '1.0.0',
  author: 'Association Dorothy',
  contact: {
    email: 'associationdorothy@live.fr',
    phone: '0696 00 01 69 / 0696 61 36 03',
    address: 'Les Hauts de Dillon, Résidence Capitole 3 - Bât 4, 97200 Fort-de-France, Martinique'
  },
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    // ...ajoutez d'autres réseaux si nécessaire
  }
};

// Configuration de la base de données
export const DATABASE_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  connectionTimeout: 10000,
  queryTimeout: 5000
};

// Configuration de l'authentification
export const AUTH_CONFIG = {
  jwt: {
    secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production',
    expiresIn: '7d',
    refreshExpiresIn: '30d'
  },
  session: {
    cookieName: 'auth-token',
    maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    httpOnly: true
  },
  password: {
    saltRounds: 12,
    minLength: 8,
    requireSpecialChar: true,
    requireUpperCase: true,
    requireNumber: true
  }
};

// Configuration des uploads
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  uploadDir: 'public/uploads',
  subdirectories: {
    events: 'events',
    gallery: 'gallery',
    team: 'team',
    documents: 'documents'
  }
};

// Configuration de la pagination
export const PAGINATION_CONFIG = {
  default: {
    pageSize: 10,
    maxPageSize: 100
  },
  events: {
    pageSize: 12,
    maxPageSize: 50
  },
  registrations: {
    pageSize: 25,
    maxPageSize: 100
  },
  contacts: {
    pageSize: 20,
    maxPageSize: 50
  },
  gallery: {
    pageSize: 15,
    maxPageSize: 50
  }
};

// Configuration email
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@dorothy-martinique.fr',
  replyTo: process.env.EMAIL_REPLY_TO || 'associationdorothy@live.fr',
  templates: {
    eventRegistration: 'event-registration',
    eventConfirmation: 'event-confirmation',
    contactReceived: 'contact-received',
    newsletter: 'newsletter',
    passwordReset: 'password-reset'
  }
};

// Catégories de l'association
export const CATEGORIES = {
  SENIORS: {
    id: 'SENIORS',
    label: 'Seniors',
    description: 'Programmes d\'accompagnement et d\'activités dédiés aux personnes âgées',
    color: '#fc7f2b',
    icon: 'Heart',
    imageUrl: '/SENIOR.jpeg'
  },
  REEAP: {
    id: 'REEAP',
    label: 'REEAP',
    description: 'Réseau d\'Écoute, d\'Appui et d\'Accompagnement des Parents',
    color: '#37a599',
    icon: 'Users',
    imageUrl: '/REEAP.jpg'
  },
  LAEP: {
    id: 'LAEP',
    label: 'LAEP (Ti-Ludo)',
    description: 'Lieu d\'Accueil Enfants Parents - Espace de jeu et d\'éveil',
    color: '#6271dd',
    icon: 'Baby',
    imageUrl: '/laep.jpg'
  },
  JEUNESSE: {
    id: 'JEUNESSE',
    label: 'Jeunesse',
    description: 'Programmes d\'accompagnement et d\'insertion pour les jeunes',
    color: '#e74c3c',
    icon: 'Star',
    imageUrl: '/jeunesse.jpg'
  },
  ACCES_DROITS: {
    id: 'ACCES_DROITS',
    label: 'Accès aux Droits',
    description: 'Accompagnement dans les démarches administratives',
    color: '#9b59b6',
    icon: 'Scale',
    imageUrl: '/acces-droits.jpg'
  },
  ANIME_QUARTIER: {
    id: 'ANIME_QUARTIER',
    label: 'Anime ton Quartier',
    description: 'Animation et dynamisation du territoire',
    color: '#f39c12',
    icon: 'MapPin',
    imageUrl: '/animetonquartier.jpeg'
  },
  GENERAL: {
    id: 'GENERAL',
    label: 'Général',
    description: 'Activités et événements généraux',
    color: '#95a5a6',
    icon: 'Globe',
    imageUrl: '/logo.png'
  }
} as const;

// Statuts des événements
export const EVENT_STATUSES = {
  UPCOMING: {
    id: 'UPCOMING',
    label: 'À venir',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  ONGOING: {
    id: 'ONGOING',
    label: 'En cours',
    color: '#10b981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  COMPLETED: {
    id: 'COMPLETED',
    label: 'Terminé',
    color: '#6b7280',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  CANCELLED: {
    id: 'CANCELLED',
    label: 'Annulé',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
} as const;

// Statuts des inscriptions
export const REGISTRATION_STATUSES = {
  PENDING: {
    id: 'PENDING',
    label: 'En attente',
    color: '#f59e0b',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  EMAIL_CONFIRMED: {
    id: 'EMAIL_CONFIRMED',
    label: 'Email confirmé',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  CONFIRMED: {
    id: 'CONFIRMED',
    label: 'Confirmée',
    color: '#10b981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  CANCELLED: {
    id: 'CANCELLED',
    label: 'Annulée',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  },
  ATTENDED: {
    id: 'ATTENDED',
    label: 'Présent(e)',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  }
} as const;

// Statuts des contacts
export const CONTACT_STATUSES = {
  UNREAD: {
    id: 'UNREAD',
    label: 'Non lu',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  },
  READ: {
    id: 'READ',
    label: 'Lu',
    color: '#f59e0b',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  RESPONDED: {
    id: 'RESPONDED',
    label: 'Répondu',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  RESOLVED: {
    id: 'RESOLVED',
    label: 'Résolu',
    color: '#10b981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  }
} as const;

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: {
    id: 'ADMIN',
    label: 'Administrateur',
    level: 4,
    permissions: ['all']
  },
  MODERATOR: {
    id: 'MODERATOR',
    label: 'Modérateur',
    level: 3,
    permissions: ['events', 'registrations', 'contacts', 'gallery', 'team']
  },
  EDITOR: {
    id: 'EDITOR',
    label: 'Éditeur',
    level: 2,
    permissions: ['events', 'contacts', 'gallery']
  },
  USER: {
    id: 'USER',
    label: 'Utilisateur',
    level: 1,
    permissions: ['view']
  }
} as const;

// Messages et notifications
export const MESSAGES = {
  SUCCESS: {
    EVENT_CREATED: 'Événement créé avec succès',
    EVENT_UPDATED: 'Événement modifié avec succès',
    EVENT_DELETED: 'Événement supprimé avec succès',
    REGISTRATION_SUCCESS: 'Inscription enregistrée avec succès',
    CONTACT_SENT: 'Message envoyé avec succès',
    LOGIN_SUCCESS: 'Connexion réussie',
    LOGOUT_SUCCESS: 'Déconnexion réussie'
  },
  ERROR: {
    UNAUTHORIZED: 'Accès non autorisé',
    NOT_FOUND: 'Ressource non trouvée',
    VALIDATION_ERROR: 'Erreur de validation',
    SERVER_ERROR: 'Erreur serveur interne',
    DUPLICATE_ENTRY: 'Cette ressource existe déjà',
    EVENT_FULL: 'L\'événement est complet',
    ALREADY_REGISTERED: 'Vous êtes déjà inscrit(e) à cet événement',
    INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
    EXPIRED_TOKEN: 'Session expirée'
  }
};

// Expressions régulières utiles
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_FR: /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Limites et contraintes
export const LIMITS = {
  EVENT: {
    TITLE_MIN: 3,
    TITLE_MAX: 200,
    DESCRIPTION_MAX: 500,
    CONTENT_MAX: 5000,
    MAX_PARTICIPANTS_MIN: 1,
    MAX_PARTICIPANTS_MAX: 1000
  },
  REGISTRATION: {
    NAME_MIN: 2,
    NAME_MAX: 50,
    MESSAGE_MAX: 1000
  },
  CONTACT: {
    NAME_MIN: 2,
    NAME_MAX: 50,
    SUBJECT_MIN: 5,
    SUBJECT_MAX: 200,
    MESSAGE_MIN: 10,
    MESSAGE_MAX: 2000
  },
  TEAM_MEMBER: {
    NAME_MIN: 2,
    NAME_MAX: 100,
    POSITION_MIN: 2,
    POSITION_MAX: 100,
    BIO_MAX: 1000
  },
  GALLERY: {
    TITLE_MIN: 2,
    TITLE_MAX: 200,
    DESCRIPTION_MAX: 500
  }
};

// Types utilitaires
export type CategoryId = keyof typeof CATEGORIES;
export type EventStatusId = keyof typeof EVENT_STATUSES;
export type RegistrationStatusId = keyof typeof REGISTRATION_STATUSES;
export type ContactStatusId = keyof typeof CONTACT_STATUSES;
export type UserRoleId = keyof typeof USER_ROLES;

// Utilitaires de configuration
export const getConfig = () => ({
  app: APP_CONFIG,
  database: DATABASE_CONFIG,
  auth: AUTH_CONFIG,
  upload: UPLOAD_CONFIG,
  pagination: PAGINATION_CONFIG,
  email: EMAIL_CONFIG
});

export const isDevelopment = () => process.env.NODE_ENV === 'development';
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isTest = () => process.env.NODE_ENV === 'test';