import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ArrowRight, Facebook, Instagram } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo.png" 
                alt="Dorothy" 
                width={40} 
                height={40} 
                className="rounded"
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="text-white text-lg font-semibold">Dorothy</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Centre Social Kaz&apos;Habitant à Fort-de-France. Lieu de vie, d&apos;échange et de solidarité au service de tous.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={APP_CONFIG.social.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-[#fc7f2b] text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={APP_CONFIG.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-[#fc7f2b] text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/apropos" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/evenements" className="hover:text-white transition-colors">Événements</Link></li>
              <li><Link href="/partenaires" className="hover:text-white transition-colors">Partenaires</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Univers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Nos univers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seniors" className="hover:text-white transition-colors">Seniors</Link></li>
              <li><Link href="/reeap" className="hover:text-white transition-colors">REEAP</Link></li>
              <li><Link href="/tiludo" className="hover:text-white transition-colors">LAEP • Ti-Ludo</Link></li>
              <li><Link href="/jeunesse" className="hover:text-white transition-colors">Jeunesse &amp; CLAS</Link></li>
              <li><Link href="/acces-droits" className="hover:text-white transition-colors">Accès aux droits</Link></li>
              <li><Link href="/anime-quartier" className="hover:text-white transition-colors">Anime ton Quartier</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#fc7f2b] mt-0.5" />
                <span>{APP_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#fc7f2b] mt-0.5" />
                <span>{APP_CONFIG.contact.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#fc7f2b] mt-0.5" />
                <span>{APP_CONFIG.contact.email}</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/contact" className="inline-flex items-center gap-2 text-[#fc7f2b] hover:text-white transition-colors">
                Nous contacter <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Centre Social Kaz&apos;Habitant - Martinique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
