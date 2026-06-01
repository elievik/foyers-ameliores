'use client';

import { useState, useEffect } from 'react';

export default function AdminProductImages() {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    product_name: 'Foyer Himalayen',
    img_url: '',
    file: null,
    order: 0,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/product-images/');
    const data = await res.json();
    setImages(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('product_name', formData.product_name);
    formDataObj.append('order', formData.order.toString());
    if (formData.file) {
      formDataObj.append('file', formData.file);
    }
    if (formData.img_url) {
      formDataObj.append('img_url', formData.img_url);
    }

    const url = editingImage
      ? `http://127.0.0.1:8000/api/product-images/${editingImage.id}`
      : 'http://127.0.0.1:8000/api/product-images/';
    const method = editingImage ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      body: formDataObj,
    });

    setIsModalOpen(false);
    setEditingImage(null);
    setFormData({
      product_name: 'Foyer Himalayen',
      img_url: '',
      file: null,
      order: 0,
    });
    fetchImages();
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      product_name: image.product_name,
      img_url: image.img_url,
      file: null,
      order: image.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image?')) {
      await fetch(`http://127.0.0.1:8000/api/product-images/${id}`, { method: 'DELETE' });
      fetchImages();
    }
  };

  const himalayenImages = images.filter(i => i.product_name === 'Foyer Himalayen');
  const asutoImages = images.filter(i => i.product_name === 'Foyer Asuto');

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Galerie Produits</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Images des Foyers</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Ajoutez des images pour les carrousels des produits sur le catalogue.</p>
        </div>
        <button
          onClick={() => {
            setEditingImage(null);
            setFormData({
              product_name: 'Foyer Himalayen',
              img_url: '',
              file: null,
              order: 0,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_photo_alternate</span>Ajouter une Image
        </button>
      </div>

      {/* Foyer Himalayen */}
      <div className="mb-12">
        <h3 className="font-headline-md text-headline-md text-primary mb-6">Foyer Himalayen</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {himalayenImages.map((image) => (
            <ImageCard key={image.id} image={image} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Foyer Asuto */}
      <div>
        <h3 className="font-headline-md text-headline-md text-secondary mb-6">Foyer Asuto</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {asutoImages.map((image) => (
            <ImageCard key={image.id} image={image} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">
              {editingImage ? 'Modifier l\'Image' : 'Ajouter une Image'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Produit</label>
                <select
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                >
                  <option value="Foyer Himalayen">Foyer Himalayen</option>
                  <option value="Foyer Asuto">Foyer Asuto</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger une image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0], img_url: '' })}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL de l'image</label>
                <input
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  value={formData.img_url}
                  onChange={(e) => setFormData({ ...formData, img_url: e.target.value, file: null })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ordre d'affichage</label>
                <input
                  type="number"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-button bg-primary text-white hover:brightness-110 transition-all"
                >
                  {editingImage ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageCard({ image, onEdit, onDelete }) {
  const fullUrl = image.img_url.startsWith('http') ? image.img_url : `http://127.0.0.1:8000${image.img_url}`;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden relative group">
      <img src={fullUrl} alt="" className="w-full aspect-square object-cover" />
      <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button onClick={() => onEdit(image)} className="p-2 bg-white rounded-full text-primary hover:scale-110">
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>
        <button onClick={() => onDelete(image.id)} className="p-2 bg-white rounded-full text-error hover:scale-110">
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </div>
  );
}
