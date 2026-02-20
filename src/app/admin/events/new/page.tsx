'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Image as ImageIcon,
  Type,
  Tag
} from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

interface EventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'anime-quartier' | 'acces-droits';
  image: File | null;
  status: 'upcoming' | 'draft';
  tags: string[];
}

interface LoadedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  category: string;
  imageUrl?: string | null;
  status: string;
  tags?: string[];
}

export default function NewEvent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');

  const [saving, setSaving] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(!!editId);
  const [tagInput, setTagInput] = useState('');
  const [originalDate, setOriginalDate] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventForm>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: 'Centre Dorothy',
    category: 'seniors',
    image: null,
    status: 'upcoming',
    tags: [],
  });

  const handleInputChange = (field: keyof EventForm, value: string | File | null | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Map UI categories to API enum values
  const mapUiCategoryToApi = (category: EventForm['category']) => {
    switch (category) {
      case 'seniors':
        return 'SENIORS';
      case 'reeap':
        return 'REEAP';
      case 'laep':
        return 'LAEP';
      case 'jeunesse':
        return 'JEUNESSE';
      case 'anime-quartier':
        return 'ANIME_QUARTIER';
      case 'acces-droits':
        return 'ACCES_DROITS';
      default:
        return 'JEUNESSE';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      seniors: 'Seniors',
      reeap: 'REEAP',
      laep: 'LAEP - Ti-Ludo',
      jeunesse: 'Jeunesse',
      'anime-quartier': 'Anime Quartier',
      'acces-droits': 'Accès aux droits'
    };
    return labels[category as keyof typeof labels] || category;
  };

  // Charger l’événement existant en mode édition
  useEffect(() => {
    if (!editId) return;

    const loadEvent = async () => {
      try {
        setLoadingEvent(true);
        const data = await apiFetch<{ event: LoadedEvent }>(`/events/${editId}`);
        const event: LoadedEvent = data.event;

        // Mapper la catégorie API -> UI
        let category: EventForm['category'] = 'seniors';
        switch ((event.category || '').toUpperCase()) {
          case 'REEAP':
            category = 'reeap';
            break;
          case 'LAEP':
            category = 'laep';
            break;
          case 'JEUNESSE':
            category = 'jeunesse';
            break;
          case 'ANIME_QUARTIER':
            category = 'anime-quartier';
            break;
          case 'ACCES_DROITS':
            category = 'acces-droits';
            break;
          case 'SENIORS':
          default:
            category = 'seniors';
        }

        const rawDate = event.date as unknown as string;
        // Correction : garder la date exacte sans conversion de fuseau horaire
        let uiDate: string;
        if (typeof rawDate === 'string') {
          // Si c'est déjà une string, on prend juste les 10 premiers caractères (YYYY-MM-DD)
          uiDate = rawDate.substring(0, 10);
        } else {
          // Si c'est un objet Date, on utilise toLocaleDateString pour éviter les problèmes de fuseau
          const dateObj = new Date(rawDate);
          uiDate = dateObj.toLocaleDateString('en-CA'); // Format YYYY-MM-DD sans décalage
        }

        setOriginalDate(uiDate);

        setFormData(prev => ({
          ...prev,
          title: event.title || '',
          description: event.description || '',
          date: uiDate,
          time: event.time || '',
          location: event.location || 'Centre Dorothy',
          category,
          image: null,
          status: 'upcoming',
          tags: Array.isArray(event.tags) ? event.tags : [],
        }));
      } catch (err) {
        console.error(err);
        alert((err as Error).message);
        router.push('/admin/events');
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [editId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Vous devez être connecté pour enregistrer un événement');
      }

      // Simplest: no upload here. If you need it, we add /admin/uploads later.
      let imageUrl: string | null | undefined = undefined;
      if (formData.image) {
        imageUrl = null;
      }

      const hasDate = !!formData.date;

      const eventData: any = {
        title: formData.title,
        description: formData.description,
        time: formData.time,
        location: formData.location,
        category: mapUiCategoryToApi(formData.category),
        status: 'PUBLISHED',
        tags: formData.tags,
      };

      if (imageUrl !== undefined) {
        eventData.image_url = imageUrl;
      }

      // En création : on envoie toujours la date (obligatoire)
      if (!editId && hasDate) {
        eventData.date = formData.date;
      }

      // En édition : on n’envoie la date que si elle a vraiment changé
      if (editId && hasDate && originalDate && formData.date !== originalDate) {
        eventData.date = formData.date;
      }

      if (editId) {
        await apiFetch(`/admin/events/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      } else {
        eventData.featured = false;
        if (hasDate) eventData.date = formData.date;

        await apiFetch('/admin/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      }

      router.push('/admin/events');
    } catch (error) {
      console.error('Erreur:', error);
      alert("Erreur lors de l'enregistrement de l'événement: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Chargement de l’événement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/events"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editId ? 'Modifier un événement' : 'Nouvel événement'}
            </h1>
            <p className="text-gray-600 mt-1">
              {editId
                ? 'Modifiez les informations de l’événement existant'
                : 'Créez un nouvel événement pour l&#39;association Dorothy'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-[#fc7f2b]" />
                Informations générales
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Ex: Atelier cuisine seniors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Décrivez l'événement, le programme, les objectifs..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                  >
                    <option value="seniors">Seniors</option>
                    <option value="reeap">REEAP</option>
                    <option value="laep">LAEP - Ti-Ludo</option>
                    <option value="jeunesse">Jeunesse</option>
                    <option value="anime-quartier">Anime Quartier</option>
                    <option value="acces-droits">Accès aux droits</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date et lieu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#fc7f2b]" />
                Date et lieu
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Heure *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Lieu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Ex: Centre Dorothy, Salle polyvalente..."
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-[#fc7f2b]" />
                Tags
              </h3>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Ajouter un tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                  >
                    <option value="upcoming">Publié</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  
                  <Link
                    href="/admin/events"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </Link>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-[#fc7f2b]" />
                Image
              </h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.image ? (
                    <div>
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">{formData.image.name}</p>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        Cliquez pour sélectionner une image
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG - Max 5MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-3 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#fc7f2b] file:text-white hover:file:bg-[#e6721f]"
                  />
                </div>
              </div>
            </div>

            {/* Aperçu catégorie */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Catégorie:</span>
                  <span className="font-medium">{getCategoryLabel(formData.category)}</span>
                </div>
                
                {formData.date && formData.time && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {formData.date} à {formData.time}
                    </span>
                  </div>
                )}
                
                {formData.location && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lieu:</span>
                    <span className="font-medium">{formData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}