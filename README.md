# CamaraDeploy Studio

Plateforme SaaS expérimentale permettant de connecter GitHub, sélectionner des dépôts publics et préparer le déploiement de sites web statiques.

## Architecture

- `client/` : interface React (Vite)
- `server/` : API Node.js / Express
- `server/src/services/` : stockage de démonstration et worker de déploiement
- Le worker construit les projets dans un environnement isolé à configurer. Ne l'exposez pas directement à Internet sans durcissement supplémentaire.

## Prérequis

- Node.js 20+
- Un compte GitHub et une GitHub OAuth App
- Un environnement de build isolé pour les déploiements réels

## Installation locale

```bash
npm install
npm run install:all
cp server/.env.example server/.env
npm run dev
```

Le client démarre sur `http://localhost:5173` et l'API sur `http://localhost:4000`.

## Configuration GitHub OAuth

Dans GitHub > Settings > Developer settings > OAuth Apps, créez une application avec :

- Homepage URL : `http://localhost:5173`
- Authorization callback URL : `http://localhost:4000/api/auth/github/callback`

Ajoutez les identifiants dans `server/.env`. Ne commitez jamais ce fichier.

## Sécurité importante

Cette version est un socle pédagogique, pas un service multi-utilisateur prêt pour la production.

Avant tout déploiement public :
- remplacer le stockage mémoire par une base de données avec isolation par utilisateur ;
- utiliser des cookies `HttpOnly`, `Secure`, `SameSite` et une protection CSRF adaptée ;
- stocker les secrets dans un gestionnaire de secrets ;
- exécuter chaque build dans un conteneur isolé, sans privilèges, avec limites CPU/RAM/temps et réseau restreint ;
- valider strictement les dépôts, branches, chemins et artefacts ;
- ajouter rate limiting, journaux d'audit, surveillance et tests de sécurité.

## Scripts

```bash
npm run dev
npm run build
npm start
```

## Licence

MIT — voir `LICENSE`.
