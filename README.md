# Relation Graph 📊

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Status](https://img.shields.io/badge/status-ready-success)

Visualisation interactive des relations sociales entre individus sous forme de graphe à nœuds.

## 🚀 Fonctionnalités

- **Graphe Interactif** : Visualisation 2D dynamique avec zoom et physique.
- **Import/Export Excel** : Chargez vos données directement depuis un fichier `.xlsx`.
- **CRUD Complet** : Ajoutez des individus et créez des liens directement dans l'application.
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
