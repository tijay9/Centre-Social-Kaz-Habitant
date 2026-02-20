'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Image,
  Briefcase
} from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

interface TeamMemberForm {
  name: string;
  role: string;
  category: 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'direction';
  email: string;
  phone: string;
  location: string;
  bio: string;
  image: File | null;
  imageUrl: string | null;
  isActive: boolean;
}

export default function NewTeamMember() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TeamMemberForm>({
    name: '',
    role: '',
    category: 'seniors',
    email: '',
    phone: '',
    location: 'Centre Dorothy',
    bio: '',
    image: null,
    imageUrl: null,
    isActive: true
  });

  const handleInputChange = (field: keyof TeamMemberForm, value: string | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFormData(prev => ({ ...prev, image: null, imageUrl: null }));
      return;
    }

    // Optional front-side validation for JPG/PNG
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Format non supporté. Utilisez une image JPG, PNG, WEBP ou GIF.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop volumineuse (max 5MB).');
      e.target.value = '';
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'gallery'); // réutilise le bucket uploads; dossier logique

      const data = await apiFetch<{ url: string; path: string }>('/admin/uploads', {
        method: 'POST',
        body,
      });

      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: data.url,
      }));
    } catch (err) {
      console.error('Upload image équipe échoué:', err);
      setError((err as Error).message);
      setFormData(prev => ({ ...prev, image: null, imageUrl: null }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const memberData = {
        name: formData.name,
        role: formData.role,
        category: formData.category,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
        order: 0,
      };

      await apiFetch('/admin/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      router.push('/admin/team');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError((error as Error).message);
      alert('Erreur lors de la création du membre: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      seniors: 'Seniors',
      reeap: 'REEAP',
      laep: 'LAEP',
      jeunesse: 'Jeunesse',
      direction: 'Direction'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      seniors: 'bg-blue-100 text-blue-800',
      reeap: 'bg-green-100 text-green-800',
      laep: 'bg-purple-100 text-purple-800',
      jeunesse: 'bg-orange-100 text-orange-800',
      direction: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/team"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouveau membre</h1>
            <p className="text-gray-600 mt-1">
              Ajoutez un nouveau membre à l&#39;équipe Dorothy
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#fc7f2b]" />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Ex: Marie Dubois"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="marie.dubois@dorothy.mq"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="0596 XX XX XX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Lieu de travail
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Ex: Centre Dorothy, Antenne de..."
                  />
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-[#fc7f2b]" />
                Informations professionnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste / Fonction *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Ex: Responsable LAEP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service / Catégorie *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                  >
                    <option value="direction">Direction</option>
                    <option value="seniors">Seniors</option>
                    <option value="reeap">REEAP</option>
                    <option value="laep">LAEP</option>
                    <option value="jeunesse">Jeunesse</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie / Présentation
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                    placeholder="Décrivez l'expérience, les compétences et le rôle de cette personne..."
                  />
                </div>
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
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-[#fc7f2b] focus:ring-[#fc7f2b]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Membre actif
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Les membres actifs apparaissent sur le site public
                  </p>
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
                    href="/admin/team"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </Link>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2 text-[#fc7f2b]" />
                Photo
              </h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.imageUrl ? (
                    <div>
                      <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center">
                        {/* simple preview via native img to avoid Next/Image in client form */}
                        <img
                          src={formData.imageUrl}
                          alt={formData.name || 'Photo du membre'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-600 break-all">{formData.image?.name}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Photo du membre
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG - Max 2MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="mt-3 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#fc7f2b] file:text-white hover:file:bg-[#e6721f] disabled:opacity-50"
                  />

                  {uploading && (
                    <p className="mt-2 text-xs text-gray-500">Téléversement en cours...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Aperçu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
              
              <div className="space-y-3">
                {formData.name && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                )}
                
                {formData.role && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Poste:</span>
                    <span className="font-medium">{formData.role}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Service:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(formData.category)}`}>
                    {getCategoryLabel(formData.category)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Statut:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    formData.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                💡 Conseils
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Utilisez une photo professionnelle de bonne qualité</li>
                <li>• Rédigez une biographie engageante et authentique</li>
                <li>• Vérifiez les informations de contact</li>
                <li>• Choisissez le bon service selon le rôle</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}