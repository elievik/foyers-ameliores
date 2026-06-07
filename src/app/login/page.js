'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const bgImageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (bgImageRef.current) {
        const amount = 10;
        const x = (e.clientX / window.innerWidth - 0.5) * amount;
        const y = (e.clientY / window.innerHeight - 0.5) * amount;
        bgImageRef.current.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get stored credentials or use defaults
    const storedEmail = localStorage.getItem('adminEmail') || 'foyer@gmail.com';
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    // Agent credentials mapping
    const agents = {
      'maritime@gmail.com': { pass: 'maritime123', region: 'Maritime' },
      'plateau@gmail.com': { pass: 'plateau123', region: 'Plateaux' },
      'centrale@gmail.com': { pass: 'centrale123', region: 'Centrale' },
      'kara@gmail.com': { pass: 'kara124', region: 'Kara' },
      'savane@gmail.com': { pass: 'kara123', region: 'Savanes' }
    };
    
    // Check credentials
    if (email === storedEmail && password === storedPassword) {
      // Set login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      
      // Save default admin info if not already there
      if (!localStorage.getItem('adminProfile')) {
        localStorage.setItem('adminProfile', JSON.stringify({
          prenom: 'Admin',
          nom: 'Global',
          email: storedEmail
        }));
      } else {
        // Update email in profile if needed
        const existingProfile = JSON.parse(localStorage.getItem('adminProfile'));
        if (existingProfile.email !== storedEmail) {
          localStorage.setItem('adminProfile', JSON.stringify({
            ...existingProfile,
            email: storedEmail
          }));
        }
      }
      // Redirect to admin dashboard
      router.push('/admin');
    } else if (agents[email] && agents[email].pass === password) {
      // Login as Agent
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'agent');
      localStorage.setItem('agentRegion', agents[email].region);
      localStorage.setItem('adminProfile', JSON.stringify({
        prenom: 'Agent',
        nom: agents[email].region,
        email: email
      }));
      router.push('/admin');
    } else {
      alert('Email ou mot de passe incorrect !');
    }
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col items-center justify-center p-margin-mobile relative overflow-hidden">
      {/* Impactful Background Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
        <img 
          ref={bgImageRef}
          alt="Paysage du Togo" 
          className="w-full h-full object-cover scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5dZUB28swNcUtCRNENMnB6rnCrvu2xcXz6GcBCQn1hMAlb6PmvySbY82pQt7-eTJSZIZEOJPxG8ngkY_odU1V9SAtK1URS7iEBdpKZZpdZazkcW9IYabeKR3OKt5QX-JupU1844EReB3zSbPzM-5zRksm7upJlk-NQHQzLXfJbqgWulR-EeDqb8ouvhE-EDk6hNjlpZ2UTgiPNAlSbCGXCVtkr1HlKamEjEl8oCHw5VvVeEzRSppVb8XvtDxYpg2rcFepgMVPOg"
        />
      </div>

      {/* Login Container */}
      <main className="relative z-20 w-full max-w-[480px]">
        {/* Brand Header (Floating above card) */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-surface p-4 rounded-xl shadow-lg mb-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[40px]">cooking</span>
          </div>
          <h1 className="font-headline-sm text-headline-sm text-white drop-shadow-md text-center">Foyers Améliorés Togo</h1>
        </div>

        {/* Login Card */}
        <div className="glass-card organic-shadow rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2 text-2xl font-semibold">Connexion Administrateur</h2>
            <p className="font-body-md text-on-surface-variant">Veuillez entrer vos identifiants pour accéder au panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-[12px] font-semibold text-on-surface-variant uppercase mb-2 ml-1" htmlFor="email">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                <input 
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white rounded-lg transition-all font-body-md outline-none focus:ring-2 focus:ring-primary/10" 
                  id="email" 
                  name="email" 
                  placeholder="admin@foyers-togo.org" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[12px] font-semibold text-on-surface-variant uppercase mb-2 ml-1" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                <input 
                  className="w-full h-14 pl-12 pr-12 bg-surface-container-low border-transparent focus:border-primary focus:bg-white rounded-lg transition-all font-body-md outline-none focus:ring-2 focus:ring-primary/10" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input className="peer h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer" type="checkbox"/>
                </div>
                <span className="font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Se souvenir de moi</span>
              </label>
              <a className="text-[12px] font-semibold text-secondary hover:text-secondary-container transition-colors focus:underline" href="#">Mot de passe oublié ?</a>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full h-14 bg-primary text-white font-semibold rounded-lg shadow-lg hover:shadow-primary/20 active:translate-y-1 active:shadow-none transition-all duration-200 flex items-center justify-center gap-2 group" 
              type="submit"
            >
              Se connecter 
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Secondary Actions */}
          <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-body-md text-on-surface-variant hover:text-primary transition-colors group">
              <span className="material-symbols-outlined text-[18px]">public</span>
              Retour au site public
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-8 text-center text-white/80 text-[12px] font-semibold space-y-2">
          <p>© 2024 Togo Improved Stoves Project. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a className="hover:text-white transition-colors" href="#">Support</a>
            <span className="opacity-30">•</span>
            <a className="hover:text-white transition-colors" href="#">Politique de confidentialité</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
