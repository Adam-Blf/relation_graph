#  Mapy - Social Visualizer (Apple Edition)

<!-- adam-badges:start -->
[![commits](https://img.shields.io/github/commit-activity/t/Adam-Blf/relation_graph?color=001329&label=commits&style=flat-square)](https://github.com/Adam-Blf/relation_graph/commits) [![visites](https://hits.sh/github.com/Adam-Blf/relation_graph.svg?style=flat-square&label=visites&color=001329)](https://hits.sh/github.com/Adam-Blf/relation_graph/) [![last commit](https://img.shields.io/github/last-commit/Adam-Blf/relation_graph?color=D4A437&style=flat-square&label=dernier%20push)](https://github.com/Adam-Blf/relation_graph/commits) [![top language](https://img.shields.io/github/languages/top/Adam-Blf/relation_graph?style=flat-square)](https://github.com/Adam-Blf/relation_graph) [![license](https://img.shields.io/github/license/Adam-Blf/relation_graph?style=flat-square&color=D4A437)](LICENSE)
<!-- adam-badges:end -->


![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-green)

Mapy est un visualiseur de relations sociales 3D haute performance, conçu avec l'esthétique et la fluidité d'Apple.

## Architecture

```mermaid
flowchart TB
    EL["electron/main.cjs<br/>fenêtre desktop · build portable .exe"]
    APP["src/App.tsx<br/>React 18 · Vite · état global"]
    FORMS["AddPersonForm · AddRelationForm<br/>saisie individus · relations"]
    FILTER["FilterPanel<br/>filtres réseau"]
    AI["AIAnalysisSection<br/>clusters · leaders du réseau"]
    PATH["utils/pathfinding<br/>plus court chemin social"]
    GRAPH["react-force-graph 2D/3D<br/>Three.js · rendu immersif"]
    XLSX["xlsx<br/>import / export Excel"]

    EL --> APP
    APP --> FORMS
    APP --> FILTER --> GRAPH
    APP --> GRAPH
    APP --> AI
    APP --> PATH
    APP --> XLSX
```

## 🚀 Fonctionnalités v0.6.0

- **Design Apple** : Interface minimaliste, Liquid Glass UI, typographie San Francisco.
- **Visualisation 2D/3D** : Basculez instantanément entre un graphe 2D précis et une expérience 3D immersive.
- **Import/Export Excel** : Gérez vos données via des fichiers Excel compatibles.
- **Social Pathfinding** : Trouvez le chemin le plus court entre deux individus.
- **Intelligence Artificielle** : Analyse automatique des clusters et des leaders du réseau.
- **Snapshot Premium** : Capturez votre graphe en haute résolution.

## 🛠️ Installation & Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement (Vite)
npm run dev

# Démarrage de l'application Electron
npm run electron:dev

# Build de l'exécutable portable (.exe)
npm run electron:build
```

## 🎨 Conception

Conçu par **Adam Beloucif** pour offrir une expérience utilisateur fluide et premium.
- Basé sur `React`, `Three.js` et `Vite`.
- Styles via `TailwindCSS` (Custom Apple Tokens).
- Icônes `Lucide React`.

---
© 2024 Adam Beloucif. Tous droits réservés.


---

<p align="center">
  <sub>Par <a href="https://adam.beloucif.com">Adam Beloucif</a> · Data Engineer & Fullstack Developer · <a href="https://github.com/Adam-Blf">GitHub</a> · <a href="https://www.linkedin.com/in/adambeloucif/">LinkedIn</a></sub>
</p>