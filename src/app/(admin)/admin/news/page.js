'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNews() {
  const router = useRouter();
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [newsForm, setNewsForm] = useState({});
  const [reportForm, setReportForm] = useState({});

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);
  
  const [newsList, setNewsList] = useState([]);
  
  // Fetch news from backend on component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/news');
        if (res.ok) {
          const data = await res.json();
          setNewsList(data);
        }
      } catch (error) {
        console.error('Erreur chargement des actualités:', error);
      }
    };
    fetchNews();
  }, []);

  const handleDeleteArticle = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/news/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setNewsList(newsList.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleEditArticle = (item) => {
    alert(`Éditer l'article : ${item.title}`);
    // Ici, tu peux ouvrir le formulaire avec les données pré-remplies
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newsForm,
          date: newsForm.date || new Date().toISOString().split('T')[0],
        }),
      });
      if (res.ok) {
        const newArticle = await res.json();
        setNewsList([...newsList, newArticle]);
        alert('Article enregistré avec succès !');
        setShowNewsForm(false);
        setNewsForm({});
      }
    } catch (error) {
      console.error('Erreur enregistrement:', error);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportForm),
      });
      if (res.ok) {
        alert('Rapport enregistré avec succès !');
        setShowReportForm(false);
        setReportForm({});
      }
    } catch (error) {
      console.error('Erreur enregistrement rapport:', error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion du contenu</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Actualités</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez les articles, rapports d'impact et témoignages publiés sur le site.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowReportForm(true)} className="flex items-center gap-2 px-6 py-3 bg-surface-container text-primary rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
            <span className="material-symbols-outlined">description</span>
            Nouveau Rapport
          </button>
          <button onClick={() => setShowNewsForm(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
            <span className="material-symbols-outlined">add</span>
            Nouvel Article
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Rechercher un article..." type="text"/>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Titre de l'article</th>
              <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Région</th>
              <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Date</th>
              <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Statut</th>
              <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {newsList.map((item, idx) => (
              <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-5">
                  <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-on-surface-variant">Par {item.author}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium px-3 py-1 bg-surface-container rounded-full text-on-surface-variant">{item.region}</span>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.status === 'Publié' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditArticle(item)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                    <button onClick={() => handleDeleteArticle(item.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low/20">
          <p className="text-xs text-on-surface-variant">{newsList.length} articles trouvés</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-outline-variant/30 text-xs hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Précédent</button>
            <button className="px-4 py-2 rounded-lg border border-outline-variant/30 text-xs hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Suivant</button>
          </div>
        </div>
      </div>

      {/* Formulaire Nouvel Article */}
      {showNewsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Créer un Nouvel Article</h3>
              <button onClick={() => setShowNewsForm(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleNewsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Titre</label>
                  <input 
                    required 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Titre de l'article"
                    value={newsForm.title || ''}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Région</label>
                  <select 
                    required 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                    value={newsForm.region || ''}
                    onChange={(e) => setNewsForm({...newsForm, region: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Savanes">Savanes</option>
                    <option value="Kara">Kara</option>
                    <option value="Centrale">Centrale</option>
                    <option value="Plateaux">Plateaux</option>
                    <option value="Maritime">Maritime</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Auteur</label>
                  <input 
                    required 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Auteur"
                    value={newsForm.author || ''}
                    onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Statut</label>
                  <select 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                    value={newsForm.status || 'Brouillon'}
                    onChange={(e) => setNewsForm({...newsForm, status: e.target.value})}
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="Publié">Publié</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Contenu</label>
                <textarea 
                  required 
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all h-40" 
                  placeholder="Contenu de l'article..."
                  value={newsForm.content || ''}
                  onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Image</label>
                <div className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  <span className="text-[10px] font-bold uppercase mt-2">Ajouter</span>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowNewsForm(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire Nouveau Rapport */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Créer un Nouveau Rapport</h3>
              <button onClick={() => setShowReportForm(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Titre du Rapport</label>
                <input required className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="Rapport d'impact..." />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Description</label>
                <textarea required className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all h-40" placeholder="Description du rapport..." />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Importer un fichier</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center cursor-pointer hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">cloud_upload</span>
                  <p className="text-sm text-on-surface-variant">Glissez-déposez un fichier ou cliquez pour parcourir</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowReportForm(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
