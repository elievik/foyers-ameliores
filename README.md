
# Foyers Améliorés Togo

Site web officiel de l'organisation Foyers Améliorés Togo, dédié à la promotion de foyers écologiques et à la réduction de la déforestation.

## Stack Technique

- **Frontend** : Next.js 16 (App Router, React, Tailwind CSS)
- **Backend** : FastAPI (Python, SQLAlchemy, Pydantic)
- **Base de données** : SQLite (développement) / PostgreSQL (production)
- **Fichiers statiques** : FastAPI StaticFiles pour images/documents

---

## Fonctionnalités Principales

### Frontend Public
- Page d'accueil avec hero banner dynamique
- Catalogue des foyers (Himalayen & Asuto) avec formulaires de commande WhatsApp
- Page À propos avec équipe et partenaires
- Page Régions avec impact géographique
- Page Actualités
- Page Contact avec informations et bureaux régionaux

### Backoffice Admin
- Dashboard avec statistiques et activité récente
- Gestion des actualités
- Gestion des commandes (inscriptions Himalayen, ventes Asuto)
- Gestion des rapports
- Gestion des témoignages (avec upload d'image)
- Gestion de l'équipe (avec upload d'image)
- Gestion des régions (avec upload d'image)
- Gestion des partenaires (avec upload d'image)
- Gestion des bannières hero
- Gestion des informations de contact et bureaux régionaux
- Gestion des images produits

---

## Installation et Développement Local

### Prérequis
- Node.js 18+
- Python 3.9+
- npm ou yarn

### 1. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Créer et activer un environnement virtuel (optionnel mais recommandé)
python3 -m venv venv
source venv/bin/activate  # Sur macOS/Linux
# Ou pour Windows: venv\Scripts\activate

# Installer les dépendances Python
pip install -r requirements.txt

# Initialiser la base de données
python3 init_db.py

# Lancer le serveur backend (recharge automatiquement)
uvicorn main:app --reload
```
- Backend API : http://127.0.0.1:8000
- Documentation Swagger : http://127.0.0.1:8000/docs
- Documentation Redoc : http://127.0.0.1:8000/redoc

### 2. Configuration du Frontend

```bash
# Revenir à la racine du projet (si nécessaire)
cd ..

# Installer les dépendances JavaScript
npm install

# Lancer le serveur Next.js en développement
npm run dev
```
- Frontend : http://localhost:3000

---

## Déploiement

### Déploiement Frontend (Vercel)
Le frontend Next.js peut être déployé en quelques clics sur Vercel :

1. Poussez votre code sur un dépôt GitHub/GitLab/Bitbucket
2. Connectez Vercel à votre dépôt
3. Configurez les variables d'environnement si nécessaire (ex: API URL)
4. Déployez !

Pour la production, assurez-vous que le backend est accessible publiquement et mettez à jour les URLs d'API si nécessaire.

### Déploiement Backend
Il existe plusieurs options pour déployer le backend FastAPI :

#### Option 1 : Vercel (Serverless Functions)
- Voir la [documentation FastAPI sur Vercel](https://fastapi.tiangolo.com/deployment/serverless/)

#### Option 2 : Render / Railway
Ces plateformes proposent un déploiement simple pour des apps Python :
1. Connectez votre dépôt
2. Configurez le runtime Python
3. Configurez la commande de démarrage (ex: `uvicorn main:app --host 0.0.0.0 --port $PORT`)
4. Ajoutez PostgreSQL en base de données de production
5. Déployez !

#### Option 3 : Heroku (ou autres PaaS)
1. Créez un fichier `Procfile` dans `/backend` :
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
2. Configurez les variables d'environnement
3. Déployez !

### Base de Données en Production
Il est fortement recommandé d'utiliser PostgreSQL en production :
1. Créez une instance PostgreSQL sur Render/Railway/AWS RDS/etc.
2. Modifiez `backend/database.py` pour utiliser l'URL de connexion PostgreSQL au lieu de SQLite

---

## Licence
Projet interne à Foyers Améliorés Togo.
