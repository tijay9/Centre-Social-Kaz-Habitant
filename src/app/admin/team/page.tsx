'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fetchTeamMembersClient } from '@/lib/data';
import { apiFetch } from '@/lib/apiClient';

interface AdminTeamMember {
  id: string;
  name: string;
  role: string;
  category: 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'direction' | 'acces_droits' | 'anime_quartier';
  email?: string;
  phone?: string;
  location?: string;
  image?: string;
  bio: string;
  isActive: boolean;
  joinedAt: string;
}

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'direction' | 'acces_droits' | 'anime_quartier'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState<AdminTeamMember | null>(null);

  const membersPerPage = 8;

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const members = await apiFetch<AdminTeamMember[]>('/admin/team');
        setTeamMembers(members);
      } catch (error) {
        console.error('Erreur lors du chargement des membres:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeamMembers();
  }, []);

  const refreshTeamMembers = async () => {
    try {
      const members = await apiFetch<AdminTeamMember[]>('/admin/team');
      setTeamMembers(members);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des membres:', error);
    }
  };

  // Filtrage des membres
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || member.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && member.isActive) ||
                         (filterStatus === 'inactive' && !member.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + membersPerPage);

  const getCategoryLabel = (category: string) => {
    const labels = {
      seniors: 'Seniors',
      reeap: 'REEAP',
      laep: 'LAEP',
      jeunesse: 'Jeunesse',
      direction: 'Direction',
      acces_droits: 'Accès aux droits',
      anime_quartier: 'Animation territoriale'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      seniors: 'bg-blue-100 text-blue-800',
      reeap: 'bg-green-100 text-green-800',
      laep: 'bg-purple-100 text-purple-800',
      jeunesse: 'bg-orange-100 text-orange-800',
      direction: 'bg-red-100 text-red-800',
      acces_droits: 'bg-indigo-100 text-indigo-800',
      anime_quartier: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ? Cette action est irréversible.')) {
      setShowDeleteModal(null);
      return;
    }

    try {
      await apiFetch(`/admin/team/${encodeURIComponent(memberId)}`, {
        method: 'DELETE',
      });

      // Rafraîchir les données depuis la base de données
      await refreshTeamMembers();
      setShowDeleteModal(null);
      alert('Membre supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression: ' + (error as Error).message);
    }
  };

  const toggleMemberStatus = async (memberId: string) => {
    try {
      const member = teamMembers.find(m => m.id === memberId);
      if (!member) return;

      const newStatus = !member.isActive;

      await apiFetch(`/admin/team/${encodeURIComponent(memberId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      // Rafraîchir les données depuis la base de données
      await refreshTeamMembers();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de l`&apos;`équipe...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion de l`&apos;`équipe</h1>
          <p className="text-gray-700 mt-1">
            Gérez les membres de l`&apos;`équipe Dorothy
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/team/new"
            className="inline-flex items-center px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau membre
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
            />
          </div>

          {/* Filtre par catégorie */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as typeof filterCategory)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="direction">Direction</option>
            <option value="seniors">Seniors</option>
            <option value="reeap">REEAP</option>
            <option value="laep">LAEP</option>
            <option value="jeunesse">Jeunesse</option>
            <option value="acces_droits">Accès aux droits</option>
            <option value="anime_quartier">Animation territoriale</option>
          </select>

          {/* Filtre par statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>

          {/* Informations */}
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-1" />
            {filteredMembers.length} membre(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* Liste des membres */}
      {currentMembers.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 gap-4 p-6">
              {currentMembers.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.image ? (
                          <Image 
                            src={member.image} 
                            alt={member.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(member.category)}`}>
                            {getCategoryLabel(member.category)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {member.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{member.role}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          {member.email && (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {member.phone}
                            </div>
                          )}
                          {member.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {member.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setShowViewModal(member)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/team/edit/${member.id}`}
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => setShowDeleteModal(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {startIndex + 1} à {Math.min(startIndex + membersPerPage, filteredMembers.length)} sur {filteredMembers.length} membres
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
              ? 'Aucun membre trouvé' 
              : 'Aucun membre d&apos;équipe'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Essayez de modifier vos critères de recherche.'
              : 'Commencez par ajouter des membres à votre équipe.'
            }
          </p>
          {(!searchTerm && filterCategory === 'all' && filterStatus === 'all') && (
            <Link
              href="/admin/team/new"
              className="inline-flex items-center px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un membre
            </Link>
          )}
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supprimer le membre
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce membre de l`&apos;`équipe ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteMember(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Détails du membre
              </h3>
              <button
                onClick={() => setShowViewModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Photo et informations principales */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {showViewModal.image ? (
                    <Image 
                      src={showViewModal.image} 
                      alt={showViewModal.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900">{showViewModal.name}</h4>
                  <p className="text-lg text-gray-600">{showViewModal.role}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(showViewModal.category)}`}>
                      {getCategoryLabel(showViewModal.category)}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      showViewModal.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {showViewModal.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {showViewModal.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#fc7f2b]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="font-medium text-gray-700">{showViewModal.email}</p>
                    </div>
                  </div>
                )}

                {showViewModal.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#fc7f2b]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Téléphone</p>
                      <p className="font-medium text-gray-700">{showViewModal.phone}</p>
                    </div>
                  </div>
                )}

                {showViewModal.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-[#fc7f2b]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Lieu de travail</p>
                      <p className="font-medium text-gray-700">{showViewModal.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-[#fc7f2b]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date d&apos;adhésion</p>
                    <p className="font-medium text-gray-700">{new Date(showViewModal.joinedAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              {/* Biographie */}
              {showViewModal.bio && (
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">Biographie</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{showViewModal.bio}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <Link
                  href={`/admin/team/edit/${showViewModal.id}`}
                  className="px-4 py-2 bg-[#fc7f2b] text-white rounded-lg hover:bg-[#e6721f] transition-colors"
                  onClick={() => setShowViewModal(null)}
                >
                  Modifier
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}