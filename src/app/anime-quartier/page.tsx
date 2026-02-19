'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Megaphone,
  Smile,
  Camera,
} from 'lucide-react';
import Header from '@/components/Header';
import FallbackImage from '@/components/FallbackImage';
import { useEffect, useState } from 'react';
import { fetchEventsClient } from '@/lib/data';
import type { Event } from '@/types';

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export default function AnimeQuartierPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const allEvents = await fetchEventsClient();
        const now = new Date();
        const upcoming = allEvents
          .filter((event: Event) => event.category === 'ANIME_QUARTIER' && new Date(event.date) >= now)
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Erreur lors du chargement des événements Anime ton Quartier:', error);
      } finally {
        setLoadingEvents(false);
      }
    }

    async function loadGalleryImages() {
      try {
        const response = await fetch('/api/gallery?category=anime_quartier');
        if (response.ok) {
          const images = await response.json();
          setGalleryImages(images.slice(0, 6));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
      } finally {
        setLoadingGallery(false);
      }
    }

    loadEvents();
    loadGalleryImages();
  }, []);

  const activities = [
    {
      title: 'Fêtes de Quartier',
      description: "Organisation d'événements festifs pour rassembler les habitants",
      icon: '🎉',
      color: '#fc7f2b',
      schedule: 'Plusieurs fois par an',
    },
    {
      title: 'Animations Culturelles',
      description: 'Spectacles, concerts et activités artistiques dans le quartier',
      icon: '🎭',
      color: '#6271dd',
      schedule: 'Selon programmation',
    },
    {
      title: 'Rencontres Intergénérationnelles',
      description: 'Créer du lien entre les différentes générations du quartier',
      icon: '🤝',
      color: '#37a599',
      schedule: 'Tout au long de l’année',
    },
    {
      title: 'Actions Solidaires',
      description: 'Projets collaboratifs pour améliorer la vie de quartier',
      icon: '💡',
      color: '#f59e0b',
      schedule: 'Selon projets',
    },
  ];

  const objectives = [
    "Favoriser les rencontres et les échanges entre habitants",
    'Dynamiser la vie sociale du quartier',
    "Créer du lien social et lutter contre l'isolement",
    'Valoriser les talents et initiatives locales',
    "Développer l'entraide et la solidarité de proximité",
  ];

  const testimonials = [
    {
      name: 'Claudine, habitante',
      text: "Les animations organisées dans le quartier nous permettent de nous retrouver et de mieux nous connaître.",
      rating: 5,
    },
    {
      name: 'Yannis, jeune bénévole',
      text: "Participer à l'organisation des fêtes de quartier m'a donné envie de m'engager davantage.",
      rating: 5,
    },
    {
      name: 'Mme Pierre, commerçante',
      text: "Les actions solidaires dynamisent le quartier et profitent à tout le monde.",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section style Seniors/REEAP */}
      <section className="relative py-32 bg-gradient-to-br from-[#fc7f2b] via-[#37a599] to-[#6271dd] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
              >
                📣 Programme "Anime ton Quartier"
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-extralight mb-6">
                Anime ton
                <span className="block font-light text-white">Quartier</span>
              </h1>

              <div className="w-24 h-px bg-white/60 mb-8" />

              <p className="text-xl text-white/90 mb-8 font-light leading-relaxed">
                Ensemble, créons une dynamique positive dans notre quartier pour renforcer les liens
                sociaux, la convivialité et la solidarité entre habitants.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(252, 127, 43, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-[#fc7f2b] px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => (window.location.href = '/contact')}
                >
                  <Megaphone className="mr-3 w-5 h-5" />
                  Proposer une idée
                </motion.button>

                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-white/60 text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#37a599] transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => (window.location.href = '/contact')}
                >
                  <Users className="mr-3 w-5 h-5" />
                  Devenir bénévole
                </motion.button>
              </div>

              <div className="flex items-center text-lg">
                <MapPin className="h-6 w-6 mr-2" />
                <span>Centre Social Dorothy - Martinique</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="relative h-96 bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20">
                <FallbackImage
                  src="/animetonquartier.jpeg"
                  alt="Animation de quartier avec les habitants"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">🤝</div>
                  <div className="text-sm font-medium text-gray-900">Vie de quartier</div>
                  <div className="text-xs text-gray-600">Animations participatives</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Présentation / Objectifs */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Notre <span className="text-[#fc7f2b] font-light">Mission</span>
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              "Anime ton Quartier" est une initiative du Centre Social Dorothy pour co-construire avec
              les habitants des actions qui font vivre le quartier.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nos Objectifs</h3>
              <ul className="space-y-4">
                {objectives.map((objective, index) => (
                  <motion.li
                    key={objective}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <ArrowRight className="h-5 w-5 text-[#fc7f2b] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gray-50 p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Comment participer ?</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-[#fc7f2b] pl-4">
                  <h4 className="font-semibold text-gray-900">Rejoindre les animations</h4>
                  <p className="text-gray-600 text-sm">
                    Participez aux événements organisés dans votre quartier, seul, en famille ou entre amis.
                  </p>
                </div>
                <div className="border-l-4 border-[#37a599] pl-4">
                  <h4 className="font-semibold text-gray-900">Proposer des idées</h4>
                  <p className="text-gray-600 text-sm">
                    Partagez vos envies, projets et talents pour imaginer de nouvelles animations.
                  </p>
                </div>
                <div className="border-l-4 border-[#6271dd] pl-4">
                  <h4 className="font-semibold text-gray-900">S&apos;engager comme bénévole</h4>
                  <p className="text-gray-600 text-sm">
                    Rejoignez l&apos;équipe de bénévoles pour participer à l&apos;organisation des actions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activités */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Nos <span className="text-[#37a599] font-light">Animations</span>
            </h2>
            <div className="w-24 h-px bg-[#37a599] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Découvrez les différentes animations que nous organisons pour dynamiser la vie de quartier
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: activity.color + '20' }}
                >
                  <span className="text-2xl">{activity.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                <p className="text-gray-600 mb-3">{activity.description}</p>
                <div className="flex items-center text-sm text-[#fc7f2b] font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  {activity.schedule}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements "Anime ton Quartier" à venir */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Événements "Anime ton Quartier" à venir
            </h2>
            <p className="text-lg text-gray-600">
              Les prochains temps forts organisés dans les quartiers avec les habitants.
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center text-gray-500">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucun événement "Anime ton Quartier" à venir pour le moment. Revenez bientôt !
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-[#fc7f2b]"
                      onClick={() => (window.location.href = `/evenements/${event.id}`)}
                    >
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-[#fc7f2b]" />
                        <span>
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-[#37a599]" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-flex items-center text-xs font-medium text-[#fc7f2b] bg-orange-50 px-3 py-1 rounded-full">
                      Anime ton Quartier
                    </span>
                    <a
                      href="/evenements"
                      className="text-sm text-[#fc7f2b] font-semibold hover:underline flex items-center"
                    >
                      Voir tous
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Galerie */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Galerie <span className="text-[#6271dd] font-light">Photos</span>
            </h2>
            <div className="w-24 h-px bg-[#6271dd] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Quelques images des temps forts organisés dans le quartier avec les habitants
            </p>
          </motion.div>

          {loadingGallery ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6271dd] mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de la galerie...</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune photo disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <FallbackImage
                        src={image.url}
                        alt={image.title || 'Photo Anime ton Quartier'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {image.title && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                            <h3 className="text-sm font-medium text-gray-900">{image.title}</h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Témoignages</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ce que les habitants disent du programme "Anime ton Quartier"
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#fc7f2b]/10 flex items-center justify-center text-sm font-semibold text-[#fc7f2b]">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-semibold text-gray-900">{testimonial.name}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">“{testimonial.text}”</p>
                <div className="flex items-center">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#fc7f2b] to-[#37a599]">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Envie de participer à la vie de votre quartier ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez notre équipe de bénévoles ou proposez vos idées pour imaginer ensemble les
              prochaines animations.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-white text-[#fc7f2b] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Nous contacter
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}