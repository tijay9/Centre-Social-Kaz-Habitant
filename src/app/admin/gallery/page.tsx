'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Trash2,
  AlertCircle,
  Camera,
  Upload,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

interface GalleryImage {
  id: string;
  title?: string;
  description?: string;
  url: string;
  category: string;
  createdAt: string;
}

const CATEGORIES = [
  { id: 'SENIORS', name: 'Seniors', color: 'from-[#fc7f2b] to-orange-600' },
  { id: 'REEAP', name: 'REEAP', color: 'from-[#37a599] to-teal-600' },
  { id: 'LAEP', name: 'LAEP - Ti-Ludo', color: 'from-[#6271dd] to-blue-600' },
  { id: 'JEUNESSE', name: 'Jeunesse', color: 'from-purple-500 to-purple-700' },
  { id: 'ANIME_QUARTIER', name: 'Anime ton Quartier', color: 'from-pink-500 to-pink-700' },
  { id: 'ACCES_DROITS', name: 'Accès aux droits', color: 'from-indigo-500 to-indigo-700' }
] as const;

const MAX_IMAGES_PER_CATEGORY = 6;

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    loadGalleryImages();
  }, []);

  async function loadGalleryImages() {
    try {
      setLoading(true);
      const data = await apiFetch<any[]>('/gallery');
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      setApiError('Erreur lors du chargement de la galerie');
    } finally {
      setLoading(false);
    }
  }

  const getAuthToken = () => {
    try {
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  };

  const getImagesByCategory = (categoryId: string) => {
    return images.filter(img => img.category === categoryId).slice(0, MAX_IMAGES_PER_CATEGORY);
  };

  const canAddImageToCategory = (categoryId: string) => {
    return getImagesByCategory(categoryId).length < MAX_IMAGES_PER_CATEGORY;
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    setIsDeleting(true);
    setApiError('');
    try {
      await apiFetch(`/admin/gallery/${encodeURIComponent(imageId)}`, {
        method: 'DELETE',
      });
      
      await loadGalleryImages();
    } catch (e) {
      console.error(e);
      setApiError((e as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openUploadModal = (categoryId: string) => {
    if (!canAddImageToCategory(categoryId)) {
      alert(`Cette catégorie a déjà atteint la limite de ${MAX_IMAGES_PER_CATEGORY} images`);
      return;
    }
    setSelectedCategory(categoryId);
    setUploadForm({ title: '', description: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowUploadModal(true);
    setUploadError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Format non valide. Utilisez JPG, PNG, GIF ou WEBP');
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux. Maximum 5MB');
      return;
    }

    setSelectedFile(file);
    setUploadError('');

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadError('Veuillez sélectionner une image');
      return;
    }

    if (!canAddImageToCategory(selectedCategory)) {
      setUploadError(`Cette catégorie a déjà atteint la limite de ${MAX_IMAGES_PER_CATEGORY} images`);
      return;
    }

    setUploadLoading(true);
    setUploadError('');

    try {
      const token = getAuthToken();
      if (!token) throw new Error('Session expirée. Veuillez vous reconnecter.');

      // 1) Upload vers Supabase Storage via le backend
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', 'gallery');

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')}/admin/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        throw new Error(uploadData?.error || "Erreur lors de l'upload");
      }

      const imageUrl = uploadData.url as string;
      if (!imageUrl) throw new Error('URL upload manquante');

      // 2) Enregistrer en DB
      await apiFetch('/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          title: uploadForm.title || selectedFile.name,
          description: uploadForm.description || undefined,
          category: selectedCategory,
        }),
      });

      await loadGalleryImages();

      setUploadForm({ title: '', description: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      setShowUploadModal(false);
      setSelectedCategory('');
    } catch (e) {
      console.error(e);
      setUploadError((e as Error).message);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la galerie...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la galerie</h1>
          <p className="text-gray-700 mt-1">
            Gérez les images par catégorie - Maximum {MAX_IMAGES_PER_CATEGORY} images par catégorie
          </p>
        </div>
      </div>

      {/* Global API error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <div>
            <p className="text-sm">{apiError}</p>
          </div>
        </div>
      )}

      {/* Catégories */}
      <div className="space-y-8">
        {CATEGORIES.map((category) => {
          const categoryImages = getImagesByCategory(category.id);
          const remainingSlots = MAX_IMAGES_PER_CATEGORY - categoryImages.length;
          const canAdd = canAddImageToCategory(category.id);

          return (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* En-tête de catégorie */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {categoryImages.length}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-sm text-gray-500">
                      {categoryImages.length} / {MAX_IMAGES_PER_CATEGORY} images
                      {remainingSlots > 0 && ` - ${remainingSlots} place${remainingSlots > 1 ? 's' : ''} disponible${remainingSlots > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => openUploadModal(category.id)}
                  disabled={!canAdd}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    canAdd
                      ? 'bg-[#fc7f2b] text-white hover:bg-[#e6721f]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une image
                </button>
              </div>

              {/* Grille d'images */}
              {categoryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categoryImages.map((image, index) => (
                    <div key={image.id} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#fc7f2b] transition-colors">
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src={image.url}
                          alt={image.title || 'Image'}
                          fill
                          unoptimized
                          priority={index === 0}
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        />
                        
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={isDeleting}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Titre en bas */}
                      {image.title && (
                        <div className="p-2 bg-white">
                          <p className="text-xs text-gray-700 truncate font-medium">{image.title}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Emplacements vides */}
                  {remainingSlots > 0 && Array.from({ length: remainingSlots }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                    >
                      <div className="text-center text-gray-400">
                        <Camera className="w-8 h-8 mx-auto mb-1" />
                        <p className="text-xs">Vide</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aucune image dans cette catégorie</p>
                  <button
                    onClick={() => openUploadModal(category.id)}
                    className="inline-flex items-center px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter la première image
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Ajouter une image - {CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedCategory('');
                  setSelectedFile(null);
                  setPreviewUrl('');
                  setUploadError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Zone de sélection de fichier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                
                {!previewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#fc7f2b] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Cliquez pour sélectionner une image
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF, WEBP - Max 5MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative border-2 border-[#fc7f2b] rounded-lg p-4">
                    <div className="relative w-full h-48 mb-3">
                      <Image
                        src={previewUrl}
                        alt="Prévisualisation"
                        fill
                        unoptimized
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700 truncate flex-1">
                        {selectedFile?.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                        className="ml-2 p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedFile && `${(selectedFile.size / 1024).toFixed(2)} KB`}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Titre de l'image"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si vide, le nom du fichier sera utilisé
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  placeholder="Description de l'image"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedCategory('');
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setUploadError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading || !selectedFile}
                  className="px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {uploadLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Ajouter l&apos;image
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}