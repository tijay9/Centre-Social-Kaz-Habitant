"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import FallbackImage from "@/components/FallbackImage";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Image from 'next/image';

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string | Date;
  location?: string | null;
  imageUrl?: string | null;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    email: "",
  });
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          throw new Error("Impossible de charger cet événement");
        }
        const data = await res.json();
        const e = data.event as any;
        setEvent({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          location: e.location,
          imageUrl: e.imageUrl,
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEvent();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMessage("Merci de remplir au minimum le prénom, le nom et l'email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.age ? `${formData.age} ans` : "Non renseigné",
          message: formData.address || undefined,
          eventId: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Une erreur s'est produite lors de l'inscription.");
        return;
      }

      setSuccessMessage(
        "✅ Inscription enregistrée ! Un email de confirmation vous a été envoyé. " +
        "Veuillez vérifier votre boîte mail (et les spams) et cliquer sur le lien pour confirmer votre inscription."
      );
      setFormData({ firstName: "", lastName: "", age: "", address: "", email: "" });
    } catch (err) {
      setErrorMessage("Impossible d'envoyer votre inscription pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (value: string | Date | undefined) => {
    if (!value) return "";
    const d = typeof value === "string" ? new Date(value) : value;
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto" />
            <p className="mt-4 text-gray-600">Chargement de l’événement...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Événement introuvable</h1>
          <p className="text-gray-600">Cet événement n’existe pas ou n’est plus disponible.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <FallbackImage
          src={event.imageUrl || "/SENIOR.jpeg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8 max-w-5xl">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="inline-flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(event.date)}
              </span>
              {event.location && (
                <span className="inline-flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.imageUrl && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Illustration de l’événement</h3>
                <button
                  type="button"
                  onClick={() => setImageOpen(true)}
                  className="block rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover"
                  />
                </button>
                <p className="mt-1 text-xs text-gray-500">Cliquez sur l’image pour l’agrandir.</p>
              </div>
            )}
          </div>

          <div className="md:col-span-1 flex justify-end">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm md:p-7 lg:p-8 self-start">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                S’inscrire à cet événement
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Merci de renseigner vos informations pour finaliser votre inscription.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc7f2b]"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc7f2b]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Âge</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc7f2b]"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc7f2b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc7f2b]"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    ⚠️ {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-gradient-to-r from-[#fc7f2b] to-[#37a599] text-white py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Envoi en cours..." : "Valider mon inscription"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {imageOpen && event.imageUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <button
              type="button"
              onClick={() => setImageOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            >
              ✕
            </button>
            <div className="max-w-5xl w-full px-4">
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={1600}
                height={900}
                className="w-full h-auto rounded-xl object-contain bg-black"
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
