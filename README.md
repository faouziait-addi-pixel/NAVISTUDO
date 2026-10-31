# NaviStudo 🎓

NaviStudo est une application web d’orientation scolaire et universitaire destinée aux élèves du secondaire. Elle aide chaque utilisateur à identifier des parcours éducatifs, des filières et des spécialités adaptées à son profil.

L’application propose un parcours guidé, des recommandations personnalisées et une exploration des spécialités, avec une interface disponible en français, anglais et arabe.

## Fonctionnalités

- Questionnaire d’orientation personnalisé.
- Recommandations de filières et de spécialités universitaires.
- Exploration détaillée des spécialités disponibles.
- Consultation des résultats et des analyses précédentes.
- Création de compte, connexion et accès anonyme.
- Sauvegarde des analyses et des préférences utilisateur.
- Ajout et gestion de spécialités favorites.
- Synchronisation des données avec Firebase/Firestore pour les utilisateurs connectés.
- Persistance locale des réponses, recommandations et favoris via `localStorage`.
- Interface multilingue : français, anglais et arabe, avec prise en charge RTL pour l’arabe.
- Formulaire de feedback intégré.
- Mode de secours local lorsque l’API distante n’est pas disponible.

## Stack technique

- **React 19** et **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Firebase Authentication** et **Firestore**
- **API backend** pour les recommandations
- **Google GenAI** pour les fonctionnalités d’intelligence artificielle côté serveur
- **Lucide React** pour les icônes
- **Motion** pour les animations
- **Vitest** pour les tests

## Prérequis

- Node.js 18 ou une version ultérieure
- npm, pnpm, yarn ou Bun
- Un projet Firebase configuré si l’authentification et la synchronisation Firestore sont utilisées
- Une API backend NaviStudo accessible pour les recommandations distantes

## Installation

Clonez le dépôt puis installez les dépendances :

```bash
git clone https://github.com/faouziait-addi-pixel/NAVISTUDO.git
cd NAVISTUDO
npm install
```

Avec Bun :

```bash
bun install
```

## Configuration

Copiez le fichier d’exemple des variables d’environnement :

```bash
cp .env.example .env
```

Puis renseignez les valeurs nécessaires dans `.env` :

```dotenv
VITE_API_URL=https://navistudo-backend.onrender.com
VITE_FIREBASE_API_KEY=votre_clé_api_firebase
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-projet
VITE_FIREBASE_APP_ID=votre_app_id
```

> Ne commitez jamais un fichier `.env` contenant des secrets. Le fichier `.env.example` sert uniquement de modèle de configuration.

## Démarrage en développement

```bash
npm run dev
```

L’application sera disponible sur l’URL affichée par Vite, généralement :

```text
http://localhost:3000
```

## Scripts disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur de développement Vite sur le port 3000. |
| `npm run build` | Génère la version de production dans `dist/`. |
| `npm run preview` | Sert localement la version de production. |
| `npm run lint` | Vérifie le typage TypeScript sans générer de fichiers. |
| `npm test` | Exécute les tests avec Vitest. |
| `npm run clean` | Supprime les artefacts de build et fichiers générés. |

## Structure du projet

```text
.
├── src/
│   ├── components/       # Composants React organisés par fonctionnalité
│   ├── data/             # Données locales, notamment la base des spécialités
│   ├── services/         # API, authentification, Firebase et moteur de recommandations
│   ├── tests/            # Tests unitaires et d’intégration
│   ├── types/            # Types et contrats TypeScript
│   ├── App.tsx           # État global et navigation principale
│   ├── index.css         # Styles globaux
│   └── main.tsx          # Point d’entrée React
├── .env.example          # Exemple de configuration locale
├── firebase-*.json       # Configuration Firebase du projet
├── firestore.rules       # Règles de sécurité Firestore
├── index.html             # Document HTML principal
├── package.json           # Dépendances et scripts
├── tsconfig.json          # Configuration TypeScript
└── vite.config.ts        # Configuration Vite
```

## Parcours utilisateur

1. L’utilisateur arrive sur l’écran d’accueil.
2. Il choisit éventuellement une langue et démarre le questionnaire.
3. Il renseigne son niveau scolaire, ses matières, ses centres d’intérêt et ses priorités.
4. NaviStudo génère une liste de recommandations personnalisées.
5. L’utilisateur peut consulter le détail des spécialités, les ajouter à ses favoris et explorer d’autres parcours.
6. Un utilisateur connecté peut sauvegarder son analyse et retrouver ses données depuis son profil.

## Backend Integration

When the backend is available and correctly configured, the frontend can communicate with it through HTTP API requests.

The second-version backend is being developed in the [fifimamy/navistudo-backend repository](https://github.com/fifimamy/navistudo-backend), with database development currently underway.

The recommendation endpoint is:

```http
POST /api/v1/recommendations
```

Requests that require authentication must include a valid Firebase ID token in the authorization header:

```http
Authorization: ******
```

If backend communication fails or the required integration is unavailable, certain workflows may rely on the frontend’s existing client-side functionality instead.

The behavior depends on the current implementation and configuration. Backend and frontend responses, academic identifiers, and data structures must remain compatible to ensure consistent recommendations.

## Current Development Status

NaviStudo is an evolving project. Its frontend and backend are maintained separately, with some client-side functionality currently serving as a fallback for backend-dependent workflows.

Ongoing development focuses on improving frontend-backend integration, resolving inconsistencies, validating the academic knowledge base, and making recommendations more reliable and relevant to Algeria’s education system.

The platform is intended to support students in exploring academic options, not replace official academic guidance.

## Team

NaviStudo was developed collaboratively by the following team members:

- **Oulfa Bouazdia — Project Lead & Backend Developer:** Led project planning and product definition, developed the backend, and worked on the AI-assisted recommendation workflow and system integration.
- **Faouzi Ait Addi — Frontend Developer:** Developed the user interface and implemented the client-side application functionality.
- **Anfal M’siouri — Knowledge Base Developer:** Built and organized the academic knowledge base used to support academic guidance and recommendations.
- **Mouna Benouda — Testing & Validation:** Tested the application, checked key workflows, and helped verify its behavior.

Each team member contributed to developing NaviStudo as a platform designed to make academic guidance more accessible to Algerian students.

## Tests et qualité

Avant de contribuer, vérifiez le projet avec :

```bash
npm run lint
npm test
npm run build
```

Les tests couvrent notamment les appels API, la construction des données du questionnaire et le moteur de recommandations.

## Déploiement

Construisez l’application pour la production :

```bash
npm run build
```

Le dossier `dist/` peut ensuite être déployé sur une plateforme compatible avec les applications frontend statiques, comme Firebase Hosting, Vercel, Netlify ou GitHub Pages.

Assurez-vous de configurer les variables `VITE_*` dans les paramètres d’environnement de la plateforme de déploiement.

## Sécurité et confidentialité

- Les données sensibles ne doivent pas être stockées dans le dépôt.
- Les règles Firestore doivent être vérifiées avant toute mise en production.
- La déconnexion réinitialise les réponses, recommandations et favoris conservés localement.
- Les clés publiques Firebase doivent être protégées par une configuration Firebase et des règles Firestore correctement définies.

## Contribution

1. Créez une branche dédiée :

   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

2. Développez votre modification.
3. Lancez les vérifications :

   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. Créez une pull request en décrivant clairement les changements réalisés.

## Licence

Aucune licence open source n’est actuellement déclarée pour ce dépôt. Contactez le propriétaire du projet avant toute réutilisation ou redistribution.

## Auteur

Projet **NaviStudo** maintenu par [faouziait-addi-pixel](https://github.com/faouziait-addi-pixel).
