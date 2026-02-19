'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Users, Award, Target } from 'lucide-react';

export default function PartenairesPage() {
  const partenaires = [
    {
      id: 1,
      name: "Collectivité Territoriale de Martinique",
      category: "Institutionnel",
      description: "Partenaire principal pour le financement et le développement des programmes sociaux",
      logo: "/placeholder-logo.png",
      website: "https://www.collectivitedemartinique.mq",
      type: "public"
    },
    {
      id: 2,
      name: "CAF Martinique",
      category: "Organisme Social",
      description: "Caisse d'Allocations Familiales - Soutien aux familles et programmes jeunesse",
      logo: "/placeholder-logo.png",
      website: "https://www.caf.fr",
      type: "public"
    },
    {
      id: 3,
      name: "Ville de Fort-de-France",
      category: "Collectivité Locale",
      description: "Partenariat pour les activités locales et l'animation du quartier",
      logo: "/placeholder-logo.png",
      website: "https://www.fortdefrance.fr",
      type: "public"
    },
    {
      id: 4,
      name: "ARS Martinique",
      category: "Santé",
      description: "Agence Régionale de Santé - Programmes de prévention et santé publique",
      logo: "/placeholder-logo.png",
      website: "https://www.martinique.ars.sante.fr",
      type: "public"
    },
    {
      id: 5,
      name: "Fondation de France",
      category: "Fondation",
      description: "Soutien financier pour les projets d'insertion et d'accompagnement social",
      logo: "/placeholder-logo.png",
      website: "https://www.fondationdefrance.org",
      type: "prive"
    },
    {
      id: 6,
      name: "Association CCAS",
      category: "Association",
      description: "Collaboration pour l'aide sociale et l'accompagnement des familles",
      logo: "/placeholder-logo.png",
      website: "#",
      type: "associatif"
    },
    {
      id: 7,
      name: "Croix-Rouge Française",
      category: "Humanitaire",
      description: "Partenariat pour l'aide d'urgence et l'accompagnement social",
      logo: "/placeholder-logo.png",
      website: "https://www.croix-rouge.fr",
      type: "associatif"
    },
    {
      id: 8,
      name: "Pôle Emploi Martinique",
      category: "Emploi",
      description: "Accompagnement à l'insertion professionnelle et formation",
      logo: "/placeholder-logo.png",
      website: "https://www.pole-emploi.fr",
      type: "public"
    }
  ];

  const categories = [
    {
      name: "Partenaires Institutionnels",
      icon: Award,
      color: "from-[#fc7f2b] to-orange-600",
      count: partenaires.filter(p => p.type === "public").length
    },
    {
      name: "Fondations & Privé",
      icon: Heart,
      color: "from-[#37a599] to-teal-600",
      count: partenaires.filter(p => p.type === "prive").length
    },
    {
      name: "Associations",
      icon: Users,
      color: "from-[#6271dd] to-blue-600",
      count: partenaires.filter(p => p.type === "associatif").length
    }
  ];

  const stats = [
    { number: "15+", label: "Partenaires actifs", icon: Users },
    { number: "8", label: "Secteurs d'activité", icon: Target },
    { number: "2018", label: "Premier partenariat", icon: Award },
    { number: "100%", label: "Collaboration locale", icon: Heart }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
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
                Nos Partenaires
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                Ensemble, nous construisons un réseau solide pour accompagner et soutenir notre communauté.
              </p>
            </div>
          </div>
        </section>

        

        

        {/* Partners Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-12"
            >
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partenaires.map((partenaire, index) => (
                <motion.div
                  key={partenaire.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                        partenaire.type === 'public' ? 'bg-blue-100 text-blue-800' :
                        partenaire.type === 'prive' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {partenaire.category}
                      </span>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#fc7f2b] transition-colors">
                        {partenaire.name}
                      </h3>
                    </div>
                    {partenaire.website !== "#" && (
                      <a
                        href={partenaire.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#fc7f2b] transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  <div className="bg-gray-100 h-24 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Logo {partenaire.name}</div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {partenaire.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}