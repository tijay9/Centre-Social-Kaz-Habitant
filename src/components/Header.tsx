'use client';

import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  dropdown?: Array<{
    name: string;
    href: string;
  }>;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Ferme les dropdowns mobiles quand on ferme le menu
  useEffect(() => {
    if (!isMenuOpen) {
      setActiveMobileDropdown(null);
    }
  }, [isMenuOpen]);

  // Fonction pour vérifier si un item est actif
  const isItemActive = (item: NavItem) => {
    if (item.href === '/' && pathname === '/') {
      return true;
    }
    if (item.href !== '/' && pathname === item.href) {
      return true;
    }
    // Vérifier si un sous-menu est actif
    if (item.dropdown) {
      return item.dropdown.some((dropItem) => pathname === dropItem.href);
    }
    return false;
  };

  const handleDropdownEnter = (itemName: string) => {
    setActiveDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    // Délai avant de fermer pour éviter la fermeture accidentelle
    setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const navItems: NavItem[] = [
    { name: 'ACCUEIL', href: '/' },
    {
      name: 'QUI SOMMES-NOUS',
      href: '#',
      dropdown: [
        { name: 'Présentation du Centre', href: '/apropos' },
        { name: 'Notre équipe', href: '/equipe' },
      ],
    },
    { name: 'ÉVÉNEMENTS', href: '/evenements' },
    { name: 'PARTENAIRES', href: '/partenaires' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <header className="bg-gradient-to-b from-[#fff7f1] via-[#fffdf9] to-white/90 border-b border-orange-50/80 backdrop-blur-sm relative z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top bar: logo + burger alignés */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center md:justify-center"
          >
            <Link
              href="/"
              className="flex flex-col items-center text-inherit no-underline group"
            >
              {/* Logo Dorothy */}
              <div className="mb-2 rounded-full bg-white/80 shadow-sm border border-orange-100 p-2 group-hover:shadow-md transition-shadow duration-300">
                <Image
                  src="/logo.png"
                  alt="Logo Dorothy"
                  width={220}
                  height={220}
                />
              </div>

              {/* Nom principal Dorothy */}
              <div className="font-extrabold text-2xl md:text-3xl lg:text-4xl text-gray-900 tracking-wide mb-1">
                <span className="text-gray-900">
                  Dorothy
                </span>
              </div>

              {/* Sous-titre Centre Social */}
              <div className="font-medium text-xs md:text-sm text-gray-600 tracking-[0.15em] uppercase">
                Centre Social Kaz&apos;Habitant
              </div>
            </Link>
          </motion.div>

          {/* Bouton burger vraiment à droite, collé au bord sur mobile */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden ml-4 flex flex-col cursor-pointer bg-white/95 p-3 rounded-full shadow-lg w-11 h-11 items-center justify-center transition-all duration-300 border border-orange-100 hover:bg-orange-50/60"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-800" />
            ) : (
              <Menu className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>

        {/* Navigation Container (desktop) */}
        <div className="relative hidden md:flex items-center justify-center pb-4">
          <nav className="hidden md:flex w-full justify-center">
            <div className="inline-flex items-center rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-orange-50/80 px-6 py-2.5 backdrop-blur-sm">
              <ul className="flex list-none m-0 p-0 justify-center space-x-6 lg:space-x-10">
                {navItems.map((item, index) => {
                  const isActive = isItemActive(item);
                  const isDropdownActive = activeDropdown === item.name;

                  return (
                    <li key={item.name} className="relative">
                      {item.dropdown ? (
                        <div
                          className="relative"
                          onMouseEnter={() => handleDropdownEnter(item.name)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <motion.button
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              'font-medium text-sm tracking-wider relative pb-2 transition-colors duration-300 hover:text-[#fc7f2b] flex items-center uppercase',
                              isActive || isDropdownActive ? 'text-[#fc7f2b]' : 'text-gray-700'
                            )}
                          >
                            {item.name}
                            <ChevronDown className="ml-1 h-3 w-3" />
                            <span
                              className={cn(
                                'absolute bottom-0 left-0 h-0.5 bg-[#fc7f2b] transition-all duration-300',
                                isActive || isDropdownActive ? 'w-full' : 'w-0'
                              )}
                            />
                          </motion.button>

                          {/* Dropdown améliorée */}
                          <div
                            className={cn(
                              'absolute bg-white min-w-52 shadow-lg z-50 rounded overflow-hidden top-full left-1/2 transform -translate-x-1/2 border border-gray-100 transition-all duration-200',
                              isDropdownActive ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                            )}
                          >
                            {item.dropdown.map((dropItem) => (
                              <Link
                                key={dropItem.name}
                                href={dropItem.href}
                                className={cn(
                                  'block py-3 px-4 text-sm hover:bg-gray-50 hover:text-[#fc7f2b] transition-colors duration-200 border-b border-gray-100 last:border-b-0',
                                  pathname === dropItem.href
                                    ? 'text-[#fc7f2b] bg-orange-50'
                                    : 'text-gray-700'
                                )}
                                onClick={() => setActiveDropdown(null)}
                              >
                                {dropItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          initial={false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'font-medium text-sm tracking-wider relative pb-2 transition-colors duration-300 hover:text-[#fc7f2b] group uppercase',
                              isActive ? 'text-[#fc7f2b]' : 'text-gray-700'
                            )}
                          >
                            {item.name}
                            <span
                              className={cn(
                                'absolute bottom-0 left-0 h-0.5 bg-[#fc7f2b] transition-all duration-300 group-hover:w-full',
                                isActive ? 'w-full' : 'w-0'
                              )}
                            />
                          </Link>
                        </motion.div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* Overlay cliquable qui ferme le menu et les sous-menus quand on clique ailleurs */}
        {isMenuOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => {
              setIsMenuOpen(false);
              setActiveMobileDropdown(null);
            }}
            aria-label="Fermer le menu"
          />
        )}

        {/* Mobile nav amélioré */}
        <motion.div
          ref={mobileMenuRef}
          initial={false}
          animate={isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className={cn(
            'fixed inset-x-0 top-[88px] md:hidden z-40 px-4',
            isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          // Quand on clique dans le bloc menu mais pas sur un item, on ferme les sous-menus
          onClick={(e) => {
            // si le clic vient directement du fond du panneau (pas d’un bouton/link), on ferme les dropdowns
            if (e.target === mobileMenuRef.current) {
              setActiveMobileDropdown(null);
            }
          }}
        >
          <div className="max-w-md mx-auto bg-white/95 rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.15)] border border-orange-100/80 backdrop-blur-md overflow-hidden">
            <nav>
              <ul className="flex flex-col divide-y divide-orange-50">
                {navItems.map((item) => {
                  const isActive = isItemActive(item);
                  const isMobileDropdownOpen = activeMobileDropdown === item.name;

                  return (
                    <li key={item.name} className="w-full">
                      {item.dropdown ? (
                        <div>
                          <button
                            onClick={() =>
                              setActiveMobileDropdown((prev) =>
                                prev === item.name ? null : item.name
                              )
                            }
                            className={cn(
                              'flex w-full items-center justify-between px-5 py-4 text-left text-[13px] font-semibold tracking-[0.16em] uppercase transition-all duration-300',
                              isActive || isMobileDropdownOpen
                                ? 'text-[#fc7f2b] bg-orange-50'
                                : 'text-gray-800 bg-white hover:bg-gray-50 hover:text-[#fc7f2b]'
                            )}
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={cn(
                                'ml-3 h-4 w-4 transition-transform duration-300',
                                isMobileDropdownOpen ? 'rotate-180' : ''
                              )}
                            />
                          </button>
                          <motion.div
                            initial={false}
                            animate={isMobileDropdownOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50"
                          >
                            <div className="flex flex-col py-1">
                              {item.dropdown.map((dropItem) => (
                                <Link
                                  key={dropItem.name}
                                  href={dropItem.href}
                                  className={cn(
                                    'px-8 py-3 text-sm text-left transition-colors duration-200',
                                    pathname === dropItem.href
                                      ? 'text-[#fc7f2b] bg-white'
                                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#fc7f2b]'
                                  )}
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setActiveMobileDropdown(null);
                                  }}
                                >
                                  {dropItem.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'block px-5 py-4 text-center text-[13px] font-semibold tracking-[0.16em] uppercase transition-all duration-300',
                            isActive
                              ? 'text-[#fc7f2b] bg-orange-50'
                              : 'text-gray-800 bg-white hover:bg-gray-50 hover:text-[#fc7f2b]'
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </motion.div>
      </div>
    </header>
  );
}