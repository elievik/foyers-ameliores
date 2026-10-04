'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [adminName, setAdminName] = useState('');
  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    const updateProfile = () => {
      const savedProfile = localStorage.getItem('adminProfile');
      const role = localStorage.getItem('userRole') || 'admin';
      setUserRole(role);
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setAdminName(`${profile.prenom} ${profile.nom}`);
      }
    };
    
    // Initial load
    updateProfile();
    
    // Listen for storage changes
    window.addEventListener('storage', updateProfile);
    
    // Custom event for profile updates
    const handleProfileUpdate = () => updateProfile();
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('storage', updateProfile);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const allMenuItems = [
    { name: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { name: 'Actualités', icon: 'newspaper', href: '/admin/news', adminOnly: true },
    { name: 'Équipe', icon: 'group', href: '/admin/team', adminOnly: true },
    { name: 'Témoignages', icon: 'rate_review', href: '/admin/testimonials', adminOnly: true },
    { name: 'Partenaires', icon: 'business', href: '/admin/partners', adminOnly: true },
    { name: 'Bannières', icon: 'wallpaper', href: '/admin/banners', adminOnly: true },
    { name: 'Contact', icon: 'contact_support', href: '/admin/contact', adminOnly: true },
    { name: 'Rapports', icon: 'description', href: '/admin/reports' },
    { name: 'Témoignages', icon: 'rate_review', href: '/admin/testimonials-agent', agentOnly: true },
    { name: 'Images Produits', icon: 'photo_library', href: '/admin/product-images', adminOnly: true },
    { name: 'Suivi Régional', icon: 'map', href: '/admin/data', adminOnly: true },
    { name: 'Commandes', icon: 'shopping_cart', href: '/admin/orders' },
    { name: 'Revendeurs', icon: 'group_add', href: '/admin/resellers', adminOnly: true },
    { name: 'Agents', icon: 'badge', href: '/admin/agents', adminOnly: true },
    { name: 'Paramètres', icon: 'settings', href: '/admin/settings' },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (userRole === 'admin') return !item.agentOnly; // admins don't see agent-only pages
    return !item.adminOnly; // agents don't see admin-only pages
  });

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container dark:bg-surface-container-high shadow-sm flex flex-col py-6 z-50">
      <div className="px-6 mb-10">
        <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Foyers Améliorés</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1 text-[10px]">
          {userRole === 'admin' ? 'Togo Admin Panel' : 'Espace Agent'}
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors group ${
                isActive 
                  ? 'text-primary dark:text-primary-fixed font-bold border-r-4 border-primary bg-primary/10' 
                  : 'text-on-surface-variant dark:text-on-surface-variant hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill-current' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="font-body-md text-body-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low dark:bg-surface-dim shadow-sm border border-outline-variant/20">
          <img 
            alt="Admin Avatar" 
            className="w-10 h-10 rounded-full object-cover shadow-sm" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn0IG8WnAAMCvaxYtTqN4KpAE7LVaPkE9ASyBdQbLK6kBeX3Ihn6X9D41qrMnoSDUgftYOMN6WLTYsduTEa2LrG7AdWuE_Q0o-83ZJJH587CTC0Phj04bY08DTBpW8mwrl2FDaTja9xDkoPo7CVSp2ifv7Qh31AT1qCKOGUJMmZA9Lz4eLEgNLJbISAC635X1adqTDNzGnhasXUEvjgPtb-nkUhd6IbPY1fpaPf66J_vg6vKKuwbUZ5uKJ7S5Emhfrc84BJdmVGg" 
          />
          <div className="overflow-hidden">
            <p className="font-body-md text-body-md font-bold truncate">{adminName || 'Utilisateur'}</p>
            <p className="text-[10px] text-on-surface-variant truncate uppercase font-label-caps">
              {userRole === 'admin' ? 'Administrateur' : 'Agent'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
