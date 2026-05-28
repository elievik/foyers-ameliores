# Architecture Projet Foyers Améliorés Togo

## Aperçu Général
Ce projet utilise une architecture **frontend/backend séparée** avec :
- **Frontend** : Next.js 15 (React)
- **Backend** : FastAPI (Python)
- **Base de données** : SQLite (développement) / PostgreSQL (production)

---

## Frontend (Next.js)
### Structure
```
src/
├── app/
│   ├── (public)/
│   │   ├── page.js              # Page d'accueil
│   │   ├── catalog/page.js      # Catalogue des foyers
│   │   ├── about/page.js        # Page à propos
│   │   └── news/page.js         # Page des actualités
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.js          # Dashboard admin
│   │       ├── news/page.js     # Gestion des actualités
│   │       └── orders/page.js   # Gestion des commandes
│   ├── login/page.js            # Page de connexion admin
│   └── layout.js
└── components/
    └── Footer.js
```

### Fonctionnalités clés
- Pages publiques : Accueil, Catalogue, À propos, Actualités
- Pages admin protégées : Dashboard, Gestion actualités, Gestion commandes
- Formulaires de commande/inscription intégrés avec WhatsApp
- Responsive design avec Tailwind CSS

---

## Backend (FastAPI)
### Structure
```
backend/
├── main.py                    # Point d'entrée API
├── database.py                # Configuration de la base de données
├── models.py                  # Modèles SQLAlchemy
├── schemas.py                 # Schémas Pydantic (validation)
├── requirements.txt           # Dépendances Python
└── routers/                   # Routes API
    ├── __init__.py
    ├── news.py
    ├── orders.py
    └── reports.py
```

### Endpoints API
| Endpoint               | Méthode | Description                                       |
|------------------------|---------|---------------------------------------------------|
| `/api/news/`           | GET     | Récupérer tous les articles d'actualités         |
| `/api/news/`           | POST    | Créer un nouvel article                          |
| `/api/orders/himalayen`| GET     | Récupérer toutes les inscriptions Himalayen      |
| `/api/orders/himalayen`| POST    | Créer une nouvelle inscription Himalayen         |
| `/api/orders/asuto`    | GET     | Récupérer toutes les ventes Asuto                |
| `/api/orders/asuto`    | POST    | Créer une nouvelle vente Asuto                   |
| `/api/reports/`        | GET     | Récupérer tous les rapports                      |
| `/api/reports/`        | POST    | Créer un nouveau rapport                         |

---

## Connexion Frontend ↔ Backend
### Configuration CORS
Dans `backend/main.py`, on autorise les requêtes depuis le frontend Next.js :
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Exemple d'API call depuis le frontend
Voici comment on envoie les données du formulaire au backend :
```javascript
// Exemple pour enregistrer une inscription Himalayen
const submitHimalayen = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://127.0.0.1:8000/api/orders/himalayen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      // Succès : ouvrir WhatsApp, réinitialiser le formulaire
      openWhatsApp(/* message */);
      setShowHimalayenForm(false);
      setFormData({});
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## Base de Données
### Modèles
1. `news_articles` : Articles d'actualités
2. `reports` : Rapports
3. `himalayen_inscriptions` : Inscriptions pour le Foyer Himalayen
4. `asuto_sales` : Ventes pour le Foyer Asuto

### Configuration
- **Développement** : SQLite (stockage dans `backend/foyers.db`)
- **Production** : PostgreSQL (configurable dans `backend/database.py`)

---

## Lancement du Projet
### 1. Démarrer le Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt  # Si pas déjà fait
uvicorn main:app --reload
```
- Backend disponible sur : http://127.0.0.1:8000
- Documentation API : http://127.0.0.1:8000/docs

### 2. Démarrer le Frontend
```bash
npm install  # Si pas déjà fait
npm run dev
```
- Frontend disponible sur : http://localhost:3000
