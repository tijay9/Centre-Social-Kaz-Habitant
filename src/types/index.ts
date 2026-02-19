export interface CategoryCard {
  id: string;
  title: string;
  description: string;
  color: 'orange' | 'green' | 'blue' | 'gradient' | 'purple' | 'teal' | 'indigo';
  icon: string;
  features: string[];
  imageUrl?: string;
  link: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  bio?: string;
  imageUrl?: string;
  image?: string | null; // utilisé par TeamMemberCard
  category: 'SENIORS' | 'REEAP' | 'LAEP' | 'JEUNESSE' | 'GENERAL';
  email?: string;
  phone?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = 'SENIORS' | 'REEAP' | 'LAEP' | 'JEUNESSE' | 'ACCES_DROITS' | 'ANIME_QUARTIER' | 'GENERAL';

// Events don't use the generic 'GENERAL' category in the API, so expose a specific type
export type EventCategory = Exclude<Category, 'GENERAL'>;

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type ContactStatus = 'NEW' | 'READ' | 'REPLIED';

export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type UserRole = 'ADMIN' | 'USER';

export type PartnerType = 'INSTITUTIONAL' | 'ASSOCIATIF' | 'PRIVE';

export type SettingType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'URL' | 'EMAIL';

export interface Event {
  id: string;
  title: string;
  description: string;
  content: string;
  date: Date | string; // Accepter les dates sous forme de chaîne depuis la DB
  time: string | null;
  location: string;
  imageUrl?: string;
  category: EventCategory;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  featured?: boolean;
  maxParticipants?: number;
  tags?: string[];
  createdById: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'USER';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  title?: string;
  description?: string;
  filename?: string;
  url: string;
  category?: 'SENIORS' | 'REEAP' | 'LAEP' | 'JEUNESSE' | 'GENERAL';
  tags?: string[];
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Partner {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  category: 'INSTITUTIONAL' | 'ASSOCIATIF' | 'PRIVE';
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'URL' | 'EMAIL';
  updatedAt: Date;
}

export interface Statistic {
  id: string;
  key: string;
  value: number;
  category?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}