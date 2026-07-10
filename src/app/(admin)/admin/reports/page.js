'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    file_url: ''
  });

  const fetchReports = async () => {
    const res = await fetch(`${BACKEND_URL}/api/reports/`);
    const data = await res.json();
    setReports(Array.isArray(data) ? data : []);
  };
  
  const safeReports = Array.isArray(reports) ? reports : [];

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    if (formData.file) {
      const compressedFile = await compressImage(formData.file);
      formDataObj.append('file', compressedFile);
    }
    if (formData.file_url) formDataObj.append('file_url', formData.file_url);

    await fetch(`${BACKEND_URL}/api/reports/`, {
        method: 'POST',
        body: formDataObj
      });

    setIsModalOpen(false);
    setEditingReport(null);
    setFormData({ title: '', description: '', file: null, file_url: '' });
    fetchReports();
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      await fetch(`${BACKEND_URL}/api/reports/${id}`, { method: 'DELETE' });
      fetchReports();
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion des Rapports</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Rapports</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez les rapports d'activité et les documents officiels.</p>
        </div>
        <button
          onClick={() => {
            setEditingReport(null);
            setFormData({ title: '', description: '', file: null, file_url: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Ajouter un Rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeReports.map((report) => (
          <div key={report.id} className="glass-card p-6 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-4xl text-primary">description</span>
              <button
                onClick={() => handleDelete(report.id)}
                className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{report.title}</h3>
            <p className="text-body-md text-on-surface-variant mb-4">{report.description}</p>
            {report.file_url && (
              <a
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-secondary font-button hover:underline"
              >
                <span className="material-symbols-outlined">download</span>
                Télécharger
              </a>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-primary">
                  {editingReport ? 'Modifier le Rapport' : 'Ajouter un Rapport'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Titre</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger un fichier</label>
                  <input
                    type="file"
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0], file_url: '' })}
                  />
                </div>
                <div className="text-center text-sm text-on-surface-variant">OU</div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL du fichier</label>
                  <input
                    type="url"
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value, file: null })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-lg font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg font-button bg-primary text-white hover:brightness-110 transition-all"
                  >
                    {editingReport ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}