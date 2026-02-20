'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Baby, Users, Heart, Smile, Calendar, Phone, Mail, MapPin, Clock, Star, Camera } from 'lucide-react';
import FallbackImage from '@/components/FallbackImage';
import { fetchEventsClient } from '@/lib/data';
import type { Event } from '@/types';
import { apiFetch } from '@/lib/apiClient';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export default function TiLudoPage() {
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
          .filter((event: Event) => event.category === 'LAEP' && new Date(event.date) >= now)
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Erreur lors du chargement des événements LAEP:', error);
      } finally {
        setLoadingEvents(false);
      }
    }

    async function loadGalleryImages() {
      try {
        const images = await apiFetch<any[]>('/gallery');
        const filtered = (Array.isArray(images) ? images : []).filter((img) => (img.category || '').toUpperCase() === 'LAEP');
        setGalleryImages(filtered.slice(0, 6));
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
      icon: Baby,
      title: "Accueil libre",
      description:
        "Espace d'accueil sans inscription préalable pour les enfants et leurs parents dans un cadre sécurisé et chaleureux",
      color: '#fc7f2b',
    },
    {
      icon: Users,
      title: 'Rencontres parents',
      description:
        "Moments d'échange et de partage entre parents autour de l'éducation et du développement des tout-petits",
      color: '#37a599',
    },
    {
      icon: Heart,
      title: 'Accompagnement familial',
      description:
        'Soutien aux familles dans leur quotidien et valorisation des compétences parentales',
      color: '#6271dd',
    },
    {
      icon: Smile,
      title: "Activités d'éveil",
      description:
        "Jeux et activités adaptés au développement de chaque enfant pour favoriser l'autonomie et la créativité",
      color: '#f59e0b',
    },
  ];

  const activities = [
    {
      title: 'Jeux libres',
      description:
        "Espace de jeux variés pour favoriser l'autonomie, la socialisation et la créativité",
      age: '0-4 ans',
      schedule: "Tous les jours d'ouverture",
      icon: '🎲',
    },
    {
      title: 'Lectures contées',
      description:
        "Histoires et contes pour développer l'imaginaire, le langage et le plaisir de lire",
      age: '1-4 ans',
      schedule: 'Mardi et Jeudi 10h30',
      icon: '📚',
    },
    {
      title: 'Ateliers créatifs',
      description:
        'Activités manuelles et artistiques adaptées aux tout-petits pour explorer les sens',
      age: '2-4 ans',
      schedule: 'Mercredi 10h-11h',
      icon: '🎨',
    },
    {
      title: 'Motricité libre',
      description:
        'Parcours et jeux pour développer la motricité globale et la confiance en soi',
      age: '6 mois-3 ans',
      schedule: 'Vendredi 9h30-10h30',
      icon: '🤸‍♀️',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah, maman de Léo',
      text: "Ti-Ludo est devenu notre rendez-vous hebdomadaire. Mon fils s'épanouit et j'échange avec d'autres parents.",
      rating: 5,
    },
    {
      name: 'David, papa de Maya',
      text: "L'équipe est bienveillante et à l'écoute. On se sent vraiment accompagnés dans notre rôle de parents.",
      rating: 5,
    },
    {
      name: 'Anaïs, maman de jumeaux',
      text: "Un lieu chaleureux où mes enfants peuvent jouer en toute sécurité et où je ne me sens pas jugée.",
      rating: 5,
    },
  ];

  const infos = [
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lundi à Vendredi : 9h00 - 12h00 et 14h00 - 17h00',
    },
    {
      icon: Users,
      title: 'Public',
      content: "Enfants de 0 à 4 ans accompagnés d'un parent ou adulte référent",
    },
    {
      icon: Heart,
      title: 'Accès',
      content: 'Gratuit - Aucune inscription nécessaire, anonymat respecté',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section style Seniors / REEAP */}
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
                👶 LAEP Ti-Ludo - Lieu d&apos;Accueil Enfants Parents
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-extralight mb-6">
                Grandir &amp;
                <span className="block font-light text-white">S&apos;éveiller ensemble</span>
              </h1>

              <div className="w-24 h-px bg-white/60 mb-8" />

              <p className="text-xl text-white/90 mb-8 font-light leading-relaxed">
                Un espace de jeu, de rencontre et d&apos;éveil pour les tout-petits et leurs familles.
                Un lieu de transition entre la maison et les premiers lieux collectifs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(252, 127, 43, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-[#fc7f2b] px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => (window.location.href = '/contact')}
                >
                  <Baby className="mr-3 w-5 h-5" />
                  Venir au Ti-Ludo
                </motion.button>

                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-white/60 text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#37a599] transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => (window.location.href = '/contact')}
                >
                  <Phone className="mr-3 w-5 h-5" />
                  Nous appeler
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">0-4</div>
                  <div className="text-sm text-white/80">Âge des enfants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">100%</div>
                  <div className="text-sm text-white/80">Accueil gratuit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">2</div>
                  <div className="text-sm text-white/80">Professionnels à l&apos;écoute</div>
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
                  src="/laep.jpg"
                  alt="Ti-Ludo - Lieu d'accueil enfants parents"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">👶</div>
                  <div className="text-sm font-medium text-gray-900">LAEP Ti-Ludo</div>
                  <div className="text-xs text-gray-600">Accueil parents-enfants</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission / Infos pratiques */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Un <span className="text-[#fc7f2b] font-light">Espace</span> pour grandir ensemble
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Ti-Ludo est un lieu d&apos;accueil convivial où les enfants de 0 à 4 ans peuvent jouer,
              découvrir et s&apos;épanouir en présence de leurs parents ou d&apos;un adulte familier.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Notre philosophie</h3>
                  <p className="text-gray-600 leading-relaxed font-light mb-4">
                    Nos professionnels accompagnent les familles dans la découverte des capacités de
                    leur enfant et favorisent les échanges entre parents autour de l&apos;éducation et du
                    développement des tout-petits.
                  </p>
                  <p className="text-gray-600 leading-relaxed font-light">
                    Le LAEP est un lieu anonyme, sans inscription, où chacun peut venir à son rythme,
                    rencontrer d&apos;autres familles et partager des moments privilégiés avec son enfant.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              {infos.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div
                    key={info.title}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-start gap-4"
                  >
                    <div className="bg-gradient-to-br from-[#fc7f2b] via-[#37a599] to-[#6271dd] w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{info.content}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section style Seniors/REEAP */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Nos <span className="text-[#37a599] font-light">Services</span>
            </h2>
            <div className="w-24 h-px bg-[#37a599] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Un accompagnement bienveillant pour favoriser l&apos;épanouissement de chaque enfant et de sa famille
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col">
                    <div className="p-8 flex-1 flex flex-col">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 mx-auto"
                        style={{ backgroundColor: service.color }}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-[#37a599] transition-colors text-center">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed font-light text-center">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities Section style Seniors/REEAP */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
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
              Des temps de jeu et de découverte adaptés aux besoins des tout-petits et de leurs parents
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col">
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4">{activity.icon}</div>
                      <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-[#fc7f2b] transition-colors">
                        {activity.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-light mb-6 text-center">
                      {activity.description}
                    </p>
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-center text-[#37a599] font-medium">
                        <Baby className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.age}</span>
                      </div>
                      <div className="flex items-center justify-center text-[#fc7f2b] font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.schedule}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements LAEP / Ti-Ludo à venir */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Événements Ti-Ludo à venir
            </h2>
            <p className="text-lg text-gray-600">
              Les prochains temps de jeu, d&apos;éveil et de partage au LAEP Ti-Ludo.
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center text-gray-500">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucun événement Ti-Ludo à venir pour le moment. Revenez bientôt !
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
                      className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-[#fc7f2b]"
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
                      Ti-Ludo
                    </span>
                    <Link
                      href="/evenements"
                      className="text-sm text-[#fc7f2b] font-semibold hover:underline flex items-center"
                    >
                      Voir tous
                    </Link>
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
              Quelques moments de jeu, de complicité et de découverte au Ti-Ludo
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
                        alt={image.title || 'Photo Ti-Ludo'}
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

      {/* Testimonials Section alignée avec Seniors/REEAP */}
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
              Ce que les familles disent de leur expérience au LAEP Ti-Ludo
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

      {/* Contact Section harmonisée */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Ti-Ludo</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Venez nous rendre visite avec votre enfant, l&apos;accueil est libre et gratuit
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg p-8 w-full">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#fc7f2b] p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Téléphone</h3>
                    <p className="text-gray-600">+596 596 12 34 56</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#37a599] p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">tiludo@dorothy-martinique.fr</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#6271dd] p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lieu</h3>
                    <p className="text-gray-600">Centre Social Dorothy - Kaz&apos;Habitant</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a
                  href="/contact"
                  className="inline-flex items-center bg-gradient-to-r from-[#fc7f2b] via-[#37a599] to-[#6271dd] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Nous contacter
                </a>
              </div>
            </div>

            {/* Formulaire d'intérêt LAEP conservé */}
            <LAEPInterestForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function LAEPInterestForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await apiFetch('/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: "LAEP - Ti-Ludo: Demande d'information / inscription",
          message: form.message || 'Je souhaite des informations sur le LAEP (Ti-Ludo).',
        }),
      });

      setSuccess('Votre demande a bien été envoyée. Nous vous recontacterons rapidement.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Impossible d'envoyer votre demande.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-lg w-full">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Intéressé·e par le LAEP ?</h3>
      <p className="text-gray-600 mb-6">Envoyez-nous vos coordonnées et nous vous contacterons.</p>

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">{success}</div>
      )}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#37a599]"
            placeholder="Votre nom"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#37a599]"
              placeholder="nom@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#37a599]"
              placeholder="Votre numéro"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#37a599]"
            placeholder="Votre message..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center bg-gradient-to-r from-[#37a599] to-[#6271dd] text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all disabled:opacity-60"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>
      </form>
    </div>
  );
}