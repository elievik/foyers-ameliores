import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-8 max-w-container-max mx-auto">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="text-headline-sm font-headline-sm text-primary dark:text-primary-fixed mb-4">
            Foyers Améliorés Togo
          </div>
          <p className="text-label-caps font-label-caps text-on-tertiary-fixed-variant dark:text-tertiary-fixed-dim max-w-md">
            © 2026-2032 Foyers Améliorés Togo. Sustainable cooking for a greener future.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/regions/savanes" className="text-label-caps font-label-caps text-on-tertiary-fixed-variant dark:text-tertiary-fixed-dim hover:text-primary transition-colors">
            Savanes
          </Link>
          <Link href="/regions/kara" className="text-label-caps font-label-caps text-on-tertiary-fixed-variant dark:text-tertiary-fixed-dim hover:text-primary transition-colors">
            Kara
          </Link>
          <Link href="/regions/centrale" className="text-label-caps font-label-caps text-on-tertiary-fixed-variant dark:text-tertiary-fixed-dim hover:text-primary transition-colors">
            Centrale
          </Link>
          <Link href="/regions/plateaux" className="text-label-caps font-label-caps text-on-tertiary-fixed-variant dark:text-tertiary-fixed-dim hover:text-primary transition-colors">
            Plateaux
          </Link>
          <Link href="/regions/maritime" className="text-label-caps font-label-caps text-on-tertiary-fixed-variant dark:text-tertiary-fixed-dim hover:text-primary transition-colors">
            Maritime
          </Link>
          <Link href="/privacy" className="text-label-caps font-label-caps text-on-tertiary-fixed-variant dark:text-tertiary-fixed-dim hover:text-primary transition-colors">
            Politique de Confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}
