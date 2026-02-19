'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Award, Heart, Phone, Mail, MapPin, Clock, Calendar, HandHeart } from 'lucide-react';
import FallbackImage from '@/components/FallbackImage';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string;
  imageUrl: string | null;
  category: string;
  status: string;
  featured: boolean;
}

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();

        const events: Event[] = data.events ?? [];
        const now = new Date();

        // On garde seulement les événements à venir (tous sont considérés comme publiés)
        const validEvents = events.filter((event) => {
          if (!event.date) return false;
          const [y, m, d] = event.date.split('-').map(Number);
          const eventDate = new Date(y, (m || 1) - 1, d || 1);
          return eventDate >= now;
        });

        // Événement marqué "À la une" en priorité
        const featured = validEvents.find((e) => e.featured);

        // Tous les événements triés par date croissante
        const sorted = [...validEvents].sort((a, b) => {
          const [ya, ma, da] = a.date.split('-').map(Number);
          const [yb, mb, db] = b.date.split('-').map(Number);
          const dateA = new Date(ya, (ma || 1) - 1, da || 1).getTime();
          const dateB = new Date(yb, (mb || 1) - 1, db || 1).getTime();
          return dateA - dateB;
        });

        let finalList: Event[];
        if (featured) {
          // Met l’événement à la une en premier, puis les autres
          finalList = [
            featured,
            ...sorted.filter((e) => e.id !== featured.id),
          ];
        } else {
          // Pas d’événement marqué "À la une" : on garde juste le tri par date
          finalList = sorted;
        }

        // On conserve les 3 premiers pour l’affichage
        setUpcomingEvents(finalList.slice(0, 3));
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const featuredEvent = upcomingEvents[0];

  const services = [
    {
      title: 'Seniors',
      description: 'Un accompagnement bienveillant pour nos aînés, avec des activités enrichissantes et du lien social au quotidien.',
      icon: '🌸',
      color: '#fc7f2b',
      stats: 'Nos aînés',
      image: '/SENIOR.jpeg'
    },
    {
      title: 'REEAP',
      description: 'Soutien et accompagnement personnalisé pour les familles dans leur quotidien et leur épanouissement.',
      icon: '🏠',
      color: '#37a599',
      stats: 'Familles accompagnées',
      image: '/REEAP.jpg'
    },
    {
      title: 'LAEP - Ti-Ludo',
      description: 'Un espace de jeu et d\'éveil sécurisé pour les tout-petits et leurs parents, favorisant les liens.',
      icon: '🎨',
      color: '#6271dd',
      stats: 'Enfants accueillis',
      image: '/laep.jpg'
    },
    {
      title: 'Jeunesse & CLAS',
      description: 'Des programmes innovants pour accompagner les jeunes vers leur autonomie et leur insertion sociale.',
      icon: '🚀',
      color: '#8b5cf6',
      stats: 'Jeunes accompagnés',
      image: '/jeunesse.jpg'
    },
    {
      title: 'Anime ton Quartier',
      description: 'Animation territoriale et mobilisation citoyenne pour créer du lien social et dynamiser la vie de quartier.',
      icon: '🎭',
      color: '#6366f1',
      stats: 'Événements organisés',
      image: '/animetonquartier.jpeg'
    },
    {
      title: 'Accès aux Droits',
      description: 'Accompagnement administratif et démarches en ligne pour faciliter l\'accès aux services publics et aux droits sociaux.',
      icon: '⚖️',
      color: '#4f46e5',
      stats: 'Démarches accompagnées',
      image: '/acces-droits.jpg'
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header avec Navigation */}
      <Header />

      {/* Hero Section Simplifiée */}
      <section className="py-5 flex items-center justify-center relative overflow-hidden bg-[#fef7f0]">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            {/* Bloc À la une */}
            <div className="w-full flex items-stretch">
              <div className="bg-white rounded-2xl shadow-xl border border-orange-100 px-6 py-5 md:px-8 md:py-6 text-left w-full flex flex-col">
                <div className="text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase mb-3">
                  À la une
                </div>

                {featuredEvent ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {featuredEvent.title}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-4">
                      {featuredEvent.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-[#fc7f2b]">
                        {featuredEvent.category}
                      </span>
                      <Link
                        href={`/evenements/${featuredEvent.id}`}
                        className="text-xs md:text-sm font-medium text-[#fc7f2b] hover:text-[#e6721f] inline-flex items-center"
                      >
                        Voir l&apos;évènement
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col justify-center py-6">
                    <p className="text-sm text-gray-500">
                      Aucun évènement à venir pour le moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section Améliorée avec images */}
      <section id="services" className="py-32 bg-white">
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
            {services.map((service, index) => {
              // Mapping des liens selon le titre du service
              const getServiceLink = (title: string) => {
                const linkMap: { [key: string]: string } = {
                  'Seniors': '/seniors',
                  'REEAP': '/reeap',
                  'LAEP - Ti-Ludo': '/tiludo',
                  'Jeunesse & CLAS': '/jeunesse',
                  'Anime ton Quartier': '/anime-quartier',
                  'Accès aux Droits': '/acces-droits'
                };
                return linkMap[title] || '/evenements';
              };

              return (
                <Link key={service.title} href={getServiceLink(service.title)} className="block">
                  <motion.div
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
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
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
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Actualités & Événements */}
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

          {loading ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 shadow-lg max-w-2xl mx-auto"
              >
                <Calendar className="w-16 h-16 mx-auto mb-6 text-[#fc7f2b] animate-pulse" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Chargement...
                </h3>
                <p className="text-gray-600">
                  Récupération des prochains événements...
                </p>
              </motion.div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {upcomingEvents.map((event, index) => {
                const [year, month, day] = event.date.split('-').map(Number);
                const eventDate = new Date(year, (month || 1) - 1, day || 1);
                const formattedDate = eventDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                const formattedTime = event.time ? `à ${event.time}` : '';

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/evenements/${event.id}`} className="block">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                        {/* Image de l'événement */}
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          {event.imageUrl ? (
                            <FallbackImage
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#fc7f2b] to-[#e6721f]">
                              <Calendar className="w-16 h-16 text-white" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Badge catégorie */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#fc7f2b] text-white">
                              {event.category}
                            </span>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#fc7f2b] transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-[#fc7f2b]" />
                              <span>{formattedDate} {formattedTime}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 text-[#fc7f2b]" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center text-[#fc7f2b] group-hover:translate-x-2 transition-transform">
                            <span className="text-sm font-medium mr-2">Voir les détails</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 shadow-lg max-w-2xl mx-auto"
              >
                <Calendar className="w-16 h-16 mx-auto mb-6 text-[#fc7f2b]" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Aucun événement à venir
                </h3>
                <p className="text-gray-600 mb-8">
                  Il n&apos;y a pas d&apos;événements programmés pour le moment. 
                  Revenez bientôt pour découvrir nos prochaines activités !
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#fc7f2b] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#e6721f] transition-colors"
                  onClick={() => window.location.href = '/contact'}
                >
                  Nous contacter
                </motion.button>
              </motion.div>
            </div>
          )}

          {/* Bouton voir tous les événements */}
          <div className="text-center mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link href="/evenements">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#fc7f2b] border-2 border-[#fc7f2b] px-8 py-4 rounded-lg font-medium hover:bg-[#fc7f2b] hover:text-white transition-all duration-300 inline-flex items-center"
                >
                  Voir tous les événements
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
            </motion.div>
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
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-[#fc7f2b] text-[#fc7f2b] px-8 py-4 rounded-lg font-medium hover:bg-[#fc7f2b] hover:text-white transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => window.location.href = '/contact'}
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
                    <div className="text-gray-400">Les Hauts de Dillon</div>
                    <div className="text-gray-400">Résidence Capitole 3 - Bât 4</div>
                    <div className="text-gray-400">97200 Fort-de-France</div>
                    <div className="text-gray-500 text-sm">Martinique</div>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <Phone className="w-6 h-6 text-[#fc7f2b] mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-lg">Téléphone</div>
                    <div className="text-gray-400">0696 00 01 69</div>
                    <div className="text-gray-400">0696 61 36 03</div>
                    <div className="text-gray-500 text-sm">Accueil et renseignements</div>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <Mail className="w-6 h-6 text-[#fc7f2b] mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-lg">Email</div>
                    <div className="text-gray-400">associationdorothy@live.fr</div>
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
    </main>
  );
}
