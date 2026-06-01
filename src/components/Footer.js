import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-8 max-w-container-max mx-auto">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="text-headline-sm font-headline-sm text-primary font-bold mb-4">
            Foyers Améliorés Togo
          </div>
          <p className="text-body-sm font-medium text-on-surface max-w-md">
            © 2026-2032 Foyers Améliorés Togo. Cuisson durable pour un avenir plus vert.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/about" className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors font-medium">
            À Propos
          </Link>
          <Link href="/regions" className="text-label-caps font-label-caps text-primary hover:text-secondary transition-colors font-bold">
            Régions
          </Link>
          <Link href="/catalog" className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors font-medium">
            Catalogue
          </Link>
          <Link href="/news" className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors font-medium">
            Actualités
          </Link>
          <Link href="/contact" className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors font-medium">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
