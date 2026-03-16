# Relation Graph 📊

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![Status](https://img.shields.io/badge/status-ready-success)

Visualisation interactive des relations sociales entre individus sous forme de graphe à nœuds.

## 🚀 Fonctionnalités

- **Filtres Avancés** : Recherche par nom, filtrage par genre et type de relation.
- **AI Analyzer** : Module d'analyse structurelle du graphe et accès aux ressources LLM gratuites.
- **Types de Relations Étendus** : 12 types de relations (Ami, Crush, Rivalité, etc.).
- **Graphe Interactif** : Visualisation 2D dynamique avec zoom et physique.
- **Design Premium** : Interface Dark Mode avec effets de flou (Glassmorphism).
- **Légende Sémantique** : Couleurs distinctes pour les types de relations.

## 🛠 Tech Stack

- **Frontend** : React 18, TypeScript, Vite.
- **Visualisation** : `react-force-graph-2d`.
- **Données** : `SheetJS` (xlsx).
- **UI/Styling** : Tailwind CSS, Lucide React, Sonner (Toasts).

## 📦 Installation

1. **Cloner le repo** :
   ```bash
   git clone https://github.com/Adam-Blf/relation_graph.git
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

## 📄 Format des données Excel

Le fichier doit contenir les colonnes suivantes :
- `Source_ID`, `Source_Nom`, `Source_Genre`
- `Target_ID`, `Target_Nom`, `Target_Genre`
- `Type_Relation`

## 👨‍💻 Auteur

**Adam Beloucif**
Visualisation orientée graphes et analyse relationnelle.
