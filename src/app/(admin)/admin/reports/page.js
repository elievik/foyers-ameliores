'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState(null);
  const [userRole, setUserRole] = useState('admin');
  const [agentRegion, setAgentRegion] = useState('');
  const [agentName, setAgentName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    file_url: '',
    status: 'Brouillon'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'admin';
    const region = localStorage.getItem('agentRegion') || '';
    const profileStr = localStorage.getItem('adminProfile');
    setUserRole(role);
    setAgentRegion(region);
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      setAgentName(`${profile.prenom || ''} ${profile.nom || ''}`.trim());
    }
  }, []);

  const fetchReports = async () => {
    try {
      let url = `${BACKEND_URL}/api/reports/`;
      if (userRole === 'agent' && agentRegion) {
        url += `?region=${encodeURIComponent(agentRegion)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Backend injoignable, liste de rapports vide en attendant:', err.message);
      setReports([]);
    }
  };

  useEffect(() => {
    if (userRole) fetchReports();
  }, [userRole, agentRegion]);

  const filteredReports = reports.filter(r => {
    if (activeTab === 'brouillon') return r.status === 'Brouillon';
    if (activeTab === 'envoye') return r.status === 'Envoyé';
    return true;
  });

  const handleSubmit = async (e, submitStatus = null) => {
    e.preventDefault();
    const finalStatus = submitStatus || formData.status;
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('status', finalStatus);
    formDataObj.append('region', agentRegion || '');
    if (agentName) formDataObj.append('agent_name', agentName);
    if (formData.file) {
      const compressedFile = await compressImage(formData.file);
      formDataObj.append('file', compressedFile);
    }
    if (formData.file_url) formDataObj.append('file_url', formData.file_url);

    try {
      const url = editingReport
        ? `${BACKEND_URL}/api/reports/${editingReport.id}`
        : `${BACKEND_URL}/api/reports/`;
      const method = editingReport ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, body: formDataObj });
      if (res.ok) {
        showToast(
          finalStatus === 'Envoyé'
            ? "Rapport envoyé à l'administration avec succès !"
            : 'Brouillon enregistré !'
        );
        setIsModalOpen(false);
        setEditingReport(null);
        setFormData({ title: '', description: '', file: null, file_url: '', status: 'Brouillon' });
        fetchReports();
      } else {
        showToast("Erreur lors de l'enregistrement.", 'error');
      }
    } catch (err) {
      showToast('Impossible de contacter le serveur.', 'error');
    }
  };

  const handleSendReport = async (report) => {
    if (!confirm(`Envoyer le rapport "${report.title}" à l'administration ?`)) return;
    try {
      const fd = new FormData();
      fd.append('status', 'Envoyé');
      const res = await fetch(`${BACKEND_URL}/api/reports/${report.id}`, { method: 'PATCH', body: fd });
      if (res.ok) {
        showToast("Rapport envoyé à l'administration !");
        fetchReports();
      }
    } catch (err) {
      showToast("Erreur lors de l'envoi.", 'error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      await fetch(`${BACKEND_URL}/api/reports/${id}`, { method: 'DELETE' });
      fetchReports();
    }
  };

  const openEdit = (report) => {
    setEditingReport(report);
    setFormData({
      title: report.title || '',
      description: report.description || '',
      file: null,
      file_url: report.file_url || '',
      status: report.status || 'Brouillon'
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'Envoyé') return 'bg-green-100 text-green-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const tabCounts = {
    all: reports.length,
    brouillon: reports.filter(r => r.status === 'Brouillon').length,
    envoye: reports.filter(r => r.status === 'Envoyé').length,
  };

  return (
    <>
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-button text-sm transition-all ${
          toast.type === 'error' ? 'bg-error' : 'bg-green-600'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
            {userRole === 'agent' ? `Mes Rapports — ${agentRegion}` : 'Gestion des Rapports'}
          </span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Rapports</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            {userRole === 'agent'
              ? "Rédigez vos rapports d'activité et envoyez-les à l'administration."
              : 'Consultez tous les rapports soumis par les agents et les documents officiels.'
            }
          </p>
        </div>
        {userRole === 'admin' ? (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingReport(null);
                setFormData({ title: '', description: '', file: null, file_url: '', status: 'Brouillon' });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              Nouveau Rapport
            </button>
            <button
              onClick={async () => {
              const rows = [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Titre du Rapport", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Agent", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Région", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Statut", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date de soumission", bold: true })] })] }),
                  ],
                })
              ];
              
              reports.forEach(r => {
                rows.push(new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(r.title)] }),
                    new TableCell({ children: [new Paragraph(r.agent_name || '—')] }),
                    new TableCell({ children: [new Paragraph(r.region || '—')] }),
                    new TableCell({ children: [new Paragraph(r.status)] }),
                    new TableCell({ children: [new Paragraph(new Date(r.created_at).toLocaleDateString())] }),
                  ]
                }));
              });

              const doc = new Document({
                sections: [{
                  properties: {},
                  children: [
                    new Paragraph({
                      text: "Foyers Améliorés Togo",
                      heading: HeadingLevel.HEADING_1,
                      alignment: "center"
                    }),
                    new Paragraph({
                      text: "Rapport Global des Activités",
                      heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Date de génération : ", bold: true }),
                        new TextRun(new Date().toLocaleDateString())
                      ],
                      spacing: { after: 400 }
                    }),
                    new Table({
                      rows: rows,
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                      }
                    }),
                  ],
                }],
              });

              const blob = await Packer.toBlob(doc);
              saveAs(blob, "rapport_final_mensuel.docx");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">download</span>
            Télécharger Rapport Final (Word)
          </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditingReport(null);
              setFormData({ title: '', description: '', file: null, file_url: '', status: 'Brouillon' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Nouveau Rapport
          </button>
        )}
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 bg-surface-container-low p-1.5 rounded-2xl w-fit">
        {[
          { key: 'all', label: 'Tous', icon: 'description' },
          { key: 'brouillon', label: 'Brouillons', icon: 'edit_note' },
          { key: 'envoye', label: 'Envoyés', icon: 'send' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white shadow text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
            }`}>
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">description</span>
          <p className="text-lg font-medium">Aucun rapport dans cette catégorie</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Titre</th>
                {userRole === 'admin' && (
                  <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Agent / Région</th>
                )}
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Description</th>
                <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Statut</th>
                <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-2xl text-primary/50">description</span>
                      <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{report.title}</p>
                    </div>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-black tracking-wider uppercase border ${
                          report.agent_name?.toLowerCase().includes('admin')
                            ? 'bg-secondary/10 text-secondary border-secondary/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {report.agent_name?.toLowerCase().includes('admin') ? 'ADMIN' : 'AGENT'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-on-surface">{report.agent_name || '—'}</p>
                          {report.region && (
                            <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                              {report.region}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-5">
                    <p className="text-sm text-on-surface-variant line-clamp-2 max-w-xs">{report.description}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${getStatusBadge(report.status)}`}>
                      {report.status || 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <button onClick={() => setViewingReport(report)}
                        className="p-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors" title="Visualiser">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button onClick={() => {
                        const content = `Titre: ${report.title}\nAgent: ${report.agent_name || 'Admin'}\nRégion: ${report.region || 'Aucune'}\nDate: ${new Date(report.created_at).toLocaleDateString()}\n\nDescription:\n${report.description || ''}`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Rapport_${report.title.replace(/\s+/g, '_')}.txt`;
                        a.click();
                      }}
                        className="p-2 text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors" title="Télécharger (.txt)">
                        <span className="material-symbols-outlined text-xl">file_download</span>
                      </button>
                      {report.file_url && (
                        <a href={report.file_url} target="_blank" rel="noopener noreferrer"
                          className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors" title="Télécharger">
                          <span className="material-symbols-outlined text-xl">download</span>
                        </a>
                      )}
                      {userRole === 'agent' && report.status === 'Brouillon' && (
                        <>
                          <button onClick={() => openEdit(report)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Modifier">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button onClick={() => handleSendReport(report)}
                            className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-lg text-[10px] font-bold hover:brightness-110 transition-all">
                            <span className="material-symbols-outlined text-sm">send</span>
                            Envoyer
                          </button>
                        </>
                      )}
                      {userRole === 'admin' && (
                        <button onClick={() => openEdit(report)}
                          className="p-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors" title="Modifier">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                      )}
                      {(userRole === 'admin' || report.status === 'Brouillon') && (
                        <button onClick={() => handleDelete(report.id)}
                          className="p-2 text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors" title="Supprimer">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal View */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-primary">{viewingReport.title}</h3>
                <button onClick={() => setViewingReport(null)} className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant font-bold uppercase mb-1">Agent / Région</p>
                    <p className="font-medium text-on-surface">{viewingReport.agent_name || 'Admin'} {viewingReport.region ? `(${viewingReport.region})` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant font-bold uppercase mb-1">Date</p>
                    <p className="font-medium text-on-surface">{new Date(viewingReport.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase mb-2">Description</p>
                  <p className="text-body-md text-on-surface bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10 whitespace-pre-wrap">
                    {viewingReport.description || 'Aucune description fournie.'}
                  </p>
                </div>

                {viewingReport.file_url && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/10">
                    <p className="text-xs text-on-surface-variant font-bold uppercase mb-2">Pièce Jointe</p>
                    <a href={viewingReport.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-lg font-medium hover:bg-secondary/20 transition-colors">
                      <span className="material-symbols-outlined">download</span>
                      Télécharger le fichier joint
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button onClick={() => {
                  const content = `Titre: ${viewingReport.title}\nAgent: ${viewingReport.agent_name || 'Admin'}\nRégion: ${viewingReport.region || 'Aucune'}\nDate: ${new Date(viewingReport.created_at).toLocaleDateString()}\n\nDescription:\n${viewingReport.description || ''}`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Rapport_${viewingReport.title.replace(/\s+/g, '_')}.txt`;
                  a.click();
                }} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined">file_download</span>
                  Télécharger en TXT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit/Create */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">
                    {editingReport ? 'Modifier le Rapport' : 'Nouveau Rapport'}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {userRole === 'agent'
                      ? "Sauvegardez en brouillon ou envoyez directement à l'administration."
                      : 'Créez ou modifiez un rapport officiel.'
                    }
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-lg">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
              <div className="h-px bg-outline-variant/20 my-5" />
              <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Titre *</label>
                    <span className={`text-[10px] font-bold ${formData.title.length > 90 ? 'text-error' : 'text-on-surface-variant'}`}>
                      {formData.title.length}/100
                    </span>
                  </div>
                  <input required maxLength={100}
                    className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Ex: Rapport d'activité — Octobre 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Description *</label>
                  </div>
                  <textarea required rows={15}
                    className="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none leading-relaxed"
                    placeholder="Résumez votre activité, vos ventes, et vos observations en détail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="rounded-xl border-2 border-dashed border-outline-variant/40 p-5 space-y-4 bg-surface-container-low/50">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Document joint (optionnel)</p>
                  <input type="file" accept=".pdf,.doc,.docx,.xlsx,.pptx"
                    className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:text-xs hover:file:bg-primary/20 transition-all"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0], file_url: '' })}
                  />
                  {formData.file && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      {formData.file.name}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-outline-variant/30" />
                    <span className="text-xs text-on-surface-variant font-medium">OU</span>
                    <div className="h-px flex-1 bg-outline-variant/30" />
                  </div>
                  <input type="url"
                    className="w-full bg-white border border-outline-variant/30 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value, file: null })}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button hover:bg-surface-container-high transition-all">
                    Annuler
                  </button>
                  {userRole === 'agent' && (
                    <button type="button" onClick={(e) => handleSubmit(e, 'Brouillon')}
                      className="flex-1 bg-surface-container-highest text-on-surface py-3 rounded-xl font-button transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-base">edit_note</span>
                      Brouillon
                    </button>
                  )}
                  <button type="button"
                    onClick={(e) => handleSubmit(e, userRole === 'agent' ? 'Envoyé' : (formData.status || 'Brouillon'))}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      {userRole === 'agent' ? 'send' : 'save'}
                    </span>
                    {userRole === 'agent' ? "Envoyer à l'admin" : 'Enregistrer'}
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