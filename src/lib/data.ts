// Import seulement les types, pas les fonctions de database
import { apiFetch } from './apiClient';

// Données statiques pour les catégories (comme avant)
export const categoryData = [
  {
    id: 'seniors',
    title: 'Seniors',
    description: 'Programmes d\'accompagnement et d\'activités dédiés aux personnes âgées pour maintenir le lien social et le bien-être.',
    color: 'orange' as const,
    icon: 'Heart',
    imageUrl: '/SENIOR.jpeg',
    features: [
      'Ateliers créatifs et manuels',
      'Sorties culturelles et découvertes',
      'Accompagnement administratif',
      'Activités physiques adaptées',
      'Repas partagés et convivialité',
      'Soutien aux aidants familiaux'
    ],
    link: '/seniors'
  },
  {
    id: 'reeap',
    title: 'REEAP',
    description: 'Réseau d\'Écoute, d\'Appui et d\'Accompagnement des Parents - Soutien à la parentalité et accompagnement des familles',
    color: 'green' as const,
    icon: 'Users',
    imageUrl: '/REEAP.jpg',
    features: [
      'Soutien à la parentalité',
      'Groupes de parole parents',
      'Ateliers éducatifs familiaux',
      'Accompagnement individuel',
      'Médiation familiale',
      'Actions de prévention'
    ],
    link: '/reeap'
  },
  {
    id: 'laep',
    title: 'Ti-Ludo (LAEP)',
    description: 'Lieu d\'Accueil Enfants Parents - Espace de jeu, d\'éveil et d\'échange pour les enfants de 0 à 4 ans accompagnés de leurs parents',
    color: 'purple' as const,
    icon: 'Baby',
    imageUrl: '/laep.jpg',
    features: [
      'Accueil enfants-parents (0-4 ans)',
      'Jeux et activités d\'éveil',
      'Accompagnement parental',
      'Socialisation précoce',
      'Ateliers créatifs parent-enfant',
      'Conseils éducatifs'
    ],
    link: '/tiludo'
  },
  {
    id: 'jeunesse',
    title: 'Jeunesse',
    description: 'Programmes d\'accompagnement, d\'insertion et d\'épanouissement pour les jeunes de 11 à 25 ans',
    color: 'blue' as const,
    icon: 'Star',
    imageUrl: '/jeunesse.jpg',
    features: [
      'Accompagnement scolaire',
      'Insertion professionnelle',
      'Activités sportives et culturelles',
      'Ateliers numériques',
      'Projets citoyens',
      'Sorties éducatives'
    ],
    link: '/jeunesse'
  }
];

// Fonctions simples pour récupérer les données depuis les API
export async function fetchEventsClient() {
  try {
    const data = await apiFetch<{ events: any[] }>('/events');
    return data.events || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

export async function fetchTeamMembersClient() {
  try {
    const data = await apiFetch<{ teamMembers: any[] }>('/team');
    return data.teamMembers || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

export async function fetchGalleryImagesClient() {
  try {
    const data = await apiFetch<any[]>('/gallery');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

export async function fetchStatisticsClient() {
  try {
    return await apiFetch<Record<string, any>>('/statistics');
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

// Informations de contact statiques
export const contactInfo = {
  address: 'Les Hauts de Dillon, Résidence Capitole 3 - Bât 4, 97200 Fort-de-France, Martinique',
  phone: '0696 00 01 69 / 0696 61 36 03',
  email: 'associationdorothy@live.fr',
  socialMedia: {
    facebook: '#',
    instagram: '#'
  }
};