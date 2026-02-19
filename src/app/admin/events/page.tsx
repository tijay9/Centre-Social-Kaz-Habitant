'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchEventsClient } from '@/lib/data';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  category: 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'anime-quartier' | 'acces-droits' | 'general';
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  featured?: boolean;
}

interface RawEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time?: string;
  location?: string;
  category: string;
  imageUrl?: string;
  featured?: boolean;
  status?: string;
  createdAt?: string;
}

const parseDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

const computeStatusFromApi = (rawStatus?: string, dateString?: Date | string): Event['status'] => {
  const now = new Date();
  const date = dateString ? parseDate(dateString) : now;

  const upperStatus = (rawStatus || '').toUpperCase();

  // Si explicitement annulé côté API, on garde annulé
  if (upperStatus === 'CANCELLED') return 'cancelled';

  // Si la date est passée (avant aujourd'hui), on considère terminé
  if (date.getTime() < now.getTime()) return 'completed';

  // Sinon, considéré comme "À venir" (même si DRAFT côté API, on ne montre pas les brouillons ailleurs)
  return 'upcoming';
};

// Normalize API enum values (e.g., 'ANIME_QUARTIER', 'ACCES_DROITS') to UI values
const mapApiCategoryToUi = (input: string): Event['category'] => {
  const norm = (input || '').toUpperCase().replace(/-/g, '_');
  switch (norm) {
    case 'SENIORS':
      return 'seniors';
    case 'REEAP':
      return 'reeap';
    case 'LAEP':
      return 'laep';
    case 'JEUNESSE':
      return 'jeunesse';
    case 'ANIME_QUARTIER':
      return 'anime-quartier';
    case 'ACCES_DROITS':
      return 'acces-droits';
    default:
      return 'general';
  }
};

const toUiEvent = (event: RawEvent): Event => {
  const category = mapApiCategoryToUi(event.category);
  const status = computeStatusFromApi(event.status, event.date);

  const rawDate = event.date as unknown as string;
  const uiDate = typeof rawDate === 'string'
    ? rawDate.substring(0, 10)
    : new Date(rawDate).toISOString().split('T')[0];

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: uiDate,
    time: event.time,
    location: event.location,
    category,
    image: event.imageUrl,
    status,
    createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : new Date().toISOString(),
    featured: event.featured,
  };
};

export default function AdminEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'anime-quartier' | 'acces-droits' | 'general'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const eventsPerPage = 10;

  useEffect(() => {
    async function loadEvents() {
      try {
        const eventsData: RawEvent[] = await fetchEventsClient();
        const formattedEvents: Event[] = eventsData.map(toUiEvent);
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const refreshEvents = async () => {
    try {
      const eventsData: RawEvent[] = await fetchEventsClient();
      const formattedEvents: Event[] = eventsData.map(toUiEvent);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des événements:', error);
    }
  };

  const handleToggleFeatured = async (eventId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Impossible de mettre à jour l'événement");
      }

      const updated = await res.json();

      setEvents(prev => {
        // Si l’API renvoie directement l’événement mis à jour
        if (updated && updated.event && updated.event.id) {
          // Si on vient de passer un événement en "à la une" (featured=true),
          // on force tous les autres à featured=false pour garantir l’unicité côté UI.
          if (updated.event.featured) {
            return prev.map(e =>
              e.id === updated.event.id
                ? { ...e, featured: true }
                : { ...e, featured: false }
            );
          }
          // Sinon, simple mise à jour de cet événement uniquement.
          return prev.map(e =>
            e.id === updated.event.id
              ? { ...e, featured: !!updated.event.featured }
              : e
          );
        }

        // Si l’API ne renvoie pas l’objet event (cas actuel : seulement un message),
        // on se base sur l’eventId et currentFeatured pour mettre à jour le state.
        if (!currentFeatured) {
          // On vient de passer cet événement en "À la une" : on met les autres à false.
          return prev.map(e =>
            e.id === eventId ? { ...e, featured: true } : { ...e, featured: false }
          );
        }

        // On vient de retirer "À la une" sur cet événement : juste le désactiver.
        return prev.map(e =>
          e.id === eventId ? { ...e, featured: false } : e
        );
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la mise à la une:", error);
      alert("Impossible de mettre à jour la mise à la une.");
    }
  };

  // Filtrage des événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const getCategoryLabel = (category: string) => {
    const labels = {
      seniors: 'Seniors',
      reeap: 'REEAP',
      laep: 'LAEP - Ti-Ludo',
      jeunesse: 'Jeunesse',
      'anime-quartier': 'Anime Quartier',
      'acces-droits': 'Accès aux droits',
      general: 'Général'
    } as const;
    return (labels as any)[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      seniors: 'bg-blue-100 text-blue-800',
      reeap: 'bg-green-100 text-green-800',
      laep: 'bg-purple-100 text-purple-800',
      jeunesse: 'bg-orange-100 text-orange-800',
      'anime-quartier': 'bg-indigo-100 text-indigo-800',
      'acces-droits': 'bg-teal-100 text-teal-800',
      general: 'bg-gray-100 text-gray-800'
    } as const;
    return (colors as any)[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      upcoming: 'À venir',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
    const d = new Date(year, (month || 1) - 1, day || 1);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      setShowDeleteModal(null);
      return;
    }

    try {
      // L’API /api/events/[id] utilise requireAuth via les cookies de session,
      // donc pas besoin d’envoyer un bearer token depuis le client.
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      await refreshEvents();
      setShowDeleteModal(null);
      alert('Événement supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression: ' + (error as Error).message);
    }
  };

  const toggleEventStatus = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const newStatus = event.status === 'cancelled' ? 'PUBLISHED' : 'CANCELLED';

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      await refreshEvents();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des événements</h1>
          <p className="text-gray-700 mt-1">
            Gérez les événements et activités du centre social
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/events/new"
            className="inline-flex items-center px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel événement
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
            />
          </div>

          {/* Filtre par catégorie */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as typeof filterCategory)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="seniors">Seniors</option>
            <option value="reeap">REEAP</option>
            <option value="laep">LAEP - Ti-Ludo</option>
            <option value="jeunesse">Jeunesse</option>
            <option value="anime-quartier">Anime Quartier</option>
            <option value="acces-droits">Accès aux droits</option>
            <option value="general">Général</option>
          </select>

          {/* Filtre par statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="upcoming">À venir</option>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>

          {/* Informations */}
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-1" />
            {filteredEvents.length} événement(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* Liste des événements */}
      {currentEvents.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Événement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {event.image && (
                            <Image 
                              src={event.image} 
                              alt={event.title}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                              {event.featured && (
                                <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  À la une
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {event.description}
                            </div>
                            {event.location && (
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div>{formatDate(event.date)}</div>
                            {event.time && (
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {event.time}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
                          {getCategoryLabel(event.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleFeatured(event.id, !!event.featured)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              event.featured 
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {event.featured ? 'Retirer' : 'À la une'}
                          </button>
                          <button
                            onClick={() => toggleEventStatus(event.id)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              event.status === 'cancelled' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {event.status === 'cancelled' ? 'Réactiver' : 'Annuler'}
                          </button>
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/events/new?editId=${event.id}`)}
                            className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setShowDeleteModal(event.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {startIndex + 1} à {Math.min(startIndex + eventsPerPage, filteredEvents.length)} sur {filteredEvents.length} événements
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Détail de l’événement sélectionné */}
          {selectedEvent && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Détails de l’événement
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Fermer
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800">
                <div>
                  <div className="font-semibold mb-1">Titre</div>
                  <div>{selectedEvent.title}</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Catégorie</div>
                  <div>{getCategoryLabel(selectedEvent.category)}</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Date</div>
                  <div>{formatDate(selectedEvent.date)}{selectedEvent.time ? ` à ${selectedEvent.time}` : ''}</div>
                </div>
                {selectedEvent.location && (
                  <div>
                    <div className="font-semibold mb-1">Lieu</div>
                    <div>{selectedEvent.location}</div>
                  </div>
                )}
                <div>
                  <div className="font-semibold mb-1">Statut</div>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                    {getStatusLabel(selectedEvent.status)}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-semibold mb-1 text-sm text-gray-700">Description</div>
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
              ? 'Aucun événement trouvé' 
              : 'Aucun événement créé'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Essayez de modifier vos critères de recherche.'
              : 'Commencez par créer votre premier événement.'
            }
          </p>
          {(!searchTerm && filterCategory === 'all' && filterStatus === 'all') && (
            <Link
              href="/admin/events/new"
              className="inline-flex items-center px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un événement
            </Link>
          )}
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supprimer l`&apos;`événement
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteEvent(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}