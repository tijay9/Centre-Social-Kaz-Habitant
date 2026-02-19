'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Event } from '@/types';
import { cn, toUiEventCategory, getUiEventCategoryLabel, type UiEventCategory } from '@/lib/utils';
import Link from 'next/link';

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fonction utilitaire pour convertir les dates en objets Date valides
  const parseEventDate = (date: Date | string | number | null | undefined): Date => {
    if (!date) return new Date();
    if (date instanceof Date) return date;
    if (typeof date === 'string') return new Date(date);
    if (typeof date === 'number') return new Date(date);
    return new Date();
  };

  // Fonction utilitaire pour formater l'heure de manière sûre
  const formatEventTime = (date: Date | string | number | null | undefined): string => {
    try {
      const eventDate = parseEventDate(date);
      return eventDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Erreur de formatage de l\'heure:', error);
      return '--:--';
    }
  };

  // Obtenir les informations du mois actuel
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Premier jour du mois et nombre de jours
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Navigation du calendrier
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Vérifier si une date a des événements
  const getEventsForDate = (day: number) => {
    // const date = new Date(year, month, day);
    return events.filter(event => {
      try {
        const eventDate = parseEventDate(event.date);
        return eventDate.getDate() === day &&
               eventDate.getMonth() === month &&
               eventDate.getFullYear() === year;
      } catch (error) {
        console.warn('Erreur de comparaison de date pour l\'événement:', event.id, error);
        return false;
      }
    });
  };

  // Obtenir les événements pour la date sélectionnée
  const selectedDateEvents = selectedDate ?
    events.filter(event => {
      try {
        const eventDate = parseEventDate(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      } catch (error) {
        console.warn('Erreur de filtrage de date pour l\'événement:', event.id, error);
        return false;
      }
    }) : [];

  // Créer la grille du calendrier
  const calendarDays = [] as Array<number | null>;
  
  // Jours vides du début du mois
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const categoryColors = {
    seniors: 'bg-[#fc7f2b]',
    reeap: 'bg-[#37a599]',
    laep: 'bg-[#6271dd]',
    jeunesse: 'bg-purple-500',
    'anime-quartier': 'bg-emerald-500',
    'acces-droits': 'bg-indigo-600',
    general: 'bg-gray-400',
  } as const;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="calendar-container"
      >
        {/* En-tête du calendrier */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h3 className="text-xl font-bold text-gray-900 capitalize">
            {monthName}
          </h3>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2" />;
            }

            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;
            const date = new Date(year, month, day);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <motion.button
                key={`day-${year}-${month}-${day}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'relative p-2 text-sm rounded-lg transition-all duration-200 min-h-12',
                  'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#fc7f2b]/20',
                  isSelected && 'bg-[#fc7f2b] text-white',
                  isToday && !isSelected && 'bg-blue-50 text-blue-600 font-semibold',
                  hasEvents && !isSelected && 'font-medium'
                )}
              >
                <span className="relative z-10">{day}</span>
                
                {/* Indicateurs d'événements */}
                {hasEvents && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => {
                      const uiCat = toUiEventCategory(String(event.category));
                      return (
                        <div
                          key={`event-${event.id}-${eventIndex}`}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-white/80' : categoryColors[uiCat] || 'bg-gray-400'
                          )}
                        />
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-white/60' : 'bg-gray-300'
                      )} />
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Événements de la date sélectionnée */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 border-t pt-6"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-[#fc7f2b]" />
              Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h4>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const uiCat = toUiEventCategory(String(event.category));
                  return (
                    <Link
                      key={event.id}
                      href={`/evenements/${event.id}`}
                      className="block"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      >
                        <div className={cn(
                          'w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0',
                          categoryColors[uiCat] || 'bg-gray-400'
                        )} />
                        
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {event.title}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatEventTime(event.date)}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location}
                            </span>
                            <span className="px-2 py-1 bg-white rounded text-xs capitalize">
                              {getUiEventCategoryLabel(uiCat)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun événement prévu ce jour-là</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Légende des catégories */}
        <div className="mt-6 border-t pt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Catégories :</h5>
          <div className="flex flex-wrap gap-3">
            {Object.keys(categoryColors).map((key) => {
              const k = key as keyof typeof categoryColors;
              return (
                <div key={k} className="flex items-center text-sm">
                  <div className={cn('w-3 h-3 rounded-full mr-2', categoryColors[k])} />
                  <span className="text-gray-600 capitalize">
                    {getUiEventCategoryLabel(k as UiEventCategory)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}