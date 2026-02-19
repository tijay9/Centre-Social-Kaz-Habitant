'use client';

import { motion } from 'framer-motion';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn, toUiEventCategory, getUiEventCategoryLabel } from '@/lib/utils';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
  index: number;
  featured?: boolean;
}

const categoryColors = {
  seniors: 'border-[#fc7f2b] bg-gradient-to-br from-orange-50 to-orange-100',
  reeap: 'border-[#37a599] bg-gradient-to-br from-teal-50 to-teal-100',
  laep: 'border-[#6271dd] bg-gradient-to-br from-indigo-50 to-indigo-100',
  jeunesse: 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50',
  'anime-quartier': 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100',
  'acces-droits': 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100',
  general: 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100',
} as const;

const parseDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

export default function EventCard({ event, index, featured = false }: EventCardProps) {
  const uiCategory = toUiEventCategory(String(event.category));
  const colorClass = categoryColors[uiCategory] || categoryColors.seniors;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeUntilEvent = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays > 0) return `Dans ${diffDays} jours`;
    return "Événement passé";
  };

  const handleViewDetails = () => {
    window.location.href = `/evenements/${event.id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: featured ? 1.02 : 1.03 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl',
        colorClass,
        featured ? 'col-span-full md:col-span-2 lg:col-span-3' : ''
      )}
    >
      {/* Image de l'événement */}
      <div className={cn(
        'relative overflow-hidden',
        featured ? 'h-64 md:h-80' : 'h-48'
      )}>
        <Image 
          src={event.imageUrl || '/api/placeholder/400/300'} 
          alt={event.title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badge de date */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-lg">
          <div className="text-2xl font-bold text-gray-900">
            {parseDate(event.date).getDate()}
          </div>
          <div className="text-xs text-gray-600 uppercase font-medium">
            {parseDate(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
          </div>
        </div>

        {/* Badge "À la une" pour les événements featured */}
        {featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#fc7f2b] to-[#37a599] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            À LA UNE
          </div>
        )}

        {/* Badge de catégorie */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
            {getUiEventCategoryLabel(uiCategory)}
          </span>
        </div>
      </div>

      {/* Contenu de l'événement */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className={cn(
            'font-bold text-gray-900 mb-3 line-clamp-2',
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          )}>
            {event.title}
          </h3>
          
          <p className={cn(
            'text-gray-700 leading-relaxed mb-4',
            featured ? 'text-lg line-clamp-3' : 'text-sm line-clamp-2'
          )}>
            {event.description}
          </p>
        </div>

        {/* Informations de l'événement */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-3 text-[#fc7f2b]" />
            <span className="text-sm">
              {formatDate(parseDate(event.date))} • {getTimeUntilEvent(parseDate(event.date))}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-3 text-[#37a599]" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        {/* Bouton d'action */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleViewDetails}
          className="w-full bg-gradient-to-r from-[#fc7f2b] to-[#37a599] text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Voir les détails
        </motion.button>
      </div>
    </motion.div>
  );
}