'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { apiFetch } from '@/lib/apiClient';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const data = await apiFetch<{ token: string; user: any }>('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/admin/dashboard');
      } else {
        await apiFetch('/auth/register-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name || 'Admin',
          }),
        });

        setSuccess('Admin créé, vous pouvez maintenant vous connecter.');
        setMode('login');
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fc7f2b] to-[#37a599] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <Image
              src="/logo.png"
              alt="Dorothy"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AAAAAAAAAAAAAAdministration</h1>
          <p className="text-white/80">Centre Social Dorothy</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6 space-x-2">
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded-full border ${
                mode === 'login'
                  ? 'bg-[#fc7f2b] text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => setMode('login')}
              disabled={loading}
            >
              Connexion
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded-full border ${
                mode === 'register'
                  ? 'bg-[#37a599] text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => setMode('register')}
              disabled={loading}
            >
              Créer un admin (temporaire)
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Connexion' : 'Création admin'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login'
                ? "Accédez à votre espace d'administration"
                : "Formulaire simple pour créer un compte admin"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37a599] focus:border-transparent transition-colors"
                  placeholder="Admin"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent transition-colors"
                placeholder="votre.email@exemple.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc7f2b] focus:border-transparent transition-colors"
                  placeholder="Votre mot de passe"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#fc7f2b] to-[#37a599] text-white rounded-lg hover:from-[#e6721f] hover:to-[#2e857e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {mode === 'login' ? 'Connexion...' : 'Création...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? (
                    <LogIn className="w-5 h-5 mr-2" />
                  ) : (
                    <UserPlus className="w-5 h-5 mr-2" />
                  )}
                  {mode === 'login' ? 'Se connecter' : "Créer l'admin"}
                </>
              )}
            </button>
          </form>

          {/* Lien retour au site */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[#fc7f2b] hover:text-[#e6721f] transition-colors text-sm font-medium"
            >
              ← Retour au site public
            </Link>
          </div>
        </div>

        {/* Informations de sécurité */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Espace réservé aux administrateurs du centre social
          </p>
          <p className="text-white/40 text-xs mt-1">
            Le bouton "Créer un admin" est prévu uniquement pour vos tests, à retirer ensuite.
          </p>
        </div>
      </div>
    </div>
  );
}