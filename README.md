# Site Vitrine Dorothy - Association Martiniquaise

Un site vitrine moderne et professionnel pour l'association Dorothy en Martinique, développé avec Next.js 14, TypeScript et Tailwind CSS.

## 🌟 Fonctionnalités

- **Design moderne et attractif** basé sur les couleurs du logo Dorothy
- **4 catégories de services** : Seniors, REEAP, LAEP (Ti-Ludo), et Jeunesse
- **Animations fluides** avec Framer Motion
- **Responsive design** optimisé pour mobile et desktop
- **Interface intuitive** avec navigation moderne

## 🎨 Palette de Couleurs

- **Orange principal** : #fc7f2b
- **Vert** : #37a599
- **Bleu** : #6271dd
- **Dégradés** pour la section Jeunesse

## 🚀 Technologies Utilisées

- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes modernes

## 📦 Installation et Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Lancer en mode production
npm start
```

## 🏗️ Structure du Projet

```
src/
├── app/                 # Pages Next.js (App Router)
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Page d'accueil
├── components/          # Composants réutilisables
│   ├── Header.tsx      # En-tête avec navigation
│   └── CategoryCard.tsx # Cartes des catégories
├── lib/                # Utilitaires et données
│   ├── data.ts         # Données des catégories
│   └── utils.ts        # Fonctions utilitaires
└── types/              # Définitions TypeScript
    └── index.ts        # Types de l'application
```

## 🎯 Sections du Site

1. **Hero Section** - Présentation dynamique avec statistiques
2. **Services** - 4 cartes interactives pour chaque catégorie
3. **À Propos** - Histoire et mission de l'association
4. **Contact** - Informations de contact avec design moderne

## 📱 Responsive Design

Le site est entièrement responsive et optimisé pour :
- **Mobile** (320px+)
- **Tablette** (768px+)
- **Desktop** (1024px+)

## 🎨 Personnalisation

Les couleurs et contenus peuvent être facilement modifiés dans :
- `src/lib/data.ts` pour les données des catégories
- `src/lib/utils.ts` pour les couleurs du thème
- Tailwind CSS pour les styles personnalisés

## 📄 Licence

© 2025 Association Dorothy - Martinique. Tous droits réservés.
