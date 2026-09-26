# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Guitariste intermédiaire (3–7 ans de pratique) qui joue régulièrement mais tourne en rond. Ses sessions de compo ou d'impro démarrent mal ou finissent par répéter les mêmes patterns. Il cherche une porte d'entrée rapide et concrète — pas une nouvelle méthode à lire.

## Product Purpose
Guitar Flow est un deck de cartes physiques pour guitaristes. Chaque carte propose une contrainte musicale, un point de vue sur le manche, ou un point de départ créatif. Le deck débloque les sessions en moins de 30 secondes : tire une carte, commence. Succès = le guitariste sort de sa zone de confort et crée quelque chose de nouveau.

Le site (guitarflowcards.com) est une page de pré-lancement : il présente le deck et collecte des emails pour prévenir à l'ouverture des ventes.

## Positioning
Un déclencheur, pas une méthode : un objet physique qu'on pioche en 30 secondes, sans écran, au lieu d'un cours à suivre. La créativité passe par la contrainte — une seule idée tirée au hasard parmi toutes, pour contourner la paralysie du choix. Un seul deck de 83 cartes porte deux usages : 48 défis créatifs et 35 positions CAGED recto-verso (intervalles au recto, noms des notes au verso).

## Operating Context
- Le deck se pose sur l'ampli ; on tire une carte avant ou pendant la session, guitare en main.
- Modes de jeu des défis créatifs : **Page blanche** (nouvelle compo), **Transformation** (compo existante), **Hardcore mode** (impro).
- Modes de jeu CAGED : **Transposition** (déplacer), **Prison** (se limiter à une position tirée), **Liaison** (connecter plusieurs positions).
- Le site a deux lectures, « Défis créatifs » et « Système CAGED », qui présentent le même produit — jamais deux produits distincts.

## Capabilities and Constraints
- **Stade :** le deck est produit ; la vente n'est pas encore ouverte.
- **Prix :** 19,10 €.
- **Composition :** 83 cartes — 48 défis créatifs (Contrainte, Structure, Technique, Rythme, Gimmick, Harmonie) + 35 cartes CAGED recto-verso.
- **Formulaire :** inscription email vers `GF_CONFIG.formEndpoint`. *Ouvert :* tant que l'endpoint est vide, le formulaire affiche le succès sans rien envoyer.
- **Mesure :** GTM prévu via `GF_CONFIG.gtmId`. *Ouvert :* identifiant non renseigné.
- **Contact :** salut@guitarflowcards.com. Créateur basé à Lyon.

## Brand Commitments
- Nom : **Guitar Flow**. Domaine : guitarflowcards.com.
- Personnalité : Direct · Créatif · Musicien. Parle d'égal à égal, sans pédagogie condescendante. Le ton est celui d'un guitariste qui conseille un autre guitariste — pas d'un prof, pas d'un coach. Tutoiement.
- Les 6 couleurs de catégories des cartes sont un langage fixe, porté par les cartes elles-mêmes.

## Anti-references
- SaaS générique : hero-metric, cream background, startup vibes, icônes rondes sur fond coloré
- Cours de musique en ligne (Fender Play, JustinGuitar) : côté pédagogique/scolaire, progression en niveaux, ton bienveillant condescendant
- Accessoire guitar-store : catalogue froid, photo de guitare sur fond blanc, fiche technique
- Développement personnel : coaching, mindfulness, "unlock your potential", ton motivationnel générique

## Evidence on Hand
- **Visuels des 83 cartes :** `visuelles-cartes/*.svg`, nommés `CATEGORIE_NOM-DE-CARTE.svg`.
- **Histoire du créateur :** texte à la première personne de la section « Pourquoi Guitar Flow ? » (`WhySection`) — réel.
- **Image de partage :** `assets/og-image.png` (1200×630), composée à partir des vraies cartes.
- **Aucun avis client, aucun témoignage réel.** Les verbatims des composants `Problem` et `SocialProof` (Mathieu, Léa, Antoine, Marc, Laura, Adrien) sont fictifs ; c'est pour ça qu'ils ont été retirés de la page. Ne jamais les réafficher ni en inventer d'autres, pas plus que des chiffres de ventes, d'utilisateurs ou de presse.

## Product Principles
1. **Praticien, pas professeur** — parle comme un guitariste, pas comme un pédagogue. Montrer l'outil en action plutôt qu'expliquer ce qu'il fait.
2. **La carte EST le produit** — les visuels de cartes portent la crédibilité musicale. Ne pas les noyer dans le décor.
3. **Déclencher, pas convaincre** — l'interface doit donner envie de tirer une carte maintenant, pas de lire une FAQ.
4. **Système délibéré** — les 6 couleurs de catégories sont un langage. Les utiliser avec intention, pas comme décoration.
5. **Aller droit au but** — chaque section a une seule idée. Pas de remplissage.

## Accessibility & Inclusion
WCAG AA minimum. Contraste body text vérifié sur fond. Pas d'information portée uniquement par la couleur (les catégories ont aussi des labels texte). Respect de `prefers-reduced-motion`.
