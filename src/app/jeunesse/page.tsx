'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import {
  Users,
  Zap,
  Target,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Trophy,
  Star,
  Camera,
} from 'lucide-react';
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

export default function JeunessePage() {
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
          .filter((event: Event) => event.category === 'JEUNESSE' && new Date(event.date) >= now)
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Erreur lors du chargement des événements jeunesse:', error);
      } finally {
        setLoadingEvents(false);
      }
    }

    async function loadGalleryImages() {
      try {
        const response = await fetch('/api/gallery?category=jeunesse');
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

  const services = [
    {
      icon: Users,
      title: 'Accompagnement social',
      description:
        "Soutien individualisé et aide à l'insertion sociale et professionnelle des jeunes",
      color: '#6271dd',
    },
    {
      icon: BookOpen,
      title: 'Aide aux devoirs',
      description: 'Soutien scolaire et accompagnement éducatif personnalisé',
      color: '#37a599',
    },
    {
      icon: Target,
      title: 'Orientation & projets',
      description:
        "Aide à l'orientation, construction de projet professionnel et accompagnement dans les démarches",
      color: '#fc7f2b',
    },
    {
      icon: Trophy,
      title: 'Activités sportives et loisirs',
      description: 'Pratique sportive, activités de cohésion et sorties culturelles',
      color: '#f59e0b',
    },
  ];

  const activities = [
    {
      title: 'Point Information Jeunesse',
      description:
        "Information et accompagnement sur l'emploi, la formation, les loisirs, la santé",
      age: '16-25 ans',
      schedule: 'Lundi à Vendredi 14h-17h',
      icon: 'ℹ️',
    },
    {
      title: 'Ateliers de remobilisation',
      description:
        "Activités pour reprendre confiance, identifier ses compétences et définir un projet professionnel",
      age: '18-25 ans',
      schedule: 'Mardi et Jeudi 9h-12h',
      icon: '🎯',
    },
    {
      title: 'Club de loisirs',
      description:
        'Activités ludiques, sorties culturelles et sportives en groupe pour créer du lien',
      age: '12-17 ans',
      schedule: 'Mercredi 14h-17h et Samedi 9h-12h',
      icon: '🎉',
    },
    {
      title: 'Permanence emploi',
      description:
        "Aide à la recherche d'emploi, rédaction de CV et préparation d'entretiens",
      age: '16-25 ans',
      schedule: 'Vendredi 9h-12h sur RDV',
      icon: '💼',
    },
  ];

  const programmes = [
    {
      title: 'Garantie Jeunes',
      description: "Accompagnement intensif vers l'emploi avec allocation pour les jeunes en difficulté",
      color: 'from-[#fc7f2b] to-orange-600',
    },
    {
      title: 'Service Civique',
      description: 'Information et accompagnement vers les missions de service civique',
      color: 'from-[#37a599] to-teal-600',
    },
    {
      title: 'Chantiers Jeunes',
      description:
        'Projets collectifs rémunérés pour découvrir le monde du travail et développer des compétences',
      color: 'from-[#6271dd] to-blue-600',
    },
  ];

  const testimonials = [
    {
      name: 'Kevin, 22 ans',
      text: "Grâce à l'accompagnement, j'ai pu reprendre confiance et trouver une formation qui me correspond.",
      rating: 5,
    },
    {
      name: 'Inès, 18 ans',
      text: "Les ateliers et le soutien de l'équipe m'ont aidée à clarifier mon projet professionnel.",
      rating: 5,
    },
    {
      name: 'Lucas, 16 ans',
      text: "Le club de loisirs m'a permis de rencontrer d'autres jeunes et de sortir de l'isolement.",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section style Seniors/REEAP */}
      <section className="relative py-32 bg-gradient-to-br from-[#6271dd] via-[#37a599] to-[#fc7f2b] text-white overflow-hidden">
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
                👥 Programme Jeunesse Dorothy
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-extralight mb-6">
                Espace
                <span className="block font-light text-white">Jeunesse 12-25 ans</span>
              </h1>

              <div className="w-24 h-px bg-white/60 mb-8" />

              <p className="text-xl text-white/90 mb-8 font-light leading-relaxed">
                Accompagnement, formation et insertion pour les jeunes de 12 à 25 ans.
                Un lieu pour construire son avenir, être écouté et valoriser ses talents.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(98, 113, 221, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-[#6271dd] px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => (window.location.href = '/contact')}
                >
                  <Zap className="mr-3 w-5 h-5" />
                  Prendre rendez-vous
                </motion.button>

                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-white/60 text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#fc7f2b] transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => (window.location.href = '/contact')}
                >
                  <Phone className="mr-3 w-5 h-5" />
                  Nous appeler
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">12-25</div>
                  <div className="text-sm text-white/80">Âge des jeunes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">4</div>
                  <div className="text-sm text-white/80">Axes d&apos;accompagnement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">100%</div>
                  <div className="text-sm text-white/80">Écoute bienveillante</div>
                </div>
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
                  src="/jeunesse.jpg"
                  alt="Jeunes accompagnés par Dorothy"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-sm font-medium text-gray-900">Espace Jeunesse</div>
                  <div className="text-xs text-gray-600">Insertion &amp; projets</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Notre <span className="text-[#6271dd] font-light">Mission</span>
            </h2>
            <div className="w-24 h-px bg-[#6271dd] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Accompagner les jeunes dans leur parcours d&apos;insertion sociale et professionnelle,
              en prenant en compte toutes les dimensions de leur vie.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Une approche globale</h3>
                <p className="text-gray-600 leading-relaxed font-light mb-4">
                  L&apos;Espace Jeunesse accompagne les jeunes dans leur parcours d&apos;insertion sociale et
                  professionnelle. Nous proposons un accompagnement personnalisé pour favoriser
                  l&apos;autonomie et la réalisation des projets de vie.
                </p>
                <p className="text-gray-600 leading-relaxed font-light">
                  Notre équipe tient compte des difficultés sociales, éducatives et professionnelles
                  pour proposer des réponses adaptées à chaque situation.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-medium text-gray-900 mb-6 text-center">Programmes d&apos;insertion</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {programmes.map((programme) => (
                    <div
                      key={programme.title}
                      className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center"
                    >
                      <div className={`bg-gradient-to-r ${programme.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {programme.title}
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {programme.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Nos <span className="text-[#6271dd] font-light">Services</span>
            </h2>
            <div className="w-24 h-px bg-[#6271dd] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Un accompagnement sur mesure pour chaque jeune selon ses besoins et ses objectifs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: service.color }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Nos <span className="text-[#fc7f2b] font-light">Activités</span>
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Un programme varié pour répondre aux besoins de chaque tranche d&apos;âge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">{activity.icon}</span>
                  {activity.title}
                </h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-[#6271dd] font-medium text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {activity.age}
                  </div>
                  <div className="flex items-center text-[#fc7f2b] font-medium text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {activity.schedule}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements Jeunesse à venir */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Événements Jeunesse à venir
            </h2>
            <p className="text-lg text-gray-600">
              Les prochains temps forts pour les jeunes accompagnés par Dorothy.
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center text-gray-500">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucun événement jeunesse à venir pour le moment. Revenez bientôt !
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
                      className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-[#6271dd]"
                      onClick={() => (window.location.href = `/evenements/${event.id}`)}
                    >
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-[#6271dd]" />
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
                    <span className="inline-flex items-center text-xs font-medium text-[#6271dd] bg-indigo-50 px-3 py-1 rounded-full">
                      Jeunesse
                    </span>
                    <a
                      href="/evenements"
                      className="text-sm text-[#6271dd] font-semibold hover:underline flex items-center"
                    >
                      Voir tous
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section harmonisée */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
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
              Des instants de partage, de réussite et de convivialité avec les jeunes
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                        alt={image.title || 'Photo Jeunesse'}
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

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Témoignages</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ce que les jeunes disent de leur accompagnement à Dorothy
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
                  <div className="w-10 h-10 rounded-full bg-[#6271dd]/10 flex items-center justify-center text-sm font-semibold text-[#6271dd]">
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

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Jeunesse</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Contactez-nous pour plus d&apos;informations ou pour prendre rendez-vous avec un référent jeunesse
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg p-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-[#6271dd] p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <p className="text-gray-600">+596 596 12 34 56</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-[#fc7f2b] p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">jeunesse@dorothy-martinique.fr</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-[#37a599] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Accueil</h3>
                  <p className="text-gray-600">Centre Social Dorothy - Kaz&apos;Habitant</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-[#6271dd] to-[#fc7f2b] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}