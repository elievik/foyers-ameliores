export default function AdminNews() {
  const news = [
    { title: 'Formation des ambassadeurs à Sokodé', date: '05 Oct 2023', status: 'Publié', region: 'Centrale', author: 'K. Mensah' },
    { title: 'Kpalimé : 1000 foyers distribués', date: '28 Sept 2023', status: 'Brouillon', region: 'Plateaux', author: 'A. Tovo' },
    { title: 'Impact social dans le Nord-Togo', date: '15 Sept 2023', status: 'Publié', region: 'Kara', author: 'L. Ségla' },
    { title: 'Nouveau centre à Dapaong', date: '10 Sept 2023', status: 'Publié', region: 'Savanes', author: 'K. Amégan' },
  ];

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion du contenu</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Actualités</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez les articles, rapports d'impact et témoignages publiés sur le site.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Nouvel Article
        </button>
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
            {news.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-5">
                  <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-on-surface-variant">Par {item.author}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium px-3 py-1 bg-surface-container rounded-full text-on-surface-variant">{item.region}</span>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">{item.date}</td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.status === 'Publié' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                    <button className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low/20">
          <p className="text-xs text-on-surface-variant">4 articles trouvés</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-outline-variant/30 text-xs hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Précédent</button>
            <button className="px-4 py-2 rounded-lg border border-outline-variant/30 text-xs hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Suivant</button>
          </div>
        </div>
      </div>
    </>
  );
}
