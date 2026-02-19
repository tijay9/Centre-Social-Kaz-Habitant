'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, Users, FileText, 
  BarChart, TrendingUp, Activity, 
  MapPin, Clock, ArrowUp, ArrowDown,
  ArrowRight, Sparkles, Target, Heart, Scale, Megaphone
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchStatisticsClient, fetchEventsClient, fetchTeamMembersClient } from '@/lib/data';

export default function AdminPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analytics, setAnalytics] = useState({
    totalParticipants: 0,
    newRegistrations: 0,
    totalEvents: 0,
    completedEvents: 0,
    participationRate: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        // Charger les données réelles depuis la base de données
        const [, eventsData] = await Promise.all([
          fetchStatisticsClient(),
          fetchEventsClient(),
          fetchTeamMembersClient()
        ]);

        // Calculer les analytics réels basés sur les données
        setAnalytics({
          totalParticipants: 0, // À calculer selon les inscriptions
          newRegistrations: 0, // À calculer selon les nouvelles inscriptions
          totalEvents: eventsData.length,
          completedEvents: 0, // À calculer selon le statut des événements
          participationRate: 0, // À calculer selon les participations
          monthlyGrowth: 0 // À calculer selon les données historiques
        });
      } catch (error) {
        console.error('Erreur lors du chargement des analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [selectedPeriod]);

  const eventStats = [
    { 
      title: 'Total Participants', 
      value: analytics.totalParticipants.toString(), 
      icon: Users, 
      color: 'from-[#fc7f2b] to-orange-600', 
      change: `+${analytics.newRegistrations}`,
      changeType: 'increase',
      description: 'Ce mois'
    },
    { 
      title: 'Événements actifs', 
      value: analytics.totalEvents.toString(), 
      icon: Calendar, 
      color: 'from-[#37a599] to-teal-600', 
      change: '--',
      changeType: 'neutral',
      description: 'En cours'
    },
    { 
      title: 'Taux participation', 
      value: analytics.participationRate + '%', 
      icon: TrendingUp, 
      color: 'from-[#6271dd] to-blue-600', 
      change: '--',
      changeType: 'neutral',
      description: 'Moyenne'
    },
    { 
      title: 'Croissance mensuelle', 
      value: analytics.monthlyGrowth + '%', 
      icon: BarChart, 
      color: 'from-purple-500 to-purple-700', 
      change: '--',
      changeType: 'neutral',
      description: 'vs mois dernier'
    }
  ];

  // Supprimer les données de test des catégories
  const categoryData = [
    {
      name: 'Seniors',
      icon: Heart,
      color: 'bg-gradient-to-br from-rose-500 to-pink-600',
      participants: 0,
      events: 0,
      avgParticipation: 0,
      trend: 'neutral',
      trendValue: 0
    },
    {
      name: 'REEAP',
      icon: Users,
      color: 'bg-gradient-to-br from-[#37a599] to-teal-600',
      participants: 0,
      events: 0,
      avgParticipation: 0,
      trend: 'neutral',
      trendValue: 0
    },
    {
      name: 'Ti-Ludo (LAEP)',
      icon: Sparkles,
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      participants: 0,
      events: 0,
      avgParticipation: 0,
      trend: 'neutral',
      trendValue: 0
    },
    {
      name: 'Jeunesse',
      icon: Target,
      color: 'bg-gradient-to-br from-[#6271dd] to-purple-600',
      participants: 0,
      events: 0,
      avgParticipation: 0,
      trend: 'neutral',
      trendValue: 0
    },
    {
      name: 'Anime ton quartier',
      icon: Megaphone,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      participants: 0,
      events: 0,
      avgParticipation: 0,
      trend: 'neutral',
      trendValue: 0
    },
    {
      name: 'Accès aux droits',
      icon: Scale,
      color: 'bg-gradient-to-br from-blue-600 to-indigo-700',
      participants: 0,
      events: 0,
      avgParticipation: 0,
      trend: 'neutral',
      trendValue: 0
    }
  ];

  // Supprimer les activités récentes fictives
  const recentActivities: {
    action: string;
    item: string;
    time: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [];

  // Supprimer les événements populaires fictifs
  const topEvents: {
    name: string;
    category: string;
    participants: number;
    capacity: number;
    fillRate: number;
  }[] = [];

  const quickActions = [
    { 
      title: 'Voir inscriptions', 
      icon: Users, 
      href: '/admin/registrations', 
      color: 'bg-[#fc7f2b]',
      description: 'Gérer les participants'
    },
    { 
      title: 'Rapport mensuel', 
      icon: BarChart, 
      href: '/admin/reports', 
      color: 'bg-[#37a599]',
      description: 'Statistiques détaillées'
    },
    { 
      title: 'Nouvel événement', 
      icon: Calendar, 
      href: '/admin/events/new', 
      color: 'bg-[#6271dd]',
      description: 'Créer un événement'
    },
    { 
      title: 'Exporter données', 
      icon: FileText, 
      href: '/admin/export', 
      color: 'bg-purple-500',
      description: 'CSV, PDF, Excel'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tableau de Bord Dorothy
                </h1>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Données analytiques en temps réel
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Mise à jour</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#fc7f2b] to-[#37a599] rounded-full flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Période de sélection */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Période :</span>
              {['week', 'month', 'quarter'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    selectedPeriod === period
                      ? 'bg-[#fc7f2b] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Trimestre'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {eventStats.map((stat, index) => {
            const IconComponent = stat.icon;
            const isIncrease = stat.changeType === 'increase';
            const isNeutral = stat.changeType === 'neutral';
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm flex items-center ${
                      isNeutral ? 'text-gray-500' : isIncrease ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {!isNeutral && (isIncrease ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />)}
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Analytics par Catégorie */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-3"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Analytics par Programme</h3>
                <Activity className="w-5 h-5 text-[#fc7f2b]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryData.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#fc7f2b] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className={`flex items-center text-xs font-medium text-gray-500`}>
                          --
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Participants:</span>
                          <span className="font-medium">{category.participants}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Événements:</span>
                          <span className="font-medium">{category.events}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Participation:</span>
                          <span className="font-medium">{category.avgParticipation}%</span>
                        </div>
                      </div>
                      {/* Barre de progression */}
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#fc7f2b] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${category.avgParticipation}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Top Événements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Événements Populaires</h3>
            {topEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topEvents.map((event, index) => (
                  <motion.div
                    key={event.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#fc7f2b] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm">{event.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{event.category}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Inscrits:</span>
                        <span className="font-medium">{event.participants}/{event.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#fc7f2b] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${event.fillRate}%` }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-[#fc7f2b]">{event.fillRate}% rempli</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun événement populaire pour le moment</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions Rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <motion.a
                    key={action.title}
                    href={action.href}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.9 }}
                    className="group flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-[#fc7f2b] hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#fc7f2b] transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#fc7f2b] group-hover:translate-x-1 transition-all" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}