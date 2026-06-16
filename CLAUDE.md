# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev local

```bash
npx live-server
# Démarre un serveur avec hot-reload sur http://127.0.0.1:8080
```

## Déploiement

Le site est hébergé sur **Vercel**, connecté au repo GitHub `rbeccat-stack/guitarflow`. Tout push sur `main` déclenche un déploiement automatique.

Workflow standard :
```bash
git add -A
git commit -m "feat: ..."
git push origin main
```

Travailler **directement sur `main`**, pas de branches feature.

## Architecture

Pas de build step. Le site est du HTML statique avec React compilé côté client via Babel Standalone (CDN). Les fichiers `.jsx` sont chargés comme `type="text/babel"` dans `index.html`.

**Ordre de chargement des scripts dans `index.html` :**
1. `tweaks-panel.jsx` — composant panneau de réglages flottant (palette, densité, style de carte)
2. `cards.jsx` — composants `MiniCard`, `BigCard`, `HeroCards` pour les visuels de cartes
3. `sections.jsx` — tous les composants de page : `Nav`, `Hero`, `Problem`, `Showcase_*`, `HowTo`, `Categories`, `Recap`, `WhySection`, `FinalCTA`, `Footer`
4. `app.jsx` — point d'entrée, monte `App` dans `#root`, orchestre les tweaks via `useTweaks()`

**CSS :**
- `colors_and_type.css` — design tokens (couleurs, typo, spacing, ombres)
- `styles.css` — tous les styles de composants + media queries responsive en fin de fichier
- `blog.css` — styles du blog (inactif)

**Visuels cartes :** SVG dans `visuelles-cartes/`, nommés `CATEGORIE_NOM-DE-CARTE.svg`. Deux catégories principales : `CAGED-INTERVALLES`, `CAGED-NOTES`, `CONTRAINTE`, `RYTHME`, `HARMONIE`, `GIMMICK`.

## Règles projet

- Toujours travailler sur la branche `main`, ne jamais créer de nouvelle branche
- Le site est responsive : mobile (375px), tablette (768px), desktop (1024px+) — toute modification CSS doit respecter ces breakpoints
- Ne pas modifier `visuelles-cartes/` sauf demande explicite

## Points d'attention

- Les **inline styles JSX** (`style={{ textAlign: "left" }}`) ont priorité sur les classes CSS. Pour surcharger via media query, utiliser `!important`.
- Le **herodeck** utilise des `position: absolute` avec des translations en px (`±150px` sur desktop). Sur mobile, les cartes latérales sont masquées (`display: none`) pour éviter le débordement.
- Le **blog** est commenté dans la nav et le footer — ne pas le réactiver sans reconstruire les pages.
- Les **tweaks** (`TweaksPanel`) sont un outil de design uniquement, pas destinés aux utilisateurs finaux.
- Sur mobile, `.section__head` est forcé en `text-align: center !important` — utiliser `!important` pour surcharger si nécessaire.
- Le port local peut varier si 8080 est occupé (ex: `http://127.0.0.1:56276`). Vérifier la sortie de `npx live-server`.
- La **favicon** est `favicon.svg` — un carré orange arrondi (#E89B5A) reproduisant le picto du logo.
- `WhySection` se place juste avant `FinalCTA` dans `app.jsx` et expose son composant via `window.WhySection`.
