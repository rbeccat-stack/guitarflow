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
3. `sections.jsx` — tous les composants de page : `Nav`, `Hero`, `Problem`, `Showcase_*`, `HowTo`, `Categories`, `WhySection`, `FinalCTA`, `Footer`
4. `app.jsx` — point d'entrée, monte `App` dans `#root`, orchestre les tweaks via `useTweaks()`

**Visions du site :** le site a deux lectures, pilotées par le bouton `.vision-toggle` en haut à droite de la nav — `defis` (défis créatifs) et `caged` (système CAGED). L'état vit dans `App`, est persisté en `localStorage` sous `gf:vision`, et est exposé au CSS via `document.body.dataset.vision`. **L'accent orange ne change pas d'une vision à l'autre** — la bascule porte sur le contenu, pas sur la couleur.

Ce qui change entre les deux visions :
- `Hero` permute son `h1` et son sous-titre (« Mets ton jeu à l'épreuve. » / 48 défis créatifs — « Maîtrise ton manche » / 35 positions d'accord)
- `app.jsx` monte `Showcase_contraintes` **ou** `Showcase_CAGED`, jamais les deux — les deux sections portent donc le même `id="solution"` (l'ancre du lien de nav « Le deck »)
- `HowTo` et `Categories` n'affichent plus qu'un seul bloc sur les deux : Créatif en vision `defis`, CAGED en vision `caged`. Leurs grilles reçoivent alors `--single`, qui borne la largeur à 780px — la pleine largeur du container étirerait les lignes de texte sans agrandir le visuel de carte (`.cat-stage-wrap` est fixe à 168px).

Le reste de la page (`WhySection`, `FinalCTA`, `Footer`) est identique dans les deux visions.

Les deux visions partagent volontairement la **même mise en page** : titres de section alignés à gauche avec `margin-top: 14px`, et alternance des fonds `page → alt → page → alt → cta sombre`. `Showcase_CAGED` avait un layout miroir (titre à droite, cartes à droite) qui n'existait que pour alterner avec `Showcase_contraintes` juste au-dessus ; les deux ne coexistant plus, il a été retiré (avec son CSS : `--mirror`, `section__head--right`, `--cardwrap--right`, `eyebrow--mark-rev`). `WhySection` porte `section--alt` pour reprendre l'alternance que `Recap` assurait avant sa suppression.

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
