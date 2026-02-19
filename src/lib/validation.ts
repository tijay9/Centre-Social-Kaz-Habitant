import { NextResponse } from 'next/server';

// Types pour la gestion des erreurs
export type ApiError = {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
};

export class ValidationError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

export class AuthenticationError extends Error {
  status: number;
  code: string;

  constructor(message: string = 'Non autorisé') {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
    this.code = 'AUTHENTICATION_ERROR';
  }
}

export class NotFoundError extends Error {
  status: number;
  code: string;

  constructor(message: string = 'Ressource non trouvée') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
    this.code = 'NOT_FOUND';
  }
}

export class ConflictError extends Error {
  status: number;
  code: string;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
    this.code = 'CONFLICT';
  }
}

// Gestionnaire d'erreurs global
export function handleApiError(error: Error & { code?: string; status?: number }): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details
      },
      { status: error.status }
    );
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.status }
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.status }
    );
  }

  if (error instanceof ConflictError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.status }
    );
  }

  // Erreur Prisma
  const maybePrisma = error as { code?: string };
  if (maybePrisma.code === 'P2002') {
    return NextResponse.json(
      {
        error: 'Cette ressource existe déjà',
        code: 'DUPLICATE_ENTRY'
      },
      { status: 409 }
    );
  }

  if (maybePrisma.code === 'P2025') {
    return NextResponse.json(
      {
        error: 'Ressource non trouvée',
        code: 'NOT_FOUND'
      },
      { status: 404 }
    );
  }

  // Erreur générique
  return NextResponse.json(
    {
      error: 'Erreur serveur interne',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}

// Utilitaires de validation
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  required: (value: unknown, fieldName: string): void => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new ValidationError(`Le champ ${fieldName} est requis`);
    }
  },

  minLength: (value: string, min: number, fieldName: string): void => {
    if (value.length < min) {
      throw new ValidationError(`Le champ ${fieldName} doit contenir au moins ${min} caractères`);
    }
  },

  maxLength: (value: string, max: number, fieldName: string): void => {
    if (value.length > max) {
      throw new ValidationError(`Le champ ${fieldName} ne peut pas dépasser ${max} caractères`);
    }
  },

  // Catégories globales disponibles sur le site
  isValidCategory: (category: string): boolean => {
    const validCategories = ['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'ACCES_DROITS', 'ANIME_QUARTIER', 'GENERAL'];
    return validCategories.includes(category.toUpperCase());
  },

  // Catégories valides pour les événements (exclut 'GENERAL')
  isValidEventCategory: (category: string): boolean => {
    const validEventCategories = ['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'ACCES_DROITS', 'ANIME_QUARTIER'];
    return validEventCategories.includes(category.toUpperCase());
  },

  // Doit correspondre à src/types: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
  isValidEventStatus: (status: string): boolean => {
    const validStatuses = ['DRAFT', 'PUBLISHED', 'CANCELLED'];
    return validStatuses.includes(status.toUpperCase());
  },

  // Doit correspondre à src/types: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  isValidRegistrationStatus: (status: string): boolean => {
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
    return validStatuses.includes(status.toUpperCase());
  },

  // Doit correspondre à src/types: 'NEW' | 'READ' | 'REPLIED'
  isValidContactStatus: (status: string): boolean => {
    const validStatuses = ['NEW', 'READ', 'REPLIED'];
    return validStatuses.includes(status.toUpperCase());
  },

  // Doit correspondre à src/types: 'ADMIN' | 'USER'
  isValidRole: (role: string): boolean => {
    const validRoles = ['ADMIN', 'USER'];
    return validRoles.includes(role.toUpperCase());
  }
};

// Types pour les données d'entrée
interface EventData {
  title: string;
  description?: string;
  content?: string;
  date: string;
  time?: string;
  location?: string;
  category: string;
  status?: string;
  imageUrl?: string;
  featured?: boolean;
  maxParticipants?: number;
  tags?: string[];
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  eventId: string;
  status?: string;
}

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
}

// Middleware de validation pour les événements
export function validateEventData(data: EventData): void {
  validators.required(data.title, 'titre');
  validators.required(data.date, 'date');
  validators.required(data.category, 'catégorie');

  validators.minLength(data.title, 3, 'titre');
  validators.maxLength(data.title, 200, 'titre');

  if (data.description) {
    validators.maxLength(data.description, 500, 'description');
  }

  if (data.content) {
    validators.maxLength(data.content, 5000, 'contenu');
  }

  // Catégorie d'événement: exclure 'GENERAL'
  if (!validators.isValidEventCategory(data.category)) {
    throw new ValidationError('Catégorie d\'événement invalide');
  }

  if (data.status && !validators.isValidEventStatus(data.status)) {
    throw new ValidationError('Statut invalide');
  }

  if (data.maxParticipants && data.maxParticipants < 1) {
    throw new ValidationError('Le nombre maximum de participants doit être supérieur à 0');
  }

  // Validation de la date
  const eventDate = new Date(data.date);
  if (isNaN(eventDate.getTime())) {
    throw new ValidationError('Format de date invalide');
  }
}

// Middleware de validation pour les inscriptions
export function validateRegistrationData(data: RegistrationData): void {
  validators.required(data.firstName, 'prénom');
  validators.required(data.lastName, 'nom');
  validators.required(data.email, 'email');
  validators.required(data.eventId, 'événement');

  validators.minLength(data.firstName, 2, 'prénom');
  validators.minLength(data.lastName, 2, 'nom');
  validators.maxLength(data.firstName, 50, 'prénom');
  validators.maxLength(data.lastName, 50, 'nom');

  if (!validators.email(data.email)) {
    throw new ValidationError('Format d\'email invalide');
  }

  if (data.phone && !validators.phone(data.phone)) {
    throw new ValidationError('Format de téléphone invalide');
  }

  if (data.message) {
    validators.maxLength(data.message, 1000, 'message');
  }

  if (data.status && !validators.isValidRegistrationStatus(data.status)) {
    throw new ValidationError('Statut d\'inscription invalide');
  }
}

// Middleware de validation pour les contacts
export function validateContactData(data: ContactData): void {
  validators.required(data.firstName, 'prénom');
  validators.required(data.lastName, 'nom');
  validators.required(data.email, 'email');
  validators.required(data.subject, 'sujet');
  validators.required(data.message, 'message');

  validators.minLength(data.firstName, 2, 'prénom');
  validators.minLength(data.lastName, 2, 'nom');
  validators.minLength(data.subject, 5, 'sujet');
  validators.minLength(data.message, 10, 'message');

  validators.maxLength(data.firstName, 50, 'prénom');
  validators.maxLength(data.lastName, 50, 'nom');
  validators.maxLength(data.subject, 200, 'sujet');
  validators.maxLength(data.message, 2000, 'message');

  if (!validators.email(data.email)) {
    throw new ValidationError('Format d\'email invalide');
  }

  if (data.phone && !validators.phone(data.phone)) {
    throw new ValidationError('Format de téléphone invalide');
  }

  if (data.category && !validators.isValidCategory(data.category)) {
    throw new ValidationError('Catégorie invalide');
  }
}

// Types pour les réponses
interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Utilitaires de réponse API standardisées
export const ApiResponse = {
  success: (data: unknown, message?: string, status: number = 200) => {
    return NextResponse.json({
      success: true,
      message,
      data
    }, { status });
  },

  error: (message: string, code?: string, status: number = 400, details?: Record<string, unknown>) => {
    return NextResponse.json({
      success: false,
      error: message,
      code,
      details
    }, { status });
  },

  paginated: (data: unknown[], pagination: PaginationData, message?: string) => {
    return NextResponse.json({
      success: true,
      message,
      data,
      pagination
    });
  }
};