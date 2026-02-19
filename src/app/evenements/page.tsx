'use client';

import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import EventCalendar from '@/components/EventCalendar';
import { fetchEventsClient } from '@/lib/data';
import { motion } from 'framer-motion';
import { Calendar, Users, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Event } from '@/types';

export default function EventsPage() {
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    async function loadEvents() {
      try {
        const eventsData = await fetchEventsClient();
        setEvents(eventsData);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Filtrer les événements par catégorie et recherche
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'tous' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'tous', name: 'Tous les événements', color: 'bg-gray-500' },
    { id: 'SENIORS', name: 'Seniors', color: 'bg-[#fc7f2b]' },
    { id: 'REEAP', name: 'REEAP', color: 'bg-[#37a599]' },
    { id: 'LAEP', name: 'Ti-Ludo', color: 'bg-[#6271dd]' },
    { id: 'JEUNESSE', name: 'Jeunesse', color: 'bg-purple-500' },
    { id: 'ANIME_QUARTIER', name: 'Anime ton Quartier', color: 'bg-pink-500' },
    { id: 'ACCES_DROITS', name: 'Accès aux droits', color: 'bg-indigo-500' }
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Bannière titre */}
      <section className="relative h-72 md:h-80 lg:h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/SENIOR.jpeg"
            alt="Bannière Dorothy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="bg-white/95 rounded-2xl shadow-xl px-6 py-6 md:px-10 md:py-8 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nos événements
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Découvrez toutes nos activités et participez à la vie du centre social Dorothy.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres et Contrôles */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
              />
            </div>

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    selectedCategory === category.id
                      ? `${category.color} text-white`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Contrôles d'affichage */}
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-4 py-2 rounded-md transition-all duration-200 font-medium flex items-center gap-2',
                  viewMode === 'list'
                    ? 'bg-white text-[#fc7f2b] shadow-sm'
                    : 'text-gray-600 hover:text-[#fc7f2b]'
                )}
              >
                <Users className="w-4 h-4" />
                Liste
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'px-4 py-2 rounded-md transition-all duration-200 font-medium flex items-center gap-2',
                  viewMode === 'calendar'
                    ? 'bg-white text-[#fc7f2b] shadow-sm'
                    : 'text-gray-600 hover:text-[#fc7f2b]'
                )}
              >
                <Calendar className="w-4 h-4" />
                Calendrier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu des événements */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              ) : (
                <div className="max-w-6xl mx-auto">
                  <EventCalendar events={filteredEvents} />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'tous' 
                  ? 'Aucun événement trouvé' 
                  : 'Aucun événement à venir'
                }
              </h3>
              <p className="text-gray-500 mb-8">
                {searchTerm || selectedCategory !== 'tous'
                  ? 'Essayez de modifier vos critères de recherche ou de filtre.'
                  : 'Consultez régulièrement cette page pour découvrir nos prochaines activités.'
                }
              </p>
              {(searchTerm || selectedCategory !== 'tous') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('tous');
                  }}
                  className="bg-[#fc7f2b] text-white px-6 py-3 rounded-lg hover:bg-[#e6721f] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      
    </main>
  );
}