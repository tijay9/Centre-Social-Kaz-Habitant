'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Image,
  FileText,
  BarChart,
  Settings,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { fetchStatisticsClient } from '@/lib/data';

interface Statistics {
  events: number;
  teamMembers: number;
  galleryImages: number;
  partners: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Statistics>({
    events: 0,
    teamMembers: 0,
    galleryImages: 0,
    partners: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const statisticsData = await fetchStatisticsClient();
        setStats(statisticsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statisticsCards = [
    { 
      title: 'Événements', 
      value: (stats.events || 0).toString(), 
      icon: Calendar, 
      color: 'from-[#fc7f2b] to-orange-600', 
      change: '--',
      trend: 'neutral',
      description: 'À venir'
    },
    { 
      title: 'Membres équipe', 
      value: (stats.teamMembers || 0).toString(), 
      icon: Users, 
      color: 'from-[#37a599] to-teal-600', 
      change: '--',
      trend: 'neutral',
      description: 'Actifs'
    },
    { 
      title: 'Partenaires', 
      value: (stats.partners || 0).toString(), 
      icon: FileText, 
      color: 'from-[#6271dd] to-blue-600', 
      change: '--',
      trend: 'neutral',
      description: 'Collaborations'
    },
    { 
      title: 'Galerie photos', 
      value: (stats.galleryImages || 0).toString(), 
      icon: Image, 
      color: 'from-purple-500 to-purple-700', 
      change: '--',
      trend: 'neutral',
      description: 'Images totales'
    }
  ];

  const quickActions = [
    { title: 'Nouvel événement', icon: Calendar, href: '/admin/events/new', color: 'bg-[#fc7f2b]', description: 'Créer un événement' },
    { title: 'Gérer l\'équipe', icon: Users, href: '/admin/team', color: 'bg-[#37a599]', description: 'Membres et rôles' },
    { title: 'Contenu des pages', icon: FileText, href: '/admin/content', color: 'bg-[#6271dd]', description: 'Textes et infos' },
    { title: 'Galerie photos', icon: Image, href: '/admin/gallery', color: 'bg-purple-500', description: 'Images et médias' },
   
    { title: 'Statistiques', icon: BarChart, href: '/admin/stats', color: 'bg-indigo-500', description: 'Analyses et rapports' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-700 mt-1">
            Vue d&#39;ensemble de l&#39;activité du Centre Social Dorothy
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticsCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : null;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {TrendIcon && <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />}
                <span className={`text-sm font-medium ml-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">ce mois</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#fc7f2b] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}