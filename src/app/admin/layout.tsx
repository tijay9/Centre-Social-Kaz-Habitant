'use client';

import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  Menu,
  X,
  Home,
  Images,
  LogOut,
  ClipboardList
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { apiFetch } from '@/lib/apiClient';

const adminNavItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/events', icon: Calendar, label: 'Événements' },
  { href: '/admin/registrations', icon: ClipboardList, label: 'Inscriptions' },
  { href: '/admin/team', icon: Users, label: 'Équipe' },
  { href: '/admin/gallery', icon: Images, label: 'Galerie' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const cookieToken = typeof document !== 'undefined'
        ? document.cookie.match(/(?:^|; )auth-token=([^;]*)/)?.[1]
        : undefined;
      const effectiveToken = token ?? (cookieToken ? decodeURIComponent(cookieToken) : null);

      if (!effectiveToken) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setIsLoading(false);
        return;
      }

      const data = await apiFetch<{ user: any }>('/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
    // we intentionally omit checkAuthentication from deps to avoid redef issues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Supprime le cookie de session (middleware Next)
    document.cookie = 'auth-token=; Path=/; Max-Age=0; SameSite=Lax; Secure';

    setIsAuthenticated(false);
    setUser(null);
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#fc7f2b] mx-auto" />
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30 md:relative">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* Logo et titre - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0">
                <NextImage
                  src="/logo.png"
                  alt="Logo Dorothy"
                  width={32}
                  height={32}
                  className="object-contain sm:w-10 sm:h-10"
                  priority
                />
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                <span className="hidden sm:inline">Administration </span>Dorothy
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* User info - Hidden on small screens */}
            <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
              <span>Connecté en tant que</span>
              <span className="font-medium text-[#fc7f2b]">{user?.name}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              aria-label="Déconnexion"
            >
              <LogOut size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>

            {/* Home link */}
            <Link
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#fc7f2b] transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Voir le site"
            >
              <Home size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Site</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-[57px] md:pt-0">
        {/* Sidebar - Responsive */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-0">
            {/* User info in sidebar - Visible on mobile/tablet */}
            <div className="p-4 border-b border-gray-200 lg:hidden">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#fc7f2b] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#fc7f2b] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#fc7f2b]'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout button in sidebar - Mobile only */}
            <div className="p-4 border-t border-gray-200 lg:hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay - Responsive */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content - Responsive padding */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 min-w-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}