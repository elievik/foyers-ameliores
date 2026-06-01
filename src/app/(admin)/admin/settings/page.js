'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileForm, setProfileForm] = useState({
    prenom: '',
    nom: '',
    email: ''
  });
  const [notifications, setNotifications] = useState({
    newOrders: true,
    stockAlerts: true,
    regionalReports: true
  });

  // Load saved profile from localStorage when component mounts
  useEffect(() => {
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      setProfileForm(JSON.parse(savedProfile));
    }
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleSaveProfile = () => {
    // Save to localStorage
    localStorage.setItem('adminProfile', JSON.stringify(profileForm));
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    // Also update the login email if changed
    if (profileForm.email) {
      localStorage.setItem('adminEmail', profileForm.email);
    }
    // Dispatch custom event to update sidebar
    window.dispatchEvent(new CustomEvent('profileUpdated'));
    alert('Profil et préférences sauvegardés !');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    // Get current stored password
    const currentStoredPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    // Check if current password matches
    if (passwordForm.currentPassword !== currentStoredPassword) {
      alert('Mot de passe actuel incorrect !');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    // Save new password
    localStorage.setItem('adminPassword', passwordForm.newPassword);
    alert('Mot de passe mis à jour avec succès');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Configuration Système</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Paramètres</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez votre profil, vos préférences de notification et la sécurité de votre compte admin.</p>
        </div>
        <button onClick={handleSaveProfile} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
          <span className="material-symbols-outlined">save</span>
          Enregistrer les changements
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-bold rounded-xl text-left transition-colors">
              <span className="material-symbols-outlined">person</span>
              Mon Profil
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl text-left transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl text-left transition-colors">
              <span className="material-symbols-outlined">security</span>
              Sécurité & Mot de passe
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl text-left transition-colors">
              <span className="material-symbols-outlined">language</span>
              Langue & Région
            </button>
            <div className="h-px bg-outline-variant/20 my-2"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 rounded-xl text-left transition-colors font-bold">
              <span className="material-symbols-outlined">logout</span>
              Déconnexion
            </button>
          </div>

          <div className="bg-secondary-container/10 border border-secondary/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary">verified_user</span>
              <h4 className="font-bold text-secondary">Support Admin</h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Besoin d'aide avec l'outil de gestion ? Contactez l'équipe technique pour toute assistance sur le panneau d'administration.
            </p>
            <button className="w-full py-2 bg-secondary text-white rounded-lg text-xs font-bold hover:brightness-110 transition-all">
              Contacter le Support
            </button>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-8 space-y-gutter">
          {/* Profile Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-8 border-b border-outline-variant/10">
              <h3 className="font-headline-sm text-headline-sm text-primary">Informations de Profil</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden relative shadow-md">
                    <Image 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn0IG8WnAAMCvaxYtTqN4KpAE7LVaPkE9ASyBdQbLK6kBeX3Ihn6X9D41qrMnoSDUgftYOMN6WLTYsduTEa2LrG7AdWuE_Q0o-83ZJJH587CTC0Phj04bY08DTBpW8mwrl2FDaTja9xDkoPo7CVSp2ifv7Qh31AT1qCKOGUJMmZA9Lz4eLEgNLJbISAC635X1adqTDNzGnhasXUEvjgPtb-nkUhd6IbPY1fpaPf66J_vg6vKKuwbUZ5uKJ7S5Emhfrc84BJdmVGg" 
                      fill
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Prénom</label>
                      <input 
                        className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                        type="text" 
                        value={profileForm.prenom}
                        onChange={(e) => setProfileForm({...profileForm, prenom: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nom</label>
                      <input 
                        className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                        type="text" 
                        value={profileForm.nom}
                        onChange={(e) => setProfileForm({...profileForm, nom: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Adresse Email</label>
                    <input 
                      className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                      type="email" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Rôle & Département</label>
                <div className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-primary text-sm">badge</span>
                  <span className="text-sm font-medium">Administrateur National - Direction Générale</span>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-8 border-b border-outline-variant/10">
              <h3 className="font-headline-sm text-headline-sm text-primary">Préférences de Notification</h3>
            </div>
            <div className="p-8 space-y-6">
              {[
                { title: 'Nouvelles commandes', desc: 'Recevoir une notification pour chaque nouvelle commande validée.', icon: 'shopping_cart', key: 'newOrders' },
                { title: 'Alertes de stock', desc: 'Être prévenu lorsque le stock d\'un modèle descend sous le seuil critique.', icon: 'inventory_2', key: 'stockAlerts' },
                { title: 'Rapports régionaux', desc: 'Notification hebdomadaire lors de la publication des rapports d\'impact.', icon: 'map', key: 'regionalReports' }
              ].map((pref, idx) => (
                <div key={idx} className="flex items-center justify-between gap-6 p-4 rounded-2xl hover:bg-surface-container-low/50 transition-colors border border-transparent hover:border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/5 p-3 rounded-xl text-primary">
                      <span className="material-symbols-outlined">{pref.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{pref.title}</p>
                      <p className="text-xs text-on-surface-variant">{pref.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications[pref.key]}
                      onChange={(e) => setNotifications({...notifications, [pref.key]: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Security Section (Brief) */}
          <section className="bg-error/5 rounded-3xl border border-error/10 p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-error/10 p-3 rounded-xl text-error">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Changer le mot de passe</p>
                <p className="text-xs text-on-surface-variant">Dernière modification il y a 3 mois.</p>
              </div>
            </div>
            <button onClick={() => setShowPasswordModal(true)} className="px-6 py-2 border border-error text-error rounded-xl text-xs font-bold hover:bg-error hover:text-white transition-all">
              Mettre à jour
            </button>
          </section>
        </div>
      </div>

      {/* Modal Mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-primary">Changer le mot de passe</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Mot de passe actuel</label>
                  <input 
                    required 
                    type="password" 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Mot de passe actuel" 
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Nouveau mot de passe</label>
                  <input 
                    required 
                    type="password" 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Nouveau mot de passe" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Confirmer le nouveau mot de passe</label>
                  <input 
                    required 
                    type="password" 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Confirmer le nouveau mot de passe" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-lg font-button hover:bg-surface-container-low transition-all">Annuler</button>
                  <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-button hover:brightness-110 transition-all">Mettre à jour</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
