'use client';

import { motion } from 'framer-motion';
import { TeamMember } from '@/types';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

const categoryColors = {
  direction: 'border-gradient-to-r from-[#fc7f2b] to-[#37a599]',
  seniors: 'border-[#fc7f2b]',
  reeap: 'border-[#37a599]',
  laep: 'border-[#6271dd]',
  jeunesse: 'border-purple-500',
};

export default function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const categoryKey = member.category.toLowerCase() as keyof typeof categoryColors;
  const borderColor = categoryColors[categoryKey] || categoryColors.direction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white border-2 shadow-lg transition-all duration-300 hover:shadow-2xl',
        borderColor
      )}
    >
      {/* Image du membre */}
      <div className="relative overflow-hidden h-80">
        {member.image ? (
          <Image 
            src={member.image} 
            alt={member.name}
            width={400}
            height={320}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#fc7f2b]/20 to-[#37a599]/20 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#fc7f2b] to-[#37a599] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge de catégorie */}
        <div className="absolute top-4 right-4">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg',
            member.category === 'GENERAL' ? 'bg-gradient-to-r from-[#fc7f2b] to-[#37a599]' :
            member.category === 'SENIORS' ? 'bg-[#fc7f2b]' :
            member.category === 'REEAP' ? 'bg-[#37a599]' :
            member.category === 'LAEP' ? 'bg-[#6271dd]' :
            'bg-purple-500'
          )}>
            {member.category === 'LAEP' ? 'Ti-Ludo' :
             member.category === 'GENERAL' ? 'Direction' :
             member.category.charAt(0) + member.category.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Informations du membre */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#fc7f2b] transition-colors duration-200">
            {member.name}
          </h3>
          <p className="text-[#37a599] font-semibold text-sm uppercase tracking-wide">
            {member.role}
          </p>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-4">
          {member.description}
        </p>

        {/* Actions de contact */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-[#fc7f2b] to-[#37a599] text-white py-2 px-4 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contacter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:border-[#fc7f2b] hover:text-[#fc7f2b] transition-all duration-200"
          >
            Profil
          </motion.button>
        </div>
      </div>

      {/* Effet de survol décoratif */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-r from-[#fc7f2b]/20 to-[#37a599]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}