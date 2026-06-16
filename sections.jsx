/* global React, MiniCard, BigCard, HeroCards */
const { useState: useS, useEffect: useE, useRef: useR } = React;

/* ============== EMAIL FIELD ============== */
function EmailField({ variant = "light", onSuccess }) {
  const [email, setEmail] = useS("");
  const [error, setError] = useS(false);
  const [done, setDone] = useS(false);
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const submit = (e) => {
    e.preventDefault();
    if (!re.test(email.trim())) {setError(true);return;}
    setError(false);setDone(true);onSuccess && onSuccess(email);
  };
  if (done) {
    return (
      <div className="success">
        <span className="success__check">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
        Tu es sur la liste. On te tient au courant.
      </div>);

  }
  return (
    <form className={"field" + (error ? " field--error" : "")} onSubmit={submit}>
      <input
        type="email" inputMode="email" autoComplete="email" required
        value={email}
        onChange={(e) => {setEmail(e.target.value);if (error) setError(false);}}
        placeholder="ton@email.com"
        aria-label="adresse email" />
      
      <button type="submit" className="btn btn--primary btn--lg">Rejoindre la liste</button>
    </form>);

}

/* ============== NAV ============== */
function Nav() {
  const [scrolled, setScrolled] = useS(false);
  useE(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="container nav__inner">
        <a href="#top" className="logo">
          Guitar Flow<span className="logo__sq" aria-hidden="true"></span>Cards
        </a>
        <div className="nav__links">
          <a href="#solution">Le deck</a>
          <a href="#comment">Comment jouer</a>
          <a href="#categories">Catégories</a>
          {/* <a href="Blog.html" className="nav__blog">Blog</a> */}
        </div>
        <a href="#cta" className="btn btn--primary" style={{ backgroundColor: "rgb(18, 17, 16)" }}>Rejoindre la liste</a>
      </div>
    </nav>);

}

/* ============== HERO ============== */
function Hero({ density = "breathing", cardStyle = "illustrated" }) {
  const deckRef = useR(null);
  useE(() => {
    const t = setTimeout(() => deckRef.current && deckRef.current.classList.add("is-fanned"), 220);
    return () => clearTimeout(t);
  }, []);
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="h-display">
            Tire une carte et casse ta routine.
          </h1>
          <p className="lead hero__sub">83 contraintes créatives pour arrêter de tourner en rond et commencer à composer.</p>
          <div className="hero__form-wrap">
            <EmailField variant="light" />
          </div>
        </div>

        <div className="herodeck" ref={deckRef} aria-hidden="true">
          <div className="herodeck__glow"></div>
          <div className="herodeck__slot herodeck__slot--back">
            <img src="visuelles-cartes/CONTRAINTE_HORIZONTAL.svg" alt="Carte CONTRAINTE — HORIZONTAL" className="herocard-img" />
          </div>
          <div className="herodeck__slot herodeck__slot--mid">
            <img src="visuelles-cartes/RYTHME_SYNCOPE-ET-DU-DEUX.svg" alt="Carte RYTHME — Syncope et du deux" className="herocard-img" />
          </div>
          <div className="herodeck__slot herodeck__slot--front">
            <img src="visuelles-cartes/CAGED-INTERVALLES_Em7.svg" alt="Carte CAGED — Em7" className="herocard-img" />
          </div>
        </div>
      </div>
    </section>);}

/* ============== PROBLÈME ============== */
function Problem() {
  const items = [
  { q: "Je m'assois avec ma guitare et je joue les 4 mêmes accords depuis six mois. Je m'en rends compte. Je continue quand même.", who: "Mathieu", initial: "M", age: 29 },
  { q: "J'ai trente fragments enregistrés sur mon tel. Aucun n'est terminé. Je tourne en rond et je le sais.", who: "Léa", initial: "L", age: 33 },
  { q: "Je connais la théorie. Modes, gammes, harmonisation. Mais quand je prends la guitare : rien. Le vide.", who: "Antoine", initial: "A", age: 26 }];

  return (
    <section className="section section--alt" id="probleme">
      <div className="container">
        <div className="section__head">
          <h2 className="h-section" style={{ marginTop: 14 }}>Tu connais tes accords.<br />Mais rien ne sort.</h2>
        </div>
        <div className="problem-grid">
          {items.map((v, i) =>
          <article className="verbatim" key={i}>
              <span className="verbatim__qmark">"</span>
              <p className="verbatim__quote">{v.q}</p>
              <div className="verbatim__author">
                <span className="verbatim__avatar">{v.initial}.</span>
                <div>
                  <div className="verbatim__name">{v.who[0]}. — {v.age} ans</div>
                  <div className="verbatim__src">Guitariste, Reddit</div>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}

/* ============== SHOWCASE CARD DECK ============== */
function ShowcaseCardDeck({ cards }) {
  const [idx, setIdx] = useS(0);
  const n = cards.length;
  const advance = () => setIdx((p) => (p + 1) % n);
  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {e.preventDefault();setIdx((p) => (p + 1) % n);}
    if (e.key === "ArrowLeft") {e.preventDefault();setIdx((p) => (p - 1 + n) % n);}
  };
  return (
    <div className="sc-deck" role="button" tabIndex={0} onClick={advance} onKeyDown={onKey}
    aria-label="Faire défiler les exemples de cartes">
      <div className="sc-deck__stack">
        {cards.map((src, i) => {
          const offset = i - idx;
          const visible = offset === 0 || offset === 1 || offset === -1 || idx === 0 && i === n - 1 || idx === n - 1 && i === 0;
          return (
            <img key={i} src={src} alt="" draggable="false"
            className={"sc-deck__card" + (i === idx ? " is-active" : "")}
            style={i === idx ? {} : { pointerEvents: "none" }} />);

        })}
      </div>
      <div className="sc-deck__dots" aria-hidden="true">
        {cards.map((_, i) => <i key={i} className={i === idx ? "is-on" : ""} onClick={(e) => {e.stopPropagation();setIdx(i);}}></i>)}
      </div>
      <p className="sc-deck__hint">clique pour défiler</p>
    </div>);
}

/* ============== SHOWCASE CONTRAINTES ============== */
function Showcase_contraintes() {
  const cards = [
  "visuelles-cartes/RYTHME_SILENCE-TEMPS-FORT.svg",
  "visuelles-cartes/HARMONIE_AVOID-NOTES.svg",
  "visuelles-cartes/GIMMICK_LINE-CLICHE.svg",
  "visuelles-cartes/CONTRAINTE_HORIZONTAL.svg",
  "visuelles-cartes/TECHNIQUE_VIBRATO.svg"];

  return (
    <section className="section" id="solution">
      <div className="container">
        <div className="section__head" style={{ textAlign: "left", maxWidth: "none" }}>
          <h2 className="h-section">Une contrainte. Un défi.</h2>
        </div>
        <div className="solution-grid">
          <div className="solution-cardwrap">
            <ShowcaseCardDeck cards={cards} />
          </div>
          <div className="solution-side">
            <p className="lead">Chaque carte est une contrainte créative. Le but n'est pas d'apprendre mais passer à l'action et commencer simplement, sans prise de tête.</p>
            <div className="stats">
              <div className="stat">
                <div className="stat__num">48</div>
                <div className="stat__lbl">Cartes</div>
              </div>
              <div className="stat">
                <div className="stat__num">5</div>
                <div className="stat__lbl">Catégories</div>
              </div>
              <div className="stat">
                <div className="stat__num">∞</div>
                <div className="stat__lbl">Combinaisons</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ============== SHOWCASE CAGED ============== */
function Showcase_CAGED() {
  const cards = [
  "visuelles-cartes/CAGED-INTERVALLES_D.svg",
  "visuelles-cartes/CAGED-NOTES_Dm.svg",
  "visuelles-cartes/CAGED-INTERVALLES_Dsus2.svg",
  "visuelles-cartes/CAGED-NOTES_Dsus4.svg",
  "visuelles-cartes/CAGED-INTERVALLES_Dmaj7.svg",
  "visuelles-cartes/CAGED-NOTES_Dm7.svg",
  "visuelles-cartes/CAGED-INTERVALLES_D7.svg"];

  return (
    <section className="section" id="solution-caged">
      <div className="container">
        <div className="section__head section__head--right" style={{ maxWidth: "none" }}>
          <h2 className="h-section">Une carte. Tout le manche.</h2>
        </div>
        <div className="solution-grid solution-grid--mirror">
          <div className="solution-side">
            <p className="lead">Chaque carte représente un type d'accord dans une des 5 positions du CAGED</p>
            <div className="stats">
              <div className="stat">
                <div className="stat__num">35</div>
                <div className="stat__lbl">Cartes</div>
              </div>
              <div className="stat">
                <div className="stat__num">5</div>
                <div className="stat__lbl">Formes</div>
              </div>
              <div className="stat">
                <div className="stat__num">∞</div>
                <div className="stat__lbl">Combinaisons</div>
              </div>

            </div>
          </div>
          <div className="solution-cardwrap solution-cardwrap--right">
            <ShowcaseCardDeck cards={cards} />
          </div>
        </div>
      </div>
    </section>);

}

window.ShowcaseCardDeck = ShowcaseCardDeck;
window.Showcase_contraintes = Showcase_contraintes;
window.Showcase_CAGED = Showcase_CAGED;
/* ============== COMMENT ÇA MARCHE ============== */
function HowTo() {
  const groups = [
  {
    cat: "Contrainte",
    vol: "48 cartes",
    sub: "5 catégories — Rythme, Harmonie, Technique, Structure, Gimmick.",
    uses: [
    { name: "Page blanche", ctx: "nouvelle compo", desc: "Pioche des contraintes et force toi à les placer dans ta compo" },
    { name: "Le Challenger", ctx: "compo existante", desc: "Enrichi un de tes morceaux déjà existant et laisse le hasard décider." },
    { name: "Hardcore mode", ctx: "impro", desc: "Place une des contraintes pendant ton impro." }] },

  {
    cat: "CAGED",
    vol: "35 cartes recto-verso",
    sub: "2 visions — intervalles et noms des notes",
    uses: [
    { name: "Transposition", ctx: "déplacer", desc: "Joue un plan, une rythmique ou une progression que tu connais dans une nouvelle position." },
    { name: "Prison", ctx: "se limiter", desc: "Impose toi de composer ou d'improviser strictement dans la position CAGED tirée au sort." },
    { name: "Liaison", ctx: "explorer", desc: "Pioche plusieurs positions, explore et redécouvre ton manche." }] }];


  return (
    <section className="section section--alt" id="comment">
      <div className="container">
        <div className="section__head" style={{ textAlign: "left", maxWidth: "none" }}>
          <h2 className="h-section" style={{ marginTop: 14 }}>Comment jouer ?</h2>
          <p className="lead section-sub">Deux catégories, deux manières de jouer.</p>
        </div>
        <div className="usage-grid">
          {groups.map((g, i) =>
          <article className="usage-panel" key={i}>
              <div className="usage-panel__head">
                <h3 className="usage-panel__cat">{g.cat}</h3>
                <span className="usage-panel__vol">{g.vol}</span>
              </div>
              <p className="usage-panel__sub">{g.sub}</p>
              <ol className="usage-list">
                {g.uses.map((u, j) =>
              <li className="use-case" key={j}>
                    <div className="use-case__line">
                      <span className="use-case__name">{u.name}</span>
                      <span className="use-case__ctx">{u.ctx}</span>
                    </div>
                    <p className="use-case__desc">{u.desc}</p>
                  </li>
              )}
              </ol>
            </article>
          )}
        </div>
        <div className="usage-bonus">
          <span className="usage-bonus__k">BONUS</span>
          <p className="usage-bonus__txt">Combine les deux catégories : une contrainte pour la direction, une position <b>CAGED</b> pour l'exploration. Seulement pour les plus vaillants.</p>
        </div>
        <div className="usage-bonus">
          <span className="usage-bonus__k">BONUS II</span>
          <p className="usage-bonus__txt">Le but ultime de ce jeu est son approriation. Créer tes propres manières de l'utiliser et dépasse tes habitudes de jeu !</p>
        </div>
      </div>
    </section>);

}

/* ============== CATÉGORIES (2x2) ============== */
function CatCard({ c }) {
  const [idx, setIdx] = useS(0);
  const n = c.cards.length;
  const advance = () => setIdx((p) => (p + 1) % n);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {e.preventDefault();advance();}
    if (e.key === "ArrowRight") {e.preventDefault();setIdx((p) => (p + 1) % n);}
    if (e.key === "ArrowLeft") {e.preventDefault();setIdx((p) => (p - 1 + n) % n);}
  };
  return (
    <article className="cat-card">
      <div className="cat-card__body">
        <span className="cat-card__count">{c.count}</span>
        <h3 className="cat-card__title">{c.title}</h3>
        <p className="cat-card__desc">{c.desc}</p>
      </div>
      <div
        className="cat-stage-wrap"
        role="button"
        tabIndex={0}
        aria-label={"Faire défiler les exemples de cartes " + c.title}
        onClick={advance}
        onKeyDown={onKey}>
        <div className="cat-stage">
          <div className="cat-stage__hint" aria-hidden="true">
            <div className="cat-stage__deck"><span></span><span></span><span></span></div>
            <span className="cat-stage__hint-label">Survole pour piocher</span>
          </div>
          <div className="cat-stage__cards">
            {c.cards.map((src, i) =>
            <img
              key={i}
              src={src}
              alt={i === idx ? c.title + " — exemple " + (i + 1) : ""}
              className={"cat-stage__card" + (i === idx ? " is-active" : "")}
              draggable="false" />
            )}
          </div>
        </div>
        <div className="cat-stage__counter">
          <div className="cat-stage__nav" aria-hidden="true">
            <button className="cat-stage__arrow" onClick={(e) => {e.stopPropagation();setIdx((p) => (p - 1 + n) % n);}}>←</button>
            <span className="cat-stage__index">{String(idx + 1).padStart(2, '0')}<span className="cat-stage__total"> / {String(n).padStart(2, '0')}</span></span>
            <button className="cat-stage__arrow" onClick={(e) => {e.stopPropagation();advance();}}>→</button>
          </div>
          <span className="cat-stage__cta">clique pour défiler</span>
        </div>
      </div>
    </article>);

}

function Categories() {
  const cats = [
  { title: "Contrainte", desc: <>Règles strictes pour penser différemment — inspirées des Stratégies Obliques de Brian Eno.<br /><span className="cat-card__desc-hl">Structure, rythme, technique, harmonie, gimmick.</span></>, count: "48 cartes",
    cards: [
    "visuelles-cartes/CONTRAINTE_CLUSTER.svg",
    "visuelles-cartes/CONTRAINTE_CONTRAINTE-LIBRE.svg",
    "visuelles-cartes/CONTRAINTE_HONORE-L-ERREUR.svg",
    "visuelles-cartes/CONTRAINTE_HORIZONTAL.svg",
    "visuelles-cartes/CONTRAINTE_L-OPPOSE.svg",
    "visuelles-cartes/CONTRAINTE_MOINS-PLUS.svg",
    "visuelles-cartes/CONTRAINTE_OCTAVE.svg",
    "visuelles-cartes/CONTRAINTE_PREMIER-JET-FINAL.svg",
    "visuelles-cartes/CONTRAINTE_SLOW-MOTION.svg",
    "visuelles-cartes/CONTRAINTE_ZONE-AVEUGLE.svg",
    "visuelles-cartes/GIMMICK_ACCORD-CHROMATIQUE.svg",
    "visuelles-cartes/GIMMICK_ACCORD-SUSPENDU.svg",
    "visuelles-cartes/GIMMICK_ADD9.svg",
    "visuelles-cartes/GIMMICK_HARMONIQUE-NATURELLES.svg",
    "visuelles-cartes/GIMMICK_LINE-CLICHE.svg",
    "visuelles-cartes/GIMMICK_OPEN-VOICINGS.svg",
    "visuelles-cartes/HARMONIE_ACCORD-D-EMPRUNT.svg",
    "visuelles-cartes/HARMONIE_AVOID-NOTES.svg",
    "visuelles-cartes/HARMONIE_BLUE-NOTE.svg",
    "visuelles-cartes/HARMONIE_CHROMATISME.svg",
    "visuelles-cartes/HARMONIE_PENTATONIQUE-STRICTE.svg",
    "visuelles-cartes/RYTHME_CROCHE-POINTEE.svg",
    "visuelles-cartes/RYTHME_DECALAGE-DEMI-TEMPS.svg",
    "visuelles-cartes/RYTHME_DOUBLE-CROCHE.svg",
    "visuelles-cartes/RYTHME_ONE-NOTE-GROOVE.svg",
    "visuelles-cartes/RYTHME_SILENCE-TEMPS-FORT.svg",
    "visuelles-cartes/RYTHME_STACCATO.svg",
    "visuelles-cartes/RYTHME_SYNCOPE-ET-DU-DEUX.svg",
    "visuelles-cartes/RYTHME_TRIOLET.svg",
    "visuelles-cartes/STRUCTURE_ASYMETRIE.svg",
    "visuelles-cartes/STRUCTURE_BOUCLE-EVOLUTIVE.svg",
    "visuelles-cartes/STRUCTURE_CLIMAX.svg",
    "visuelles-cartes/STRUCTURE_CRESCENDO.svg",
    "visuelles-cartes/STRUCTURE_DIALOGUE.svg",
    "visuelles-cartes/STRUCTURE_FAUSSE-FIN.svg",
    "visuelles-cartes/STRUCTURE_FORME-ABA.svg",
    "visuelles-cartes/STRUCTURE_LONGUE-INTRO.svg",
    "visuelles-cartes/STRUCTURE_QUESTION-REPONSE.svg",
    "visuelles-cartes/STRUCTURE_SUITE-ENCHAINEE.svg",
    "visuelles-cartes/TECHNIQUE_BEND.svg",
    "visuelles-cartes/TECHNIQUE_GHOST-NOTES.svg",
    "visuelles-cartes/TECHNIQUE_HAMMER-ON.svg",
    "visuelles-cartes/TECHNIQUE_HARMONIQUE-ARTIFICIELLE.svg",
    "visuelles-cartes/TECHNIQUE_LEGATO.svg",
    "visuelles-cartes/TECHNIQUE_PULL-OFF.svg",
    "visuelles-cartes/TECHNIQUE_SLIDE.svg",
    "visuelles-cartes/TECHNIQUE_TREMOLO.svg",
    "visuelles-cartes/TECHNIQUE_VIBRATO.svg"] },
  { title: "CAGED", desc: <>Cartographie le manche — positions majeures, mineures, septièmes et suspendues.<br /><span className="cat-card__desc-hl">Recto : noms des notes.<br />Verso : intervalles.</span></>, count: "35 cartes (recto - verso)",
    cards: [
    "visuelles-cartes/CAGED-INTERVALLES_C.svg",
    "visuelles-cartes/CAGED-INTERVALLES_C7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Cm.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Cm7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Cmaj7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Csus2.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Csus4.svg",
    "visuelles-cartes/CAGED-NOTES_C.svg",
    "visuelles-cartes/CAGED-NOTES_C7.svg",
    "visuelles-cartes/CAGED-NOTES_Cm.svg",
    "visuelles-cartes/CAGED-NOTES_Cm7.svg",
    "visuelles-cartes/CAGED-NOTES_Cmaj7.svg",
    "visuelles-cartes/CAGED-NOTES_Csus2.svg",
    "visuelles-cartes/CAGED-NOTES_Csus4.svg",
    "visuelles-cartes/CAGED-INTERVALLES_A.svg",
    "visuelles-cartes/CAGED-INTERVALLES_A7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Am.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Am7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Amaj7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Asus2.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Asus4.svg",
    "visuelles-cartes/CAGED-NOTES_A.svg",
    "visuelles-cartes/CAGED-NOTES_A7.svg",
    "visuelles-cartes/CAGED-NOTES_Am.svg",
    "visuelles-cartes/CAGED-NOTES_Am7.svg",
    "visuelles-cartes/CAGED-NOTES_Amaj7.svg",
    "visuelles-cartes/CAGED-NOTES_Asus2.svg",
    "visuelles-cartes/CAGED-NOTES_Asus4.svg",
    "visuelles-cartes/CAGED-INTERVALLES_G.svg",
    "visuelles-cartes/CAGED-INTERVALLES_G7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Gm.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Gm7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Gmaj7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Gsus2.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Gsus4.svg",
    "visuelles-cartes/CAGED-NOTES_G.svg",
    "visuelles-cartes/CAGED-NOTES_G7.svg",
    "visuelles-cartes/CAGED-NOTES_Gm.svg",
    "visuelles-cartes/CAGED-NOTES_Gm7.svg",
    "visuelles-cartes/CAGED-NOTES_Gmaj7.svg",
    "visuelles-cartes/CAGED-NOTES_Gsus2.svg",
    "visuelles-cartes/CAGED-NOTES_Gsus4.svg",
    "visuelles-cartes/CAGED-INTERVALLES_E.svg",
    "visuelles-cartes/CAGED-INTERVALLES_E7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Em.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Em7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Emaj7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Esus2.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Esus4.svg",
    "visuelles-cartes/CAGED-NOTES_E.svg",
    "visuelles-cartes/CAGED-NOTES_E7.svg",
    "visuelles-cartes/CAGED-NOTES_Em.svg",
    "visuelles-cartes/CAGED-NOTES_Em7.svg",
    "visuelles-cartes/CAGED-NOTES_Emaj7.svg",
    "visuelles-cartes/CAGED-NOTES_Esus2.svg",
    "visuelles-cartes/CAGED-NOTES_Esus4.svg",
    "visuelles-cartes/CAGED-INTERVALLES_D.svg",
    "visuelles-cartes/CAGED-INTERVALLES_D7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Dm.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Dm7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Dmaj7.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Dsus2.svg",
    "visuelles-cartes/CAGED-INTERVALLES_Dsus4.svg",
    "visuelles-cartes/CAGED-NOTES_D.svg",
    "visuelles-cartes/CAGED-NOTES_D7.svg",
    "visuelles-cartes/CAGED-NOTES_Dm.svg",
    "visuelles-cartes/CAGED-NOTES_Dm7.svg",
    "visuelles-cartes/CAGED-NOTES_Dmaj7.svg",
    "visuelles-cartes/CAGED-NOTES_Dsus2.svg",
    "visuelles-cartes/CAGED-NOTES_Dsus4.svg"] }];

  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section__head" style={{ textAlign: "left", maxWidth: "none" }}>
          <h2 className="h-section" style={{ marginTop: 14 }}>Le deck complet</h2>
        </div>
        <div className="cats-grid">
          {cats.map((c, i) =>
          <CatCard c={c} key={i} />
          )}
        </div>
      </div>
    </section>);

}

/* ============== PREUVE SOCIALE ============== */
function SocialProof() {
  const t = [
  { q: "J'ai composé plus en 2 semaines avec ce deck que pendant les 6 derniers mois à noodler tout seul. Je sais pas pourquoi ça marche, ça marche.", who: "Marc", initial: "M", age: 31 },
  { q: "Je connaissais la théorie par cœur. Le deck m'a forcé à arrêter de réfléchir et à jouer. Première vraie chanson finie depuis 2 ans.", who: "Laura", initial: "L", age: 28 },
  { q: "Le format physique change tout. Pas de scroll, pas de notif, pas d'onglet. Tu piochesˌ tu joues. C'est con. C'est génial.", who: "Adrien", initial: "A", age: 35 }];

  return (
    <section className="section section--alt" id="preuve">
      <div className="container">
        <div className="section__head" style={{ textAlign: "left", maxWidth: "none" }}>
          <h2 className="h-section" style={{ marginTop: 14 }}>Ils tournaient en rond.<br />Ils ont décroché.</h2>
        </div>
        <div className="testimonials">
          {t.map((v, i) =>
          <article className="verbatim" key={i}>
              <span className="verbatim__qmark">"</span>
              <p className="verbatim__quote">{v.q}</p>
              <div className="verbatim__author">
                <span className="verbatim__avatar">{v.initial}.</span>
                <div>
                  <div className="verbatim__name">{v.who[0]}. — {v.age} ans</div>
                  <div className="verbatim__src">Guitariste, Reddit</div>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}

/* ============== OBJECTION ============== */
function Objection() {
  return (
    <section className="section" id="objection">
      <div className="container">
        <div className="objection-grid">
          <div>
            <h2 className="h-section" style={{ marginTop: 14 }}>On adresse l'objection qui tue tout.</h2>
            <p className="body body--lg" style={{ marginTop: 18, maxWidth: "40ch" }}>La question que tout le monde se pose avant de payer 25 €. Pas de langue de bois.</p>
          </div>
          <div className="qa">
            <div className="qa__row qa__row--q">
              <div className="qa__badge">Q</div>
              <div className="qa__content">
                <p className="qa__q">"Ça va finir dans un tiroir, ce truc ?"</p>
              </div>
            </div>
            <div className="qa__row qa__row--a">
              <div className="qa__badge">R</div>
              <div className="qa__content">
                <p className="qa__a">Non, parce que tu ne le ranges pas. <b>Tu le poses sur ton ampli.</b> Chaque session, tu piochesˌ une carte avant même de brancher. C'est un rituel de 30 secondes — pas une méthode à étudier.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ============== EN RÉSUMÉ ============== */
function Recap() {
  const args = [
  { n: "01", t: "Compo & impro", d: "Le deck fonctionne dans les deux sens — pioche en pleine session d'écriture ou en plein bœuf." },
  { n: "02", t: "Le manche par cœur", d: "Le moyen le plus efficace de connaître ton manche et d'y créer des connexions." },
  { n: "03", t: "Des variations à l'infini", d: "Pour tes plans, tes progressions d'accords, tes riffs — un maximum d'idées qui poppent." }];

  return (
    <section className="section section--alt" id="resume">
      <div className="container">
        <div className="section__head" style={{ textAlign: "left", maxWidth: "none", marginBottom: 0 }}>
          <h2 className="h-section">Un deck pensé pour une chose : te débloquer</h2>
        </div>
        <div className="recap-args">
          {args.map((a) =>
          <article className="recap-arg" key={a.n}>
              <span className="recap-arg__num">{a.n}</span>
              <h3 className="recap-arg__title">{a.t}</h3>
              <p className="recap-arg__desc">{a.d}</p>
            </article>
          )}
        </div>
      </div>
    </section>);

}

/* ============== CTA FINAL ============== */
function FinalCTA({ bg = "dark" }) {
  return (
    <section className={"cta cta--" + bg} id="cta">
      <div className="container cta__inner">
        <h2 className="cta__title">Tire une carte et kiffe.</h2>
        <p className="cta__sub">La panne d'inspiration n'est plus qu'un mythe désormais.</p>
        <div className="cta__form">
          <EmailField variant={bg} />
        </div>
        <div className="cta__price">
          <span className="cta__price-pill"><b>29,10€</b></span>
          <span>C'EST LE PRIX D'UN BOUQUIN DE THÉORIE QUI FINIRA DANS TON PLACARD.</span>
        </div>
      </div>
    </section>);

}

/* ============== FOOTER ============== */
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <a href="#top" className="logo">Guitar Flow<span className="logo__sq" aria-hidden="true"></span>Cards</a>
        </div>
        <div className="footer__right">
          {/* <a href="Blog.html">Blog</a>
          <span>·</span> */}
          <a href="mailto:salut@guitarflowcards.com">Contact</a>
          <span>·</span>
          <span>Fait à Lyon avec passion 🎸❤️</span>
        </div>
      </div>
    </footer>);

}

window.Nav = Nav;
window.Hero = Hero;
window.Problem = Problem;
window.HowTo = HowTo;
window.Categories = Categories;
window.Recap = Recap;
window.SocialProof = SocialProof;
window.Objection = Objection;
window.FinalCTA = FinalCTA;
window.Footer = Footer;




