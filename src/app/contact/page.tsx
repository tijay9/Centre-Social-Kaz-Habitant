'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { apiFetch } from '@/lib/apiClient';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Règles locales alignées avec l'API (ne pas importer le fichier de config côté client)
  const LIMITS = {
    NAME_MIN: 2,
    NAME_MAX: 50,
    SUBJECT_MIN: 5,
    SUBJECT_MAX: 200,
    MESSAGE_MIN: 10,
    MESSAGE_MAX: 2000
  } as const;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const errs: Record<string, string> = {};
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (name.length < LIMITS.NAME_MIN || name.length > LIMITS.NAME_MAX) {
      errs.name = `Le nom doit contenir entre ${LIMITS.NAME_MIN} et ${LIMITS.NAME_MAX} caractères`;
    }
    if (!EMAIL_REGEX.test(email)) {
      errs.email = "Format d'email invalide";
    }
    if (subject.length < LIMITS.SUBJECT_MIN || subject.length > LIMITS.SUBJECT_MAX) {
      errs.subject = `Le sujet doit contenir entre ${LIMITS.SUBJECT_MIN} et ${LIMITS.SUBJECT_MAX} caractères`;
    }
    if (message.length < LIMITS.MESSAGE_MIN || message.length > LIMITS.MESSAGE_MAX) {
      errs.message = `Le message doit contenir entre ${LIMITS.MESSAGE_MIN} et ${LIMITS.MESSAGE_MAX} caractères`;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await apiFetch('/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      setSuccess('Votre message a été envoyé avec succès. Nous vous répondrons dans les meilleurs délais.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setFieldErrors({});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Impossible d'envoyer le message";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Bannière titre */}
        <section className="relative h-64 md:h-72 lg:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/SENIOR.jpeg"
              alt="Bannière Dorothy"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <div className="bg-white/95 rounded-2xl shadow-xl px-6 py-6 md:px-10 md:py-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Contactez-nous
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                Nous sommes là pour vous accompagner et répondre à toutes vos questions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Informations de contact */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Nos coordonnées
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    N&apos;hésitez pas à nous contacter pour toute information concernant nos services et activités.
                  </p>
                </div>

                {/* Informations de contact */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#fc7f2b] p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                      <p className="text-gray-600">
                        Centre Social Dorothy<br />
                        Les Hauts de Dillon<br />
                        Résidence Capitole 3 - Bât 4<br />
                        97200 Fort-de-France, Martinique
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#37a599] p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                      <p className="text-gray-600">
                        <a href="tel:0696000169" className="hover:text-[#fc7f2b] transition-colors">
                          0696 00 01 69
                        </a><br />
                        <a href="tel:0696613603" className="hover:text-[#fc7f2b] transition-colors">
                          0696 61 36 03
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#6271dd] p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:contact@dorothy-martinique.fr" className="hover:text-[#fc7f2b] transition-colors">
                        associationdorothy@live.fr
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Horaires */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-4">Horaires d&apos;ouverture</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Lundi</span>
                      <span>09h30 - 12h30 / 14h00 - 16h30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mardi</span>
                      <span>09h30 - 12h30 / 14h00 - 16h30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mercredi</span>
                      <span className="text-red-500">Fermé</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jeudi</span>
                      <span>09h00 - 12h00 / 14h00 - 16h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vendredi</span>
                      <span>09h30 - 13h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samedi</span>
                      <span>09h00 - 13h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche</span>
                      <span className="text-red-500">Fermé</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Formulaire de contact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Envoyez-nous un message
                </h2>

                {/* Alertes globales */}
                {success && (
                  <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                        disabled={submitting}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent transition-all ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                        placeholder="Votre nom"
                      />
                      {fieldErrors.name && (
                        <p id="name-error" className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                        disabled={submitting}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent transition-all ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                        placeholder="votre@email.com"
                      />
                      {fieldErrors.email && (
                        <p id="email-error" className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent transition-all"
                        placeholder="06 XX XX XX XX"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        aria-invalid={!!fieldErrors.subject}
                        aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                        disabled={submitting}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent transition-all ${fieldErrors.subject ? 'border-red-400' : 'border-gray-300'}`}
                        placeholder="Sujet de votre message"
                      />
                      {fieldErrors.subject && (
                        <p id="subject-error" className="mt-2 text-sm text-red-600">{fieldErrors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                      disabled={submitting}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent transition-all resize-none ${fieldErrors.message ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Votre message..."
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{formData.message.trim().length} / {LIMITS.MESSAGE_MAX} caractères</span>
                    </div>
                    {fieldErrors.message && (
                      <p id="message-error" className="mt-2 text-sm text-red-600">{fieldErrors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[#fc7f2b] to-[#37a599] text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Carte Google Maps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Comment nous trouver
              </h2>
              
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                {/* Placeholder pour la carte - remplacer par une vraie intégration Google Maps */}
                <div className="h-96 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Carte Google Maps</p>
                    <p className="text-sm">Centre Social Dorothy - Kaz&apos;Habitant</p>
                    <p className="text-sm mt-2">
                      <a 
                        href="https://maps.google.com/?q=Centre+Social+Dorothy+Martinique" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#fc7f2b] hover:underline"
                      >
                        Voir sur Google Maps
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}