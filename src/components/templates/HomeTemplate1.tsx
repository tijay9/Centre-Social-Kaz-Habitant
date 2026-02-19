'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Users, Heart, Phone, Mail, MapPin, Clock, Calendar, ArrowRight, Star, HandHeart, Camera } from 'lucide-react';
import Image from 'next/image';
import FallbackImage from '@/components/FallbackImage';

// Template 1: Design Minimaliste & Élégant - Version Corrigée
export default function HomeTemplate1() {
  const services = [
    {
      title: 'Seniors',
      description: 'Un accompagnement bienveillant pour nos aînés, avec des activités enrichissantes et du lien social au quotidien.',
      icon: '🌸',
      color: '#fc7f2b',
      stats: '105 participants',
      image: '/SENIOR.jpeg'
    },
    {
      title: 'REEAP',
      description: 'Soutien et accompagnement personnalisé pour les familles dans leur quotidien et leur épanouissement.',
      icon: '🏠',
      color: '#37a599',
      stats: '25+ familles',
      image: '/REEAP.jpg'
    },
    {
      title: 'LAEP - Ti-Ludo',
      description: 'Un espace de jeu et d&apos;éveil sécurisé pour les tout-petits et leurs parents, favorisant les liens.',
      icon: '🎨',
      color: '#6271dd',
      stats: '130+ enfants',
      image: '/laep.jpg'
    },
    {
      title: 'Jeunesse & CLAS',
      description: 'Des programmes innovants pour accompagner les jeunes vers leur autonomie et leur insertion sociale.',
      icon: '🚀',
      color: '#8b5cf6',
      stats: '120 jeunes',
      image: '/jeunesse.jpg'
    },
    {
      title: 'Anime ton Quartier',
      description: 'Animation territoriale et mobilisation citoyenne pour créer du lien social et dynamiser la vie de quartier.',
      icon: '🎭',
      color: '#6366f1',
      stats: '600 participants',
      image: '/animetonquartier.jpeg' // Image de fallback qui existe
    },
    {
      title: 'Accès aux Droits',
      description: 'Accompagnement administratif et démarches en ligne pour faciliter l\'accès aux services publics et aux droits sociaux.',
      icon: '⚖️',
      color: '#4f46e5',
      stats: '200+ démarches',
      image: '/acces-droits.jpg' // Image de fallback qui existe
    }
  ];

  const achievements = [
    { icon: <Users className="w-6 h-6" />, number: '530+', label: 'Bénéficiaires', description: 'Personnes accompagnées' },
    { icon: <Calendar className="w-6 h-6" />, number: '25', label: 'Années', description: 'D\'expérience en Martinique' },
    { icon: <Heart className="w-6 h-6" />, number: '50+', label: 'Activités', description: 'Programmes proposés' },
    { icon: <Star className="w-6 h-6" />, number: '15', label: 'Professionnels', description: 'Équipe qualifiée' }
  ];

  type Actualite = { image: string; title: string; category: string; date: string; description: string };
  const actualites: Actualite[] = [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec Navigation */}
      <Header />
      
      {/* Hero Section Amélioré */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Pattern subtil amélioré */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #fc7f2b 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge d'introduction */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-6 py-3 bg-[#fc7f2b]/10 text-[#fc7f2b] rounded-full text-sm font-medium border border-[#fc7f2b]/20">
                <Heart className="w-4 h-4 mr-2" />
                Centre Social • Kaz&apos;Habitant • Martinique
              </span>
            </motion.div>

            {/* Logo et titre intégrés */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12 flex flex-col items-center"
            >
              <Image
                src="/logo.png"
                alt="Logo Dorothy"
                width={128}
                height={128}
                className="w-32 h-32 mb-6 object-contain"
              />
              
              <h1 className="text-6xl md:text-8xl font-extralight text-gray-900 mb-4 tracking-tight">
                Dorothy
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-px bg-[#fc7f2b] w-16"></div>
                <p className="text-xl md:text-2xl text-[#fc7f2b] font-medium">
                  Centre Social
                </p>
                <div className="h-px bg-[#fc7f2b] w-16"></div>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Un lieu de vie, d&apos;échange et de solidarité où chaque génération 
              trouve sa place au cœur de la Martinique depuis 25 ans.
            </motion.p>
            
            {/* Boutons CTA améliorés */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <motion.button
                whileHover={{ y: -3, boxShadow: "0 20px 40px rgba(252, 127, 43, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#fc7f2b] text-white px-10 py-4 rounded-lg font-medium text-lg hover:bg-[#e6721f] transition-all duration-300 flex items-center justify-center shadow-xl"
              >
                <HandHeart className="mr-3 w-5 h-5" />
                Découvrir nos services
                <ArrowRight className="ml-3 w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-lg font-medium text-lg hover:border-[#fc7f2b] hover:text-[#fc7f2b] transition-all duration-300 flex items-center justify-center"
              >
                <Camera className="mr-3 w-5 h-5" />
                Notre histoire
              </motion.button>
            </motion.div>

            {/* Statistiques en ligne dans le hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg"
            >
              {achievements.map((achievement) => (
                <div key={achievement.label} className="text-center">
                  <div className="flex justify-center mb-3 text-[#fc7f2b]">
                    {achievement.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-light text-gray-900 mb-1">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {achievement.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section Améliorée avec images */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Nos <span className="text-[#fc7f2b] font-light">Univers</span>
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Six espaces de vie pensés pour accompagner chaque génération dans son épanouissement personnel et social
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  {/* Image du service */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <FallbackImage
                      src={service.image}
                      alt={service.title}
                      width={400}
                      height={256}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Icône et stats sur l'image */}
                    <div className="absolute bottom-4 left-6 text-white">
                      <div className="text-3xl mb-2">{service.icon}</div>
                      <div 
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: service.color }}
                      >
                        {service.stats}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="p-8">
                    <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-[#fc7f2b] transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed font-light">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center text-[#fc7f2b] group-hover:translate-x-2 transition-transform">
                      <span className="text-sm font-medium mr-2">En savoir plus</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Actualités Améliorée */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Actualités & <span className="text-[#fc7f2b]">Événements</span>
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Découvrez les dernières nouvelles et événements de notre centre social
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {actualites.map((article, index) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
              >
                {/* Image de l'actualité */}
                <div className="relative h-48 overflow-hidden">
                  <FallbackImage
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#fc7f2b] text-white text-xs font-medium uppercase tracking-wide rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-[#fc7f2b] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 font-light leading-relaxed">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {article.date}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#fc7f2b] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact Améliorée */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        {/* Pattern décoratif */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #fc7f2b 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-extralight mb-8">
                Rejoignez notre
                <span className="block text-[#fc7f2b] font-light">Communauté</span>
              </h2>
              <div className="w-24 h-px bg-[#fc7f2b] mb-8" />
              <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
                Découvrez une communauté bienveillante et engagée au service de l&apos;épanouissement 
                de chacun. Ensemble, construisons un avenir plus solidaire.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ y: -3, boxShadow: "0 20px 40px rgba(252, 127, 43, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#fc7f2b] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#e6721f] transition-all duration-300 inline-flex items-center justify-center"
                >
                  <HandHeart className="mr-3 w-5 h-5" />
                  Devenir bénévole
                </motion.button>
                
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-[#fc7f2b] text-[#fc7f2b] px-8 py-4 rounded-lg font-medium hover:bg-[#fc7f2b] hover:text-white transition-all duration-300 inline-flex items-center justify-center"
                >
                  <Mail className="mr-3 w-5 h-5" />
                  Nous contacter
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700"
            >
              <h3 className="text-2xl font-medium mb-8 text-[#fc7f2b]">
                Informations Pratiques
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <MapPin className="w-6 h-6 text-[#fc7f2b] mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-lg">Adresse</div>
                    <div className="text-gray-400">Fort-de-France, Martinique</div>
                    <div className="text-gray-500 text-sm">Quartier Kaz&apos;Habitant</div>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <Phone className="w-6 h-6 text-[#fc7f2b] mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-lg">Téléphone</div>
                    <div className="text-gray-400">0596 XX XX XX</div>
                    <div className="text-gray-500 text-sm">Accueil et renseignements</div>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <Mail className="w-6 h-6 text-[#fc7f2b] mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-lg">Email</div>
                    <div className="text-gray-400">contact@dorothy.mq</div>
                    <div className="text-gray-500 text-sm">Réponse sous 24h</div>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <Clock className="w-6 h-6 text-[#fc7f2b] mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-lg">Horaires</div>
                    <div className="text-gray-400">Lun-Ven: 8h-17h</div>
                    <div className="text-gray-400">Samedi: 9h-12h</div>
                    <div className="text-gray-500 text-sm">Fermé le dimanche</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}