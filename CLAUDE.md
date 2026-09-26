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
0. `tracking.js` (dans `<head>`, vanilla JS) — initialise `window.dataLayer`, mémorise l'attribution (UTM, gclid, fbclid, referrer) en `localStorage`/`sessionStorage`, expose `window.gfTrack(event, params)` et `window.gfAttribution()`, applique `?vision=caged|defis` depuis l'URL, injecte GTM si `GF_CONFIG.gtmId` est renseigné. Doit précéder React : les composants appellent `track()` (wrapper no-op si `gfTrack` est absent).
1. `tweaks-panel.jsx` — composant panneau de réglages flottant (palette, densité, style de carte)
2. `cards.jsx` — composants `MiniCard`, `BigCard`, `HeroCards` pour les visuels de cartes
3. `sections.jsx` — tous les composants de page : `Nav`, `Hero`, `Problem`, `Showcase_*`, `HowTo`, `Categories`, `WhySection`, `FinalCTA`, `Footer`
4. `app.jsx` — point d'entrée, monte `App` dans `#root`, orchestre les tweaks via `useTweaks()`

**Visions du site :** le site a deux lectures, pilotées par `.vision-switch`, un sélecteur à deux segments posé au-dessus de la headline du hero (avec `.vision-arrow`, une flèche croquis qui pointe dessus) — `defis` (défis créatifs) et `caged` (système CAGED). Les deux segments restent visibles côte à côte **volontairement** : un bouton n'affichant qu'un état laissait croire à deux produits distincts. La ligne `.hero__deckline` juste dessous (48 + 35 = 83 cartes) enfonce le clou. L'état vit dans `App`, est persisté en `localStorage` sous `gf:vision`, et est exposé au CSS via `document.body.dataset.vision`. **L'accent orange ne change pas d'une vision à l'autre** — la bascule porte sur le contenu, pas sur la couleur.

Ce qui change entre les deux visions :
- `Hero` permute son `h1` et son sous-titre (« Mets ton jeu à l'épreuve. » / 48 défis créatifs — « Maîtrise ton manche » / 35 positions d'accord)
- `app.jsx` monte `Showcase_contraintes` **ou** `Showcase_CAGED`, jamais les deux — les deux sections portent donc le même `id="solution"` (l'ancre du lien de nav « Le deck »)
- `HowTo` et `Categories` n'affichent plus qu'un seul bloc sur les deux : Créatif en vision `defis`, CAGED en vision `caged`. Leurs grilles reçoivent alors `--single` : le bloc prend **toute la largeur du container** (il était bridé à 780px et laissait ~300px de vide à droite sur grand écran — le bloc paraissait décentré). Pour que la pleine largeur ne rallonge pas les lignes : les trois modes de `HowTo` passent en 3 colonnes dès 900px, et la carte de `Categories` borne sa description à 46ch, pose ses chiffres en bande (`.cat-stat`, filets, pas de tuiles) et grandit son visuel à 200px au-delà de 1024px.

Le reste de la page (`WhySection`, `FinalCTA`, `Footer`) est identique dans les deux visions.

Les deux visions partagent volontairement la **même mise en page** : titres de section alignés à gauche **sans marge au-dessus** (l'ancien `margin-top: 14px` inline, reste des sur-titres supprimés, rendait le haut de section plus grand que le bas), et alternance des fonds `page → alt → page → alt → cta sombre`. `Showcase_CAGED` avait un layout miroir (titre à droite, cartes à droite) qui n'existait que pour alterner avec `Showcase_contraintes` juste au-dessus ; les deux ne coexistant plus, il a été retiré (avec son CSS : `--mirror`, `section__head--right`, `--cardwrap--right`, `eyebrow--mark-rev`). `WhySection` porte `section--alt` pour reprendre l'alternance que `Recap` assurait avant sa suppression.

**Configuration (`window.GF_CONFIG` dans `index.html`) :**
- `formEndpoint` — URL POST JSON qui reçoit `{ email, location, page, first, last, vision }`. Vide = le formulaire simule le succès sans rien envoyer.
- `gtmId` — `GTM-XXXXXXX`. GA4, Google Ads et le pixel Meta se configurent **dans GTM**, jamais dans le code.

**Événements dataLayer poussés par le site :** `gf_ready` (vision, source), `vision_switch`, `cta_click` (nav), `lead_submit` (location `hero`|`cta`, vision), `lead_error` (reason), `deck_interact` (deck `showcase`|`categories`). `utm_source`/`utm_campaign`/`utm_content` de la session sont recopiés sur chaque événement.

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
- Le **blog** est commenté dans la nav et le footer — ne pas le réactiver sans reconstruire les pages.
- Les **tweaks** (`TweaksPanel`) sont un outil de design uniquement, pas destinés aux utilisateurs finaux.
- `.section__head` est aligné à gauche sur **tous** les formats (le centrage mobile a été retiré : il créait un axe différent du corps de texte). Exceptions : le CTA final reste centré, et `WhySection` (classe `.why`) se compose sur l'axe central dès 900px — titre centré, texte en une colonne de 68ch centrée sur la page (lignes alignées à gauche). Sous 900px, elle revient à gauche comme le reste.
- **`overflow-x` : sur `<html>` uniquement** (`clip`, repli `hidden`). Ne jamais le remettre sur `<body>` : le body devient alors un conteneur de scroll et la nav `position: sticky` ne colle plus.
- **Typo fluide** : `.h-display`, `.h-section`, `.lead`, `.hero__sub`, `.cta__title` ont un seul `clamp()` continu de 320px à 1440px. Ne pas rajouter de `font-size` par breakpoint dessus — c'est ce qui bloquait la tablette à la taille mobile.
- **Champs de formulaire à 16px minimum** : en dessous, iOS zoome la page au focus.
- **Decks (`ShowcaseCardDeck`, `CatCard`)** : `useSwipe()` (pointer events, `touch-action: pan-y`) + flèches `.deck-arrow` (40px, 44px en pointeur grossier) + reveal des cartes de catégorie au `:focus-within` en plus du `:hover`.
- Les ancres tiennent compte de la nav via `scroll-padding-top: 84px` sur `<html>`.
- **Herodeck** : `HERO_ROUNDS = 12` → 48 cartes (au lieu de 96) pour diviser par deux les requêtes SVG au chargement. Le tressage CI → non-CAGED → CN → non-CAGED est inchangé.
- React est chargé en **build production** (`*.production.min.js`, hash SRI à recalculer si la version change : `curl -sL URL | openssl dgst -sha384 -binary | base64`).
- **Échelle de padding vertical** : `.section` suit 96px (desktop) → 80px (≤1024) → 56px (≤768) → 44px (≤480). Elle doit rester **décroissante** — elle a été inversée pendant un temps (desktop plus serré que la tablette).
- **Grilles et `min-width: 0`** : `.hero__inner > *` porte `min-width: 0`. Sans lui, la colonne `1fr` adopte le min-content du champ email (~389px, la largeur intrinsèque de l'`<input>` plus le bouton) et déborde sous ~420px — silencieusement, car `.hero` a `overflow: hidden`. Même piège pour toute grille contenant un champ de formulaire.
- Sous 480px, `.field` s'empile (input au-dessus, bouton pleine largeur) : sur une ligne le bouton sortait de l'écran.
- Le port local peut varier si 8080 est occupé (ex: `http://127.0.0.1:56276`). Vérifier la sortie de `npx live-server`.
- **Gouttière et nav en variables** : `--gutter` (64 → 40 → 20 → 16px) et `--nav-h` (68 → 52px) sont redéfinies par breakpoint sur `:root`. `.container` en dérive son padding (avec `env(safe-area-inset-*)` pour l'encoche iPhone en paysage, `viewport-fit=cover` étant actif) et `scroll-padding-top` vaut `--nav-h + 1px` : une ancre s'arrête pile sous la nav.
- **Bande de couleur des cartes** (`.usage-panel`, `.cat-card`) : la couleur arrive par la variable `--cat` (inline JSX), rendue en `border-top` 1px + `box-shadow: inset 0 2px 0`. Ne pas revenir à un `border-top: 3px` : sur un coin arrondi il s'effile en biseau.
- **`.hero__deckline`** s'aligne sur le texte du premier segment via `--vs-pad` (padding horizontal des segments) : `padding-left: calc(5.5px + var(--vs-pad))`. Changer le padding des segments = changer `--vs-pad`, jamais le padding directement.
- **Repli `aspect-ratio`** (Safari < 15) en fin de `styles.css` : sans lui, les piles de cartes s'effondrent à 0px.
- **Partage et icônes** : `assets/og-image.png` (1200×630, généré depuis les vraies cartes) et `apple-touch-icon.png` (180×180). `<meta name="color-scheme" content="light only">` bloque le mode sombre forcé de Chrome Android / Samsung Internet.
- La **favicon** est `favicon.svg` — un carré orange arrondi (#E89B5A) reproduisant le picto du logo.
- `WhySection` se place juste avant `FinalCTA` dans `app.jsx` et expose son composant via `window.WhySection`.
