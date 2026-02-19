'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Users, Heart, Target, Award, Building, Calendar, Phone } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Bienveillance',
      description: 'Nous accueillons chaque personne avec respect et empathie, dans un esprit de solidarité.'
    },
    {
      icon: Users,
      title: 'Inclusion',
      description: 'Nous œuvrons pour créer du lien social et favoriser la participation de tous.'
    },
    {
      icon: Target,
      title: 'Engagement',
      description: 'Nous nous engageons pleinement dans notre mission d\'accompagnement social.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous visons la qualité dans tous nos services et accompagnements.'
    }
  ];

  const missions = [
    {
      title: 'Seniors - 105 usagers en file active',
      description: 'Plus de 100 activités réalisées par an : ateliers mémoire, sorties culturelles, accompagnement personnalisé et lutte contre l\'isolement.',
      color: 'bg-[#fc7f2b]'
    },
    {
      title: 'REEAP - Soutien à la Parentalité',
      description: 'Réseau d\'Écoute, d\'Appui et d\'Accompagnement des Parents : groupes de parole, café des parents, formations aux compétences parentales.'
    },
    {
      title: 'LAEP Ti-Ludo - 130+ enfants accueillis',
      description: 'Plus de 600 heures de fonctionnement annuel pour l\'accueil des 0-4 ans avec leurs parents. Espace d\'éveil et de socialisation précoce.'
    },
    {
      title: 'Jeunesse & CLAS - 120 jeunes accompagnés',
      description: 'CLAS (soutien scolaire), dispositif Tremplin Jeunesse, projets citoyens et activités sportives et culturelles.'
    },
    {
      title: 'Accès aux Droits - Accompagnement administratif',
      description: 'Aide aux démarches administratives, information juridique et accompagnement social personnalisé. Soutien dans l\'accès aux droits sociaux.'
    },
    {
      title: 'Anime ton Quartier - 600 participants',
      description: '10 thématiques d\'animation territoriale pour renforcer les liens sociaux et mobiliser les habitants autour de projets communs.'
    }
  ];

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
          <div className="bg-white/95 rounded-2xl shadow-xl px-6 py-6 md:px-10 md:py-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Qui sommes-nous ?
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Le Centre Social Kaz&apos;Habitant, un lieu de vie, d&apos;échange et de solidarité au cœur de la Martinique.
            </p>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Notre <span className="text-[#fc7f2b]">Histoire</span>
              </h2>
              <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
                <p className="mb-6">
                  l&apos;Association Dorothy fête aujourd&apos;hui ses 18 années d&apos;existence au service de la 
                  communauté martiniquaise. Créée par la volonté des habitants, elle perdure grâce 
                  à leur engagement constant. Cette structure éprouvée continue d&apos;évoluer pour mieux 
                  répondre aux besoins sociaux du territoire, sa vocation d&apos;utilité publique étant 
                  reconnue par tous.
                </p>
                <p className="mb-6">
                  Comme Dorothy dans son voyage vers la découverte, nous accompagnons chaque habitant 
                  sur son chemin vers l&apos;épanouissement personnel et l&apos;insertion sociale. Notre association 
                  s&apos;inscrit pleinement dans la politique de ville et du territoire martiniquais, 
                  contribuant activement à la vie de la Cité.
                </p>
                <p className="mb-6">
                  Implantée aux Hauts de Dillon, notre Centre Social Kaz&apos;Habitant œuvre dans un territoire 
                  chargé d&apos;histoire. Depuis l&apos;éruption de la Montagne Pelée qui a transformé l&apos;urbanisme 
                  martiniquais, Fort-de-France accueille les populations en quête de nouveaux horizons. 
                  Le quartier Dillon, né dans les années 1960, témoigne de cette évolution urbaine 
                  et sociale que nous accompagnons quotidiennement.
                </p>
               
                <p>
                  De l&apos;accompagnement des seniors à l&apos;éveil des tout-petits au LAEP Ti-Ludo, en passant 
                  par le soutien à la parentalité avec le REEAP et l&apos;insertion des jeunes, nous couvrons 
                  l&apos;ensemble des besoins sociaux. Nos actions &apos;Anime ton Quartier&apos; mobilisent plus de 
                  600 participants, témoignant de notre capacité à créer une véritable dynamique 
                  territoriale basée sur la solidarité et l&apos;entraide.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos <span className="text-[#fc7f2b]">Valeurs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les valeurs qui guident notre action quotidienne et donnent du sens à notre engagement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#fc7f2b] to-[#37a599] flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Missions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos <span className="text-[#fc7f2b]">Missions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quatre domaines d&apos;intervention pour répondre aux besoins de tous les publics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#fc7f2b]"
              >
                <div className="flex items-start mb-4">
                  <div className={`w-4 h-4 rounded-full ${mission.color} mr-4 mt-2 flex-shrink-0`} />
                  <h3 className="text-xl font-bold text-gray-900">
                    {mission.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed ml-8">
                  {mission.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Informations <span className="text-[#fc7f2b]">Pratiques</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <Building className="w-12 h-12 mx-auto mb-4 text-[#fc7f2b]" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-600">
                Centre Social Kaz&apos;Habitant<br />
                Les Hauts de Dillon<br />
                Résidence Capitole 3 - Bât 4<br />
                97200 Fort-de-France, Martinique
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <Calendar className="w-12 h-12 mx-auto mb-4 text-[#37a599]" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Horaires</h3>
              <p className="text-gray-600 text-sm">
                <strong>Lundi :</strong> 09h30-12h30 / 14h00-16h30<br />
                <strong>Mardi :</strong> 09h30-12h30 / 14h00-16h30<br />
                <strong>Mercredi :</strong> <span className="text-red-500">Fermé</span><br />
                <strong>Jeudi :</strong> 09h00-12h00 / 14h00-16h00<br />
                <strong>Vendredi :</strong> 09h30-13h00<br />
                <strong>Samedi :</strong> 09h00-13h00<br />
                <strong>Dimanche :</strong> <span className="text-red-500">Fermé</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <Phone className="w-12 h-12 mx-auto mb-4 text-[#6271dd]" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-600">
                0696 00 01 69<br />
                0696 61 36 03<br />
                associationdorothy@live.fr
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      
    </main>
  );
}