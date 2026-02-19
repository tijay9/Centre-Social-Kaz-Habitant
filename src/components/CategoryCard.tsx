'use client';

import { motion } from 'framer-motion';
import type { CategoryCard } from '@/types';
import { Users, Heart, Baby, Zap, Home, Briefcase, ArrowRight, MapPin, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CategoryCardProps {
  category: CategoryCard;
  index: number;
}

const iconMap = {
  Users,
  Heart, 
  Baby,
  Zap,
  Home,
  Briefcase,
  MapPin,
  Scale
};

const colorClasses = {
  orange: {
    background: 'bg-[#fc7f2b]',
    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
    border: 'group-hover:border-[#fc7f2b]',
    text: 'text-white'
  },
  green: {
    background: 'bg-[#37a599]',
    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
    border: 'group-hover:border-[#37a599]',
    text: 'text-white'
  },
  blue: {
    background: 'bg-[#6271dd]',
    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
    border: 'group-hover:border-[#6271dd]',
    text: 'text-white'
  },
  gradient: {
    background: 'bg-purple-600',
    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
    border: 'group-hover:border-purple-500',
    text: 'text-white'
  },
  purple: {
    background: 'bg-purple-600',
    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
    border: 'group-hover:border-purple-600',
    text: 'text-white'
  },
  teal: {
    background: 'bg-teal-600',
    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
    border: 'group-hover:border-teal-600',
    text: 'text-white'
  },
  indigo: {
    background: 'bg-indigo-600',
    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
    border: 'group-hover:border-indigo-600',
    text: 'text-white'
  }
};

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] || Users;
  const colors = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.blue;

  // Mapping des liens selon l'ID de la catégorie
  const getPageLink = (categoryId: string) => {
    const linkMap: { [key: string]: string } = {
      'seniors': '/seniors',
      'reeap': '/reeap',
      'laep': '/tiludo',
      'jeunesse': '/jeunesse',
      'anime-ton-quartier': '/anime-quartier',
      'acces-droits': '/acces-droits'
    };
    return linkMap[categoryId] || '/evenements';
  };

  return (
    <Link href={getPageLink(category.id)} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer"
      >
        {/* Fond coloré */}
        <div className={cn(
          'relative h-80 overflow-hidden',
          colors.background
        )}>
          
          {/* Contenu */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
            {/* Icône en haut */}
            <div className="flex justify-start">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>
            
            {/* Contenu en bas */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {category.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                  {category.description}
                </p>
              </div>
              
              {/* Caractéristiques */}
              <div className="space-y-1">
                {category.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className="flex items-center text-xs text-white/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70 mr-2" />
                    {feature}
                  </div>
                ))}
                {category.features.length > 2 && (
                  <div className="text-xs text-white/80 font-medium">
                    +{category.features.length - 2} autres services
                  </div>
                )}
              </div>
              
              {/* Bouton d'action */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm shadow-lg transition-all duration-200 w-fit',
                  colors.button
                )}
              >
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Bordure d'effet au survol */}
        <div className={cn(
          'absolute inset-0 border-2 border-transparent transition-all duration-300 rounded-2xl',
          colors.border
        )} />
      </motion.div>
    </Link>
  );
}