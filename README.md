# ⚔️ Throne & Liberty — Boss Watch & Discord Suite

Application web interactive pour le suivi des apparitions de boss, la rotation T4 (cycle de 14 jours), les alertes en direct et l'automatisation d'annonces Discord enrichies (Embeds HD).

## ✨ Fonctionnalités Principales

- **Calendrier des Boss & Archbosses** : Vue journalière et planning synthétique sur 2 semaines (rotation T4).
- **Fuseaux Horaires & Décomptes** : Conversion automatique à l'heure locale et compte à rebours dynamique jusqu'au prochain spawn.
- **Cycle Jour / Nuit** : Indicateur en temps réel de la phase en cours dans le jeu.
- **Filtres Avancés** : PvE (Peace), PvP / Conflit, Archbosses uniquement, et recherche instantanée par nom.
- **Outil d'Annonces Discord (Webhooks)** :
  - Publication du planning Archboss de la quinzaine avec visuels HD nets (sans compression floue).
  - Alerte instantanée pour le prochain Archboss avec décompte temps réel `<t:TIMESTAMP:R>`.
  - Mentions configurables (`@everyone`, `@here`, rôle personnalisé ou sans mention).

## 🚀 Utilisation Locale

Ouvrez simplement `index.html` dans n'importe quel navigateur moderne :

```bash
# Ou avec un serveur local (ex: Live Server ou npx serve) :
npx serve .
```

## 📁 Structure du Projet

- `index.html` : Interface principale, vue calendrier et panneau Discord
- `styles.css` : Design sombre moderne, responsive et animations
- `boss-data.js` : Catalogue complet des boss, métadonnées et calendrier des rotations T4
- `boss-calendar.js` : Moteur de calcul des apparitions, filtres et interactions Webhooks
- `app.js` : Gestion des horloges en direct, modals et recherche
- `discord-automation.js` : Script autonome Node.js pour alertes et intégrations programmées
