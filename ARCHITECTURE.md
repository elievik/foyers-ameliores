
# Architecture Projet Foyers Améliorés Togo

## Aperçu Général
Ce projet utilise une architecture **frontend/backend séparée** avec :
- **Frontend** : Next.js 16 (React, App Router, Tailwind CSS)
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
│   │   ├── news/page.js         # Page des actualités
│   │   ├── regions/page.js      # Page impact par région
│   │   └── contact/page.js      # Page contact
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.js          # Dashboard admin
│   │       ├── news/page.js     # Gestion des actualités
│   │       ├── orders/page.js   # Gestion des commandes
│   │       ├── reports/page.js  # Gestion des rapports
│   │       ├── testimonials/page.js # Gestion témoignages
│   │       ├── team/page.js     # Gestion équipe
│   │       ├── regions/page.js  # Gestion régions
│   │       ├── partners/page.js # Gestion partenaires
│   │       ├── banners/page.js  # Gestion bannières hero
│   │       ├── contact/page.js  # Gestion info contact
│   │       ├── data/page.js     # Suivi régional
│   │       └── images/page.js   # Gestion images produits
│   └── layout.js
└── components/
    ├── Navbar.js
    ├── Footer.js
    └── AdminSidebar.js
```

### Fonctionnalités clés
- Pages publiques : Accueil, Catalogue, À propos, Actualités, Régions, Contact
- Backoffice complet : Dashboard, Gestion actualités/commandes/rapports/témoignages/équipe/régions/partenaires/bannières/contact/images
- Formulaires de commande/inscription intégrés avec WhatsApp
- Responsive design avec Tailwind CSS
- Navigation dynamique et menu mobile

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
├── init_db.py                 # Initialisation des données
├── foyers.db                  # Base de données SQLite (dev)
└── routers/                   # Routes API
    ├── __init__.py
    ├── news.py
    ├── orders.py
    ├── reports.py
    ├── resellers.py
    ├── team.py
    ├── product_images.py
    ├── testimonials.py
    ├── regions.py
    ├── partners.py
    ├── hero_images.py
    └── contact.py
```

### Endpoints API
| Endpoint                          | Méthode | Description                                       |
|-----------------------------------|---------|---------------------------------------------------|
| `/api/news/`                      | GET     | Récupérer tous les articles                       |
| `/api/news/`                      | POST    | Créer un article (avec upload image)              |
| `/api/news/id/{id}`               | GET     | Récupérer article par ID                          |
| `/api/news/slug/{slug}`           | GET     | Récupérer article par slug                        |
| `/api/news/{id}`                  | PATCH   | Mettre à jour article                             |
| `/api/news/{id}`                  | DELETE  | Supprimer article                                 |
| `/api/orders/himalayen`           | GET     | Inscriptions Himalayen                            |
| `/api/orders/himalayen`           | POST    | Nouvelle inscription Himalayen                    |
| `/api/orders/asuto`               | GET     | Ventes Asuto                                      |
| `/api/orders/asuto`               | POST    | Nouvelle vente Asuto                              |
| `/api/reports/`                   | GET     | Récupérer rapports                                |
| `/api/reports/`                   | POST    | Créer rapport (avec upload fichier)               |
| `/api/reports/{id}`               | DELETE  | Supprimer rapport                                 |
| `/api/resellers/`                 | GET     | Demandes revendeurs                               |
| `/api/resellers/`                 | POST    | Nouvelle demande revendeur                        |
| `/api/team/`                      | GET     | Membres équipe                                    |
| `/api/team/`                      | POST    | Ajouter membre équipe (avec upload image)         |
| `/api/team/{id}`                  | PATCH   | Mettre à jour membre                              |
| `/api/team/{id}`                  | DELETE  | Supprimer membre                                  |
| `/api/product-images/`            | GET     | Toutes les images produits                        |
| `/api/product-images/product/{name}` | GET | Images par produit                              |
| `/api/product-images/`            | POST    | Ajouter image produit                             |
| `/api/product-images/{id}`        | PATCH   | Mettre à jour image                               |
| `/api/product-images/{id}`        | DELETE  | Supprimer image                                   |
| `/api/testimonials/`              | GET     | Témoignages                                       |
| `/api/testimonials/`              | POST    | Ajouter témoignage                                |
| `/api/testimonials/{id}`          | PATCH   | Mettre à jour témoignage                          |
| `/api/testimonials/{id}`          | DELETE  | Supprimer témoignage                              |
| `/api/regions/`                   | GET     | Régions                                           |
| `/api/regions/`                   | POST    | Ajouter région                                    |
| `/api/regions/{id}`               | PATCH   | Mettre à jour région                              |
| `/api/regions/{id}`               | DELETE  | Supprimer région                                  |
| `/api/partners/`                  | GET     | Partenaires                                       |
| `/api/partners/`                  | POST    | Ajouter partenaire                                |
| `/api/partners/{id}`              | PATCH   | Mettre à jour partenaire                          |
| `/api/partners/{id}`              | DELETE  | Supprimer partenaire                              |
| `/api/hero-images/`               | GET     | Toutes les bannières hero                         |
| `/api/hero-images/{page}`         | GET     | Bannière par page (home/about)                    |
| `/api/hero-images/`               | POST    | Ajouter bannière                                  |
| `/api/hero-images/{id}`           | PATCH   | Mettre à jour bannière                            |
| `/api/hero-images/{id}`           | DELETE  | Supprimer bannière                                |
| `/api/contact/info`               | GET     | Informations de contact                           |
| `/api/contact/info`               | PUT     | Mettre à jour info contact                        |
| `/api/contact/regional-offices`   | GET     | Bureaux régionaux                                 |
| `/api/contact/regional-offices`   | POST    | Ajouter bureau                                    |
| `/api/contact/regional-offices/{id}` | PATCH | Mettre à jour bureau                          |
| `/api/contact/regional-offices/{id}` | DELETE | Supprimer bureau                            |
| `/api/stats`                      | GET     | Statistiques pour le dashboard admin              |

---

## Connexion Frontend ↔ Backend
### Configuration CORS
Dans `backend/main.py`, on autorise les requêtes depuis le frontend Next.js :
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.0.101:3000",
        "http://192.168.0.102:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
En production, remplacez ces URLs par l'URL publique de votre frontend.

### Exemple d'API call depuis le frontend
```javascript
// Exemple pour récupérer les témoignages
useEffect(() => {
  fetch('/api/testimonials/')
    .then(res => res.json())
    .then(data => setTestimonials(data))
    .catch(err => console.error('Erreur:', err));
}, []);
```

---

## Base de Données
### Modèles
1. `news_articles` : Articles d'actualités
2. `reports` : Rapports
3. `himalayen_inscriptions` : Inscriptions pour le Foyer Himalayen
4. `asuto_sales` : Ventes pour le Foyer Asuto
5. `reseller_requests` : Demandes revendeurs
6. `team_members` : Membres de l'équipe
7. `product_images` : Images des produits
8. `testimonials` : Témoignages
9. `regions` : Régions
10. `partners` : Partenaires
11. `hero_images` : Bannières hero par page
12. `contact_info` : Informations de contact (unique)
13. `regional_offices` : Bureaux régionaux

### Configuration
- **Développement** : SQLite (stockage dans `backend/foyers.db`)
- **Production** : PostgreSQL (modifier `database.py` avec URL de connexion)

---

## Lancement du Projet
Voir README.md pour les instructions complètes.
