'use client';

import { motion } from 'framer-motion';
import {
  Scale,
  FileText,
  Users,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { fetchEventsClient } from '@/lib/data';
import type { Event } from '@/types';

export default function AccesDroitsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const allEvents = await fetchEventsClient();
        const now = new Date();
        const upcoming = allEvents
          .filter((event: Event) => event.category === 'ACCES_DROITS' && new Date(event.date) >= now)
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Erreur lors du chargement des événements Accès aux droits:', error);
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, []);

  const services = [
    {
      title: "Aide aux Démarches Administratives",
      description: "Accompagnement pour vos démarches avec les administrations",
      icon: <FileText className="h-8 w-8 text-[#fc7f2b]" />,
      color: "bg-orange-50",
      details: [
        "Dossiers CAF, Pôle emploi, CPAM",
        "Demandes d'aides sociales",
        "Constitution de dossiers",
        "Aide à la rédaction"
      ]
    },
    {
      title: "Information Juridique",
      description: "Informations et orientation en matière de droits",
      icon: <Scale className="h-8 w-8 text-[#6271dd]" />,
      color: "bg-blue-50",
      details: [
        "Droit du travail",
        "Droit de la famille",
        "Droit au logement",
        "Orientation vers des professionnels"
      ]
    },
    {
      title: "Accompagnement Social",
      description: "Soutien personnalisé dans vos démarches",
      icon: <Users className="h-8 w-8 text-[#37a599]" />,
      color: "bg-green-50",
      details: [
        "Écoute et conseil",
        "Médiation sociale",
        "Accompagnement individualisé",
        "Soutien moral"
      ]
    }
  ];

  const horaires = [
    { jour: "Lundi", heures: "14h00 - 17h00" },
    { jour: "Mardi", heures: "9h00 - 12h00" },
    { jour: "Mercredi", heures: "14h00 - 17h00" },
    { jour: "Jeudi", heures: "9h00 - 12h00" },
    { jour: "Vendredi", heures: "14h00 - 16h00" }
  ];

  const domaines = [
    "Droits sociaux et prestations",
    "Logement et habitat",
    "Emploi et formation",
    "Santé et protection sociale",
    "Famille et enfance",
    "Étrangers et citoyenneté",
    "Consommation et surendettement",
    "Vie quotidienne"
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      {/* Hero Section avec pattern harmonisé */}
      <section className="relative py-32 bg-gradient-to-br from-[#6271dd] to-[#37a599] text-white overflow-hidden">
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
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Accès aux Droits
            </h1>
            <p className="text-2xl md:text-3xl mb-8 leading-relaxed">
              Un accompagnement gratuit et personnalisé pour vous aider dans vos démarches administratives et vos droits
            </p>
            <div className="flex items-center justify-center text-lg">
              <MapPin className="h-6 w-6 mr-2" />
              <span>Centre Social Dorothy - Martinique</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Notre Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Le service Accès aux Droits accueille, informe et oriente toute personne ayant besoin d&apos;aide pour faire valoir ses droits et réaliser ses démarches administratives en toute sérénité.
            </p>
          </motion.div>

          {/* Services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.details.map((d) => (
                    <li key={d} className="flex items-start text-gray-700">
                      <CheckCircle className="h-6 w-6 text-[#37a599] mr-3 mt-0.5 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infos pratiques */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Horaires */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-[#6271dd] mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Horaires d&apos;accueil</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {horaires.map((h) => (
                  <li key={h.jour} className="flex items-center justify-between py-4">
                    <span className="text-gray-700 font-medium">{h.jour}</span>
                    <span className="text-gray-600">{h.heures}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <Phone className="h-6 w-6 text-[#fc7f2b] mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Contact Accès aux Droits</h3>
              </div>
              <p className="text-gray-700 mb-6">Accueil au Centre Social Dorothy - Kaz&apos;Habitant</p>
              <div className="flex items-center text-gray-800 font-semibold">
                <Phone className="h-5 w-5 text-[#37a599] mr-3" />
                <span>+596 596 12 34 56</span>
              </div>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-flex items-center bg-gradient-to-r from-[#6271dd] to-[#37a599] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Prendre rendez-vous
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Domaines d'intervention */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Domaines d&apos;intervention
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous intervenons sur un large éventail de thématiques pour vous informer, vous orienter et vous accompagner.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {domaines.map((d, i) => (
              <motion.div
                key={d}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="bg-white rounded-lg shadow p-6 flex items-start"
              >
                <CheckCircle className="h-6 w-6 text-[#37a599] mr-4 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{d}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements Accès aux droits à venir */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Événements "Accès aux droits" à venir
            </h2>
            <p className="text-lg text-gray-600">
              Rencontres d&apos;information, permanences spéciales et ateliers thématiques.
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center text-gray-500">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucun événement Accès aux droits à venir pour le moment. Revenez bientôt !
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
                    <span className="inline-flex items-center text-xs font-medium text-[#6271dd] bg-blue-50 px-3 py-1 rounded-full">
                      Accès aux droits
                    </span>
                    <a
                      href="/evenements"
                      className="text-sm text-[#6271dd] font-semibold hover:underline flex items-center"
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

      {/* Call to Action */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-gradient-to-r from-[#fc7f2b] to-[#6271dd] rounded-2xl p-12 md:p-16 text-white shadow-xl">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Besoin d&apos;aide dans vos démarches ?</h3>
                <p className="text-white/90 text-lg">Nos médiateurs vous accompagnent gratuitement et en toute confidentialité.</p>
              </div>
              <a
                href="/contact"
                className="mt-8 md:mt-0 inline-flex items-center bg-white text-gray-900 font-semibold px-8 py-4 rounded-lg shadow hover:shadow-lg transition"
              >
                Contactez-nous
                <ArrowRight className="ml-3 h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}