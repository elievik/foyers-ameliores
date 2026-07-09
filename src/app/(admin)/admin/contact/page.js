'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdminContactPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [regionalOffices, setRegionalOffices] = useState([]);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  
  const [contactFormData, setContactFormData] = useState({
    phone: '',
    email: '',
    whatsapp_number: ''
  });
  
  const [officeFormData, setOfficeFormData] = useState({
    name: '',
    city: '',
    phone: '',
    address: '',
    order: 0,
    img_url: '',
    file: null
  });

  const fetchContactData = async () => {
    try {
      const [infoRes, officesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/contact/info`),
        fetch(`${BACKEND_URL}/api/contact/regional-offices`)
      ]);
      if (infoRes.ok) setContactInfo(await infoRes.json());
      if (officesRes.ok) {
        const data = await officesRes.json();
        setRegionalOffices(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching contact data:', err);
      setRegionalOffices([]);
    }
  };
  
  const safeRegionalOffices = Array.isArray(regionalOffices) ? regionalOffices : [];

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    if (contactFormData.phone) formDataObj.append('phone', contactFormData.phone);
    if (contactFormData.email) formDataObj.append('email', contactFormData.email);
    if (contactFormData.whatsapp_number) formDataObj.append('whatsapp_number', contactFormData.whatsapp_number);

    await fetch(`${BACKEND_URL}/api/contact/info`, {
      method: 'PUT',
      body: formDataObj
    });
    
    setIsEditingContact(false);
    fetchContactData();
  };

  const handleOfficeSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    if (officeFormData.name) formDataObj.append('name', officeFormData.name);
    if (officeFormData.city) formDataObj.append('city', officeFormData.city);
    if (officeFormData.phone) formDataObj.append('phone', officeFormData.phone);
    if (officeFormData.address) formDataObj.append('address', officeFormData.address);
    if (officeFormData.order !== undefined) formDataObj.append('order', officeFormData.order.toString());
    if (officeFormData.img_url) formDataObj.append('img_url', officeFormData.img_url);
    if (officeFormData.file) {
      const compressedFile = await compressImage(officeFormData.file);
      formDataObj.append('file', compressedFile);
    }

    const url = editingOffice
      ? `${BACKEND_URL}/api/contact/regional-offices/${editingOffice.id}`
      : `${BACKEND_URL}/api/contact/regional-offices`;
    const method = editingOffice ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      body: formDataObj
    });
    
    setIsOfficeModalOpen(false);
    setEditingOffice(null);
    setOfficeFormData({
      name: '',
      city: '',
      phone: '',
      address: '',
      order: 0,
      img_url: '',
      file: null
    });
    fetchContactData();
  };

  const handleEditOffice = (office) => {
    setEditingOffice(office);
    setOfficeFormData({
      name: office.name,
      city: office.city,
      phone: office.phone,
      address: office.address,
      order: office.order,
      img_url: office.img_url,
      file: null
    });
    setIsOfficeModalOpen(true);
  };

  const handleDeleteOffice = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bureau régional ?')) {
      await fetch(`${BACKEND_URL}/api/contact/regional-offices/${id}`, { method: 'DELETE' });
      fetchContactData();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion du Contact</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Informations de Contact</h2>
          <p className="text-on-surface-variant mt-2 max-w-2xl">Gérez les informations de contact principales et les bureaux régionaux.</p>
        </div>
        <button
          onClick={() => {
            setEditingOffice(null);
            setOfficeFormData({
              name: '',
              city: '',
              phone: '',
              address: '',
              order: 0,
              img_url: '',
              file: null
            });
            setIsOfficeModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>Ajouter un Bureau
        </button>
      </div>

      {/* Contact Info Section */}
      <section className="glass-card p-8 rounded-2xl border border-outline-variant shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-headline-md text-primary">Informations Principales</h3>
          <button
            onClick={() => {
              if (contactInfo) {
                setContactFormData({
                  phone: contactInfo.phone,
                  email: contactInfo.email,
                  whatsapp_number: contactInfo.whatsapp_number
                });
              }
              setIsEditingContact(!isEditingContact);
            }}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">edit</span>{isEditingContact ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {isEditingContact ? (
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Téléphone</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={contactFormData.phone}
                  onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={contactFormData.email}
                  onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Numéro WhatsApp</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={contactFormData.whatsapp_number}
                  onChange={(e) => setContactFormData({ ...contactFormData, whatsapp_number: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingContact(false)}
                className="flex-1 px-4 py-3 rounded-lg font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg font-button bg-primary text-white hover:brightness-110 transition-all"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Téléphone</p>
                <p className="font-bold text-primary">{contactInfo?.phone}</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Email</p>
                <p className="font-bold text-primary">{contactInfo?.email}</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">WhatsApp</p>
                <p className="font-bold text-primary">{contactInfo?.whatsapp_number}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Regional Offices Section */}
      <section>
        <h3 className="font-headline-md text-headline-md text-primary mb-6">Bureaux Régionaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeRegionalOffices.map((office) => (
            <div key={office.id} className="glass-card p-6 rounded-xl shadow-organic border border-outline-variant/30">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-primary">{office.name}</h4>
                  <p className="text-label-caps text-label-caps text-secondary uppercase">{office.city}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditOffice(office)}
                    className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteOffice(office.id)}
                    className="p-2 rounded-lg text-error hover:bg-error/10 transition-all"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">call</span> {office.phone}
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span> {office.address}
                </p>
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Ordre: {office.order}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Office Modal */}
      {isOfficeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-primary">
                  {editingOffice ? 'Modifier le Bureau' : 'Ajouter un Bureau Régional'}
                </h3>
                <button
                  onClick={() => setIsOfficeModalOpen(false)}
                  className="text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>
              <form onSubmit={handleOfficeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Région</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={officeFormData.name}
                      onChange={(e) => setOfficeFormData({ ...officeFormData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ville</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={officeFormData.city}
                      onChange={(e) => setOfficeFormData({ ...officeFormData, city: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Téléphone</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={officeFormData.phone}
                    onChange={(e) => setOfficeFormData({ ...officeFormData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Adresse</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={officeFormData.address}
                    onChange={(e) => setOfficeFormData({ ...officeFormData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ordre d'affichage</label>
                    <input
                      type="number"
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={officeFormData.order}
                      onChange={(e) => setOfficeFormData({ ...officeFormData, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger une image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                      onChange={(e) => setOfficeFormData({ ...officeFormData, file: e.target.files[0], img_url: '' })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ou URL de l'image</label>
                  <input
                    type="url"
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={officeFormData.img_url}
                    onChange={(e) => setOfficeFormData({ ...officeFormData, img_url: e.target.value, file: null })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOfficeModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-lg font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg font-button bg-primary text-white hover:brightness-110 transition-all"
                  >
                    {editingOffice ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}