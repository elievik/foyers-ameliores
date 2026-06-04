'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNews() {
  const router = useRouter();
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    region: '',
    author: '',
    status: 'Brouillon',
    featured: 0,
    image_url: '',
    file: null,
    date: ''
  });
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    file_url: '',
    file: null
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [reportsList, setReportsList] = useState([]);
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);
  
  const [newsList, setNewsList] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, reportsRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/reports')
        ]);
        if (newsRes.ok) {
          const data = await newsRes.json();
          setNewsList(data);
        }
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setReportsList(reportsData);
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteArticle = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        const res = await fetch(`/api/news/${id}`, {
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
    setEditingArticle(item);
    setNewsForm({
      title: item.title,
      content: item.content,
      region: item.region,
      author: item.author,
      status: item.status,
      featured: item.featured,
      image_url: item.image_url || '',
      file: null,
      date: item.date
    });
    setShowNewsForm(true);
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newsForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'file') {
        formData.append(key, value);
      }
    });
    if (newsForm.file) {
      formData.append('file', newsForm.file);
    }

    try {
      const url = editingArticle 
        ? `/api/news/${editingArticle.id}`
        : '/api/news';
      const method = editingArticle ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (res.ok) {
        const newArticle = await res.json();
        if (editingArticle) {
          setNewsList(newsList.map(item => item.id === editingArticle.id ? newArticle : item));
        } else {
          setNewsList([...newsList, newArticle]);
        }
        alert('Article enregistré avec succès !');
        setShowNewsForm(false);
        setEditingArticle(null);
        setNewsForm({
          title: '',
          content: '',
          region: '',
          author: '',
          status: 'Brouillon',
          featured: 0,
          image_url: '',
          file: null,
          date: ''
        });
      }
    } catch (error) {
      console.error('Erreur enregistrement:', error);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(reportForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'file') {
        formData.append(key, value);
      }
    });
    if (reportForm.file) {
      formData.append('file', reportForm.file);
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const newReport = await res.json();
        setReportsList([...reportsList, newReport]);
        alert('Rapport enregistré avec succès !');
        setShowReportForm(false);
        setReportForm({
          title: '',
          description: '',
          file_url: '',
          file: null
        });
      }
    } catch (error) {
      console.error('Erreur enregistrement rapport:', error);
    }
  };

  const handleDeleteReport = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce rapport ?')) {
      try {
        const res = await fetch(`/api/reports/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setReportsList(reportsList.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion du contenu</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Actualités</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez les articles et rapports d'impact publiés sur le site.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowReportForm(true)} className="flex items-center gap-2 px-6 py-3 bg-surface-container text-primary rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
            <span className="material-symbols-outlined">description</span>
            Nouveau Rapport
          </button>
          <button onClick={() => {
            setEditingArticle(null);
            setNewsForm({
              title: '',
              content: '',
              region: '',
              author: '',
              status: 'Brouillon',
              featured: 0,
              image_url: '',
              file: null,
              date: ''
            });
            setShowNewsForm(true);
          }} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
            <span className="material-symbols-outlined">add</span>
            Nouvel Article
          </button>
        </div>
      </div>

      {/* Articles */}
      <div className="mb-12">
        <h3 className="font-headline-md text-headline-md text-primary mb-6">Articles</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
              <input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Rechercher un article..." type="text"/>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Titre</th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Région</th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Date</th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Statut</th>
                <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {newsList.map((item) => (
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
        </div>
      </div>

      {/* Rapports */}
      <div>
        <h3 className="font-headline-md text-headline-md text-primary mb-6">Rapports</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Titre</th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Description</th>
                <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {reportsList.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-on-surface-variant line-clamp-2">{item.description}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteReport(item.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire Nouvel Article */}
      {showNewsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">
                {editingArticle ? 'Modifier l\'Article' : 'Créer un Nouvel Article'}
              </h3>
              <button onClick={() => {
                setShowNewsForm(false);
                setEditingArticle(null);
              }} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
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
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Région</label>
                  <select 
                    required 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                    value={newsForm.region}
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
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Statut</label>
                  <select 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({...newsForm, status: e.target.value})}
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="Publié">Publié</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Date</label>
                  <input 
                    type="date"
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({...newsForm, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">À la une</label>
                  <select 
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                    value={newsForm.featured}
                    onChange={(e) => setNewsForm({...newsForm, featured: parseInt(e.target.value)})}
                  >
                    <option value={0}>Non</option>
                    <option value={1}>Oui</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Contenu</label>
                <textarea 
                  required 
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all h-40" 
                  placeholder="Contenu de l'article..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Télécharger une image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all" 
                  onChange={(e) => setNewsForm({...newsForm, file: e.target.files[0], image_url: ''})}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">URL de l'image</label>
                <input 
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all" 
                  value={newsForm.image_url}
                  onChange={(e) => setNewsForm({...newsForm, image_url: e.target.value, file: null})}
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => {
                  setShowNewsForm(false);
                  setEditingArticle(null);
                }} className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire Nouveau Rapport */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
                <input 
                  required 
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Rapport d'impact..."
                  value={reportForm.title}
                  onChange={(e) => setReportForm({...reportForm, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Description</label>
                <textarea 
                  required 
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all h-40" 
                  placeholder="Description du rapport..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Importer un fichier</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all" 
                  onChange={(e) => setReportForm({...reportForm, file: e.target.files[0], file_url: ''})}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">URL du fichier</label>
                <input 
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all" 
                  value={reportForm.file_url}
                  onChange={(e) => setReportForm({...reportForm, file_url: e.target.value, file: null})}
                  placeholder="https://..."
                />
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
