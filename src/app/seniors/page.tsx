'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Heart, Users, Calendar, MapPin, Phone, Mail, ArrowRight, Star, Award, Camera } from 'lucide-react';
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

export default function SeniorsPage() {
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
          .filter((event: Event) => event.category === 'SENIORS' && new Date(event.date) >= now)
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Erreur lors du chargement des événements seniors:', error);
      } finally {
        setLoadingEvents(false);
      }
    }

    async function loadGalleryImages() {
      try {
        const response = await fetch('/api/gallery?category=seniors');
        if (response.ok) {
          const images = await response.json();
          setGalleryImages(images.slice(0, 6)); // Limiter à 6 images
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
      title: "Ateliers bien-être",
      description: "Exercices adaptés, relaxation et maintien de la forme physique dans une ambiance conviviale",
      schedule: "Lundi et Mercredi 10h-11h30",
      icon: "🧘‍♀️",
      participants: "15 personnes max"
    },
    {
      title: "Café des seniors",
      description: "Moments de convivialité et d'échanges autour d'un café, jeux de société et discussions",
      schedule: "Mardi et Jeudi 14h-16h",
      icon: "☕",
      participants: "20 personnes max"
    },
    {
      title: "Sorties culturelles",
      description: "Visites guidées, spectacles et découvertes du patrimoine martiniquais",
      schedule: "Un vendredi par mois",
      icon: "🎭",
      participants: "12 personnes max"
    },
    {
      title: "Accompagnement administratif",
      description: "Aide aux démarches administratives et numériques, accompagnement personnalisé",
      schedule: "Sur rendez-vous",
      icon: "📋",
      participants: "Individuel"
    },
    {
      title: "Gymnastique douce",
      description: "Séances de gymnastique adaptée aux capacités de chacun, renforcement musculaire",
      schedule: "Vendredi 9h-10h",
      icon: "💪",
      participants: "10 personnes max"
    },
    {
      title: "Ateliers créatifs",
      description: "Peinture, poterie, bricolage et autres activités manuelles stimulantes",
      schedule: "Mercredi après-midi",
      icon: "🎨",
      participants: "8 personnes max"
    }
  ];

  const services = [
    {
      icon: Heart,
      title: "Accompagnement social",
      description: "Soutien personnalisé pour rompre l'isolement et maintenir le lien social",
      color: "#fc7f2b"
    },
    {
      icon: Users,
      title: "Activités collectives",
      description: "Animations et ateliers favorisant les échanges intergénérationnels",
      color: "#37a599"
    },
    {
      icon: Calendar,
      title: "Programmes réguliers",
      description: "Planning d'activités adapté aux besoins et aux envies de chacun",
      color: "#6271dd"
    }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      age: 72,
      text: "Les ateliers bien-être m'ont redonné goût à la vie. L'équipe est formidable !",
      rating: 5
    },
    {
      name: "Joseph M.",
      age: 68,
      text: "Le café des seniors est mon rendez-vous hebdomadaire préféré. Ambiance chaleureuse.",
      rating: 5
    },
    {
      name: "Lucie D.",
      age: 75,
      text: "Grâce à l'accompagnement administratif, je gère mieux mes papiers. Merci !",
      rating: 5
    }
  ];

  const stats = [
    { number: "150+", label: "Seniors accompagnés", icon: Users },
    { number: "25+", label: "Activités par mois", icon: Calendar },
    { number: "98%", label: "Satisfaction", icon: Star },
    { number: "5", label: "Années d'expérience", icon: Award }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header avec Navigation */}
      <Header />

      {/* Hero Section Améliorée */}
      <section className="relative py-32 bg-gradient-to-br from-[#fc7f2b] to-[#37a599] text-white overflow-hidden">
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
                🌸 Programme Seniors Dorothy
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-extralight mb-6">
                Bien-être &
                <span className="block font-light text-white">Épanouissement</span>
              </h1>

              <div className="w-24 h-px bg-white/60 mb-8" />

              <p className="text-xl text-white/90 mb-8 font-light leading-relaxed">
                Un accompagnement bienveillant pour nos aînés, avec des activités enrichissantes
                et du lien social au quotidien. Ensemble, créons des moments de joie et de partage.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ y: -3, boxShadow: "0 20px 40px rgba(252, 127, 43, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-[#fc7f2b] px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Heart className="mr-3 w-5 h-5" />
                  S&apos;inscrire aux activités
                </motion.button>

                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-white/60 text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#fc7f2b] transition-all duration-300 inline-flex items-center justify-center"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Phone className="mr-3 w-5 h-5" />
                  Nous appeler
                </motion.button>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">150+</div>
                  <div className="text-sm text-white/80">Seniors accompagnés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">25+</div>
                  <div className="text-sm text-white/80">Activités/mois</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light mb-1">98%</div>
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
                  src="/SENIOR.jpeg"
                  alt="Seniors Dorothy"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge flottant */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">🌸</div>
                  <div className="text-sm font-medium text-gray-900">Programme Seniors</div>
                  <div className="text-xs text-gray-600">Depuis 2019</div>
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
              Nos <span className="text-[#fc7f2b] font-light">Services</span>
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Des accompagnements personnalisés pour favoriser le bien-être et l&apos;autonomie
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
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
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 mx-auto"
                        style={{ backgroundColor: service.color }}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-[#fc7f2b] transition-colors text-center">
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
              Nos <span className="text-[#fc7f2b] font-light">Activités</span>
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Un programme riche et varié pour maintenir le lien social et le bien-être
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
                      <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-[#fc7f2b] transition-colors">
                        {activity.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 leading-relaxed font-light mb-6 text-center">
                      {activity.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-center text-[#fc7f2b] font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.schedule}</span>
                      </div>
                      <div className="flex items-center justify-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
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
              Galerie <span className="text-[#fc7f2b] font-light">Photos</span>
            </h2>
            <div className="w-24 h-px bg-[#fc7f2b] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Découvrez les moments de joie et de partage de nos activités seniors
            </p>
          </motion.div>

          {loadingGallery ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fc7f2b] mx-auto"></div>
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
                        alt={image.title || 'Photo Seniors'}
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
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Témoignages
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ce que nos seniors disent de nous
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
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">{testimonial.name}, {testimonial.age} ans</h3>
                </div>
                <p className="text-gray-600 mb-4">&quot;{testimonial.text}&quot;</p>
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

      {/* Stats Section */}
      <section className="py-16">
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
              Quelques statistiques sur notre accompagnement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
                  className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-gradient-to-r from-[#fc7f2b] to-[#37a599]">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Événements à venir pour les seniors */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Événements seniors à venir
            </h2>
            <p className="text-lg text-gray-600">
              Retrouvez ici les prochains événements dédiés au programme Seniors Dorothy.
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center text-gray-500">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucun événement seniors à venir pour le moment. Revenez bientôt !
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
                      Seniors
                    </span>
                    <Link
                      href="/evenements"
                      className="text-sm text-[#fc7f2b] font-semibold hover:underline flex items-center"
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

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Seniors
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pour plus d&apos;informations ou pour vous inscrire aux activités
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-8">
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
                  <p className="text-gray-600">seniors@dorothy-martinique.fr</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-[#6271dd] p-3 rounded-lg">
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
                className="inline-flex items-center bg-gradient-to-r from-[#fc7f2b] to-[#37a599] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
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