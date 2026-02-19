'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Users, Baby, Heart, BookOpen, Calendar, Phone, Mail, MapPin, ArrowRight, Star, Award, Camera, Home, Shield, Lightbulb } from 'lucide-react';
import FallbackImage from '@/components/FallbackImage';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchEventsClient } from '@/lib/data';
import type { Event } from '@/types';

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export default function REEAPPage() {
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
          .filter((event: Event) => event.category === 'REEAP' && new Date(event.date) >= now)
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Erreur lors du chargement des événements REEAP:', error);
      } finally {
        setLoadingEvents(false);
      }
    }

    async function loadGalleryImages() {
      try {
        const response = await fetch('/api/gallery?category=reeap');
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
      title: "Groupes de parole",
      description: "Espaces d'échange et de partage d'expériences entre parents dans une ambiance bienveillante",
      color: "#37a599",
      iconBg: "🏠"
    },
    {
      icon: BookOpen,
      title: "Ateliers éducatifs",
      description: "Formation et information sur la parentalité et le développement de l'enfant",
      color: "#6271dd",
      iconBg: "📚"
    },
    {
      icon: Heart,
      title: "Accompagnement individuel",
      description: "Soutien personnalisé pour les familles en difficulté, écoute et conseils adaptés",
      color: "#fc7f2b",
      iconBg: "💝"
    },
    {
      icon: Baby,
      title: "Éveil et développement",
      description: "Activités d'éveil pour les tout-petits et conseils aux parents pour leur développement",
      color: "#8b5cf6",
      iconBg: "👶"
    }
  ];

  const activities = [
    {
      title: "Café des parents",
      description: "Rencontres conviviales autour d'un café pour échanger sur la parentalité et partager expériences",
      schedule: "Mercredi 9h30-11h30",
      age: "Parents avec enfants 0-6 ans",
      icon: "☕",
      participants: "15 familles max"
    },
    {
      title: "Ateliers massage bébé",
      description: "Apprentissage des techniques de massage pour renforcer le lien parent-enfant",
      schedule: "Vendredi 14h-15h30",
      age: "Bébés 2-12 mois",
      icon: "👐",
      participants: "8 bébés max"
    },
    {
      title: "Sorties familiales",
      description: "Découvertes culturelles et activités de plein air en famille, moments de partage",
      schedule: "Un samedi par mois",
      age: "Toute la famille",
      icon: "🌳",
      participants: "20 familles max"
    },
    {
      title: "Conférences thématiques",
      description: "Interventions d'experts sur des sujets liés à l'enfance et la parentalité",
      schedule: "Trimestriel",
      age: "Parents et futurs parents",
      icon: "🎤",
      participants: "30 personnes max"
    },
    {
      title: "Ateliers créatifs parents-enfants",
      description: "Activités manuelles et artistiques pour créer des liens forts en famille",
      schedule: "Mardi après-midi",
      age: "Enfants 3-8 ans",
      icon: "🎨",
      participants: "12 familles max"
    },
    {
      title: "Groupes de soutien",
      description: "Espaces d'écoute et de soutien pour les parents confrontés à des difficultés",
      schedule: "Sur rendez-vous",
      age: "Parents individuels",
      icon: "🤝",
      participants: "Individuel"
    }
  ];

  const testimonials = [
    {
      name: "Marie P.",
      age: 35,
      text: "Le REEAP m'a beaucoup aidée dans ma transition vers la parentalité. Les ateliers sont très enrichissants !",
      rating: 5
    },
    {
      name: "Jean-Luc M.",
      age: 42,
      text: "Un accompagnement professionnel et bienveillant. Mes enfants et moi avons trouvé notre équilibre.",
      rating: 5
    },
    {
      name: "Sophie L.",
      age: 28,
      text: "Les groupes de parole m'ont permis de me sentir moins seule dans mon rôle de mère célibataire.",
      rating: 5
    }
  ];

  const stats = [
    { number: "200+", label: "Familles accompagnées", icon: Home },
    { number: "15+", label: "Activités par mois", icon: Calendar },
    { number: "95%", label: "Satisfaction", icon: Star },
    { number: "8", label: "Années d'expérience", icon: Award }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header avec Navigation */}
      <Header />

      {/* Hero Section Améliorée */}
      <section className="relative py-32 bg-gradient-to-br from-[#37a599] to-[#6271dd] text-white overflow-hidden">
        {/* Pattern décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
              >
                👨‍👩‍👧‍👦 Programme REEAP Dorothy
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-extralight mb-6">
                Réseau d&apos;
                <span className="block font-light text-white">Écoute & Accompagnement</span>
              </h1>

              <div className="w-24 h-px bg-white/60 mb-8" />

              <p className="text-xl text-white/90 mb-8 font-light leading-relaxed">
                Accompagner les parents dans leur rôle éducatif avec bienveillance et professionnalisme.
                Ensemble, construisons des familles épanouies et solidaires.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ y: -3, boxShadow: "0 20px 40px rgba(55, 169, 153, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-[#37a599] px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Heart className="mr-3 w-5 h-5" />
                  S&apos;inscrire aux activités
                </motion.button>

                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-white/60 text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#37a599] transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Phone className="mr-3 w-5 h-5" />
                  Nous appeler
                </motion.button>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">200+</div>
                  <div className="text-sm text-white/80">Familles accompagnées</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">15+</div>
                  <div className="text-sm text-white/80">Activités/mois</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">95%</div>
                  <div className="text-sm text-white/80">Satisfaction</div>
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
                  src="/REEAP.jpg"
                  alt="REEAP Dorothy"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge flottant */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">👨‍👩‍👧‍👦</div>
                  <div className="text-sm font-medium text-gray-900">Programme REEAP</div>
                  <div className="text-xs text-gray-600">Depuis 2016</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section Améliorée */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Notre <span className="text-[#37a599] font-light">Mission</span>
            </h2>
            <div className="w-24 h-px bg-[#37a599] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Accompagner les parents dans leur fonction parentale avec bienveillance et professionnalisme
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#37a599] flex items-center justify-center mr-6">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900">Écoute & Bienveillance</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">
                    Nous proposons des espaces d&apos;échange sécurisants où les parents peuvent exprimer
                    leurs difficultés sans jugement, dans une ambiance de confiance mutuelle.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#6271dd] flex items-center justify-center mr-6">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900">Soutien & Accompagnement</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">
                    Notre équipe pluridisciplinaire apporte des réponses adaptées aux besoins spécifiques
                    de chaque famille, en valorisant leurs compétences parentales.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#fc7f2b] flex items-center justify-center mr-6">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900">Prévention & Éducation</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">
                    Nous développons des actions de prévention et proposons des formations pour renforcer
                    les compétences éducatives et favoriser l&apos;épanouissement familial.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-medium text-gray-900 mb-6 text-center">Nos Valeurs</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#37a599]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Solidarité</h4>
                      <p className="text-gray-600 text-sm font-light">
                        Nous croyons en la force des liens familiaux et communautaires
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#6271dd]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌟</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Excellence</h4>
                      <p className="text-gray-600 text-sm font-light">
                        Nous nous engageons à offrir un accompagnement de qualité professionnelle
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#fc7f2b]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💚</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Bienveillance</h4>
                      <p className="text-gray-600 text-sm font-light">
                        Notre approche est toujours empreinte d&apos;empathie et de respect
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Innovation</h4>
                      <p className="text-gray-600 text-sm font-light">
                        Nous adaptons constamment nos méthodes aux besoins évolutifs des familles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section Améliorée */}
      <section className="py-32 bg-white">
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
              Un accompagnement global pour soutenir les parents dans leur quotidien
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <div className="p-8">
                      <div className="text-center mb-8">
                        <div className="text-5xl mb-6">{service.iconBg}</div>
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 mx-auto"
                          style={{ backgroundColor: service.color }}
                        >
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
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

      {/* Activities Section Améliorée */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Nos <span className="text-[#37a599] font-light">Activités</span>
            </h2>
            <div className="w-24 h-px bg-[#37a599] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Un programme riche et varié pour accompagner chaque étape de la parentalité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4">{activity.icon}</div>
                      <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-[#37a599] transition-colors">
                        {activity.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 leading-relaxed font-light mb-6 text-center">
                      {activity.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-center text-[#37a599] font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.schedule}</span>
                      </div>
                      <div className="flex items-center justify-center text-[#6271dd] font-medium">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.age}</span>
                      </div>
                      <div className="flex items-center justify-center text-gray-600">
                        <Heart className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.participants}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements REEAP à venir */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Événements REEAP à venir
            </h2>
            <p className="text-lg text-gray-600">
              Les prochains rendez-vous dédiés au soutien à la parentalité et aux familles.
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center text-gray-500">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucun événement REEAP à venir pour le moment. Revenez bientôt !
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
                        <Calendar className="w-4 h-4 mr-2 text-[#37a599]" />
                        <span>
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-[#6271dd]" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-flex items-center text-xs font-medium text-[#37a599] bg-green-50 px-3 py-1 rounded-full">
                      REEAP
                    </span>
                    <Link
                      href="/evenements"
                      className="text-sm text-[#37a599] font-semibold hover:underline flex items-center"
                    >
                      Voir tous
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 mb-6">
              Galerie <span className="text-[#37a599] font-light">Photos</span>
            </h2>
            <div className="w-24 h-px bg-[#37a599] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Découvrez les moments de joie et de partage de nos activités familiales
            </p>
          </motion.div>

          {loadingGallery ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37a599] mx-auto"></div>
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
                        alt={image.title || 'Photo REEAP'}
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Témoignages
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que les parents disent de notre accompagnement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-900">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.age} ans</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Chiffres
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quelques statistiques sur notre impact et nos activités
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <stat.icon className="w-8 h-8 text-[#37a599] mr-4" />
                  <h3 className="text-2xl font-bold text-gray-900">{stat.number}</h3>
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact REEAP
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              N&apos;hésitez pas à nous contacter pour toute question ou pour participer à nos activités
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-[#37a599] p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <p className="text-gray-600">+596 596 12 34 56</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-[#6271dd] p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">reeap@dorothy-martinique.fr</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-[#fc7f2b] p-3 rounded-lg">
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
                className="inline-flex items-center bg-gradient-to-r from-[#37a599] to-[#6271dd] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
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