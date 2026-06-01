import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="text-headline-sm font-headline-sm text-primary font-bold tracking-tight">
          Foyers Améliorés Togo
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-primary border-b-2 border-primary pb-1 font-bold text-body-md font-body-md hover:text-secondary transition-colors">
            Accueil
          </Link>
          <Link href="/about" className="text-on-surface hover:text-primary transition-colors font-medium text-body-md font-body-md">
            À Propos
          </Link>
          <Link href="/regions" className="text-on-surface hover:text-primary transition-colors font-medium text-body-md font-body-md">
            Régions
          </Link>
          <Link href="/catalog" className="text-on-surface hover:text-primary transition-colors font-medium text-body-md font-body-md">
            Catalogue
          </Link>
          <Link href="/news" className="text-on-surface hover:text-primary transition-colors font-medium text-body-md font-body-md">
            Actualités
          </Link>
          <Link href="/contact" className="text-on-surface hover:text-primary transition-colors font-medium text-body-md font-body-md">
            Contact
          </Link>
        </nav>
        <Link href="/catalog">
          <button className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-button text-button hover:brightness-110 duration-150 transition-all active:scale-95 shadow-sm">
            Commander
          </button>
        </Link>
      </div>
    </header>
  );
}
