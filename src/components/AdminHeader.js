export default function AdminHeader() {
  return (
    <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          <input 
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
            placeholder="Rechercher une commande, un client..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
        <div className="flex items-center gap-2">
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">PANEL ADMIN</span>
        </div>
      </div>
    </header>
  );
}
