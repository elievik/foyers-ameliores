'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'À Propos', href: '/about' },
    { label: 'Régions', href: '/regions' },
    { label: 'Catalogue', href: '/catalog' },
    { label: 'Actualités', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="text-headline-sm font-headline-sm text-primary font-bold tracking-tight">
          Foyers Améliorés Togo
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`pb-1 border-b-2 transition-colors text-body-md ${
                pathname === item.href
                  ? 'text-primary border-primary font-bold'
                  : 'text-on-surface border-transparent hover:text-primary hover:border-primary/30'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <Link href="/catalog" className="hidden md:block">
          <button className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-button text-button hover:brightness-110 duration-150 transition-all active:scale-95 shadow-sm">
            Commander
          </button>
        </Link>
        
        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-3xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant shadow-lg">
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'text-primary bg-primary/10 font-bold'
                    : 'text-on-surface hover:bg-primary/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 bg-secondary text-on-secondary py-3 px-6 rounded-lg font-button text-button text-center hover:brightness-110 transition-all"
            >
              Commander
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
