'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface OriginalCategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  index: number;
}

export default function OriginalCategoryCard({ 
  title, 
  description, 
  imageUrl, 
  href, 
  index 
}: OriginalCategoryCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="category-card group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl block no-underline"
    >
      {/* Image de fond */}
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title}
          width={400}
          height={256}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
      </div>

      {/* Contenu */}
      <div className="category-card-content absolute bottom-0 left-0 right-0 p-6 text-white">
        <motion.h3 
          className="text-2xl font-bold mb-2 group-hover:text-[#fc7f2b] transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          {title}
        </motion.h3>
        <p className="text-gray-200 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Effet de survol */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#fc7f2b] transition-all duration-300 rounded-lg" />
    </motion.a>
  );
}