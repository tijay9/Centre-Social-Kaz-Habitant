'use client';

import Header from '@/components/Header';
import TeamMemberCard from '@/components/TeamMemberCard';
import { fetchTeamMembersClient } from '@/lib/data';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TeamMember } from '@/types';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('tous');

  useEffect(() => {
    async function loadTeam() {
      try {
        const members = await fetchTeamMembersClient();
        setTeamMembers(members);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'équipe:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  // Filtrer les membres par catégorie
  const filteredMembers = selectedCategory === 'tous' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === selectedCategory);

  const categories = [
    { id: 'tous', name: 'Toute l\'équipe' },
    { id: 'direction', name: 'Direction' },
    { id: 'seniors', name: 'Seniors' },
    { id: 'reeap', name: 'REEAP' },
    { id: 'laep', name: 'LAEP' },
    { id: 'jeunesse', name: 'Jeunesse' },
    { id: 'acces_droits', name: 'Accès aux droits' },
    { id: 'anime_quartier', name: 'Animation territoriale' }
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de l&apos;équipe...</p>
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
              Notre équipe
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Des professionnels passionnés au service de la communauté martiniquaise.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres par catégorie */}
      {teamMembers.length > 0 && (
        <section className="py-8 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-[#fc7f2b] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grille des membres de l&apos;équipe */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredMembers.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                Équipe en cours de constitution
              </h3>
              <p className="text-gray-500">
                Les informations sur notre équipe seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                Aucun membre dans cette catégorie
              </h3>
              <p className="text-gray-500 mb-8">
                Sélectionnez une autre catégorie pour voir les membres de l&apos;équipe.
              </p>
              <button
                onClick={() => setSelectedCategory('tous')}
                className="bg-[#fc7f2b] text-white px-6 py-3 rounded-lg hover:bg-[#e6721f] transition-colors"
              >
                Voir toute l&apos;équipe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section Rejoindre l&apos;équipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Rejoignez notre équipe
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Vous souhaitez contribuer à l&apos;accompagnement social et au développement du lien social en Martinique ? 
                Découvrez nos opportunités de carrière et rejoignez une équipe engagée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#fc7f2b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#e6721f] transition-colors"
                >
                  Nous contacter
                </motion.a>
                <motion.a
                  href="/apropos"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-[#fc7f2b] text-[#fc7f2b] px-8 py-3 rounded-lg font-semibold hover:bg-[#fc7f2b] hover:text-white transition-colors"
                >
                  En savoir plus
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}