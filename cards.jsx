/* global React */

/* ============================================================
   Card categories — real ones from the deck
   ============================================================ */
const CATS = {
  caged: { band: "#2E3845", text: "var(--ink-900)", label: "CAGED" },
  contrainte: { band: "var(--red-500)", text: "var(--red-700)", label: "CONTRAINTE" },
  gimmick: { band: "var(--orange-500)", text: "var(--orange-700)", label: "GIMMICK" },
  rythme: { band: "var(--green-500)", text: "var(--green-700)", label: "RYTHME" },
  structure: { band: "var(--blue-500)", text: "var(--blue-700)", label: "STRUCTURE" },
  technique: { band: "var(--purple-500)", text: "var(--purple-700)", label: "TECHNIQUE" },
  harmonie: { band: "#1F8A5B", text: "#15573D", label: "HARMONIE" },
  mindset: { band: "var(--slate-500)", text: "var(--slate-700)", label: "MINDSET" },
  processus: { band: "var(--ink-700)", text: "var(--ink-900)", label: "PROCESSUS" }
};

/* ============================================================
   Visuals used in the middle of cards
   ============================================================ */

/* ChordDiagram — matches the real card style.
   notes: [{string: 0-5 (6=high E), fret: 0-4, label: "R"/"M3"/"P5"/"b7"/etc, color: "ink"/"red"/"green"/"blue"/"yellow"}]
   mutes: array of string indices to mark with × above the nut
   opens: array of string indices that ring open (no dot needed; we'll show label above) */
function ChordDiagram({ notes = [], mutes = [], opens = [], frets = 4, baseFret = 0 }) {
  const W = 200,H = 180;
  const padL = 22,padR = 22,padT = 26,padB = 14;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const strings = 6; // low E to high E, drawn left to right
  const sx = (i) => padL + innerW / (strings - 1) * i;
  const fy = (f) => padT + innerH / frets * f;

  const DOT = {
    ink: "#2E2D28",
    red: "#DC6360",
    green: "#5CA877",
    blue: "#5288C2",
    yellow: "#E8B85A"
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      {/* mutes & open labels above nut */}
      {Array.from({ length: strings }).map((_, i) => {
        if (mutes.includes(i)) {
          return (
            <text key={`m-${i}`} x={sx(i)} y={padT - 10} fontSize="10" fontFamily="ui-sans-serif, system-ui" textAnchor="middle" fill="#8E8A80">×</text>);

        }
        const open = opens.find((o) => o.string === i);
        if (open) {
          return (
            <g key={`o-${i}`}>
              <circle cx={sx(i)} cy={padT - 12} r="7" fill={DOT[open.color || "ink"]} />
              <text x={sx(i)} y={padT - 9} fontSize="7" fontWeight="700" fontFamily="ui-sans-serif, system-ui" textAnchor="middle" fill="#fff">{open.label}</text>
            </g>);

        }
        return null;
      })}

      {/* nut (thicker if baseFret === 0) */}
      <line x1={padL - 1} y1={padT} x2={W - padR + 1} y2={padT} stroke="#1C1B18" strokeWidth={baseFret === 0 ? 4 : 1.4} />

      {/* frets */}
      {Array.from({ length: frets }).map((_, i) =>
      <line key={`f-${i}`} x1={padL} y1={fy(i + 1)} x2={W - padR} y2={fy(i + 1)} stroke="#BFBBB0" strokeWidth="1" />
      )}

      {/* strings */}
      {Array.from({ length: strings }).map((_, i) =>
      <line key={`s-${i}`} x1={sx(i)} y1={padT} x2={sx(i)} y2={padT + innerH} stroke="#BFBBB0" strokeWidth="1" />
      )}

      {/* fretted notes */}
      {notes.map((n, idx) => {
        const x = sx(n.string);
        const y = fy(n.fret - 0.5);
        const r = 9;
        return (
          <g key={idx}>
            <circle cx={x} cy={y} r={r} fill={DOT[n.color || "ink"]} stroke="#fff" strokeWidth="0.5" />
            <text x={x} y={y + 3.2} fontSize="8" fontWeight="700" fontFamily="ui-sans-serif, system-ui" textAnchor="middle" fill="#fff">{n.label}</text>
          </g>);

      })}
    </svg>);

}

/* RhythmGlyph — big numeric/symbolic centerpiece for rhythm cards */
function RhythmGlyph({ children, sub }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "100%", gap: 6, padding: "4px 0"
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 42, lineHeight: 1, letterSpacing: "-0.02em",
        color: "#1C1B18",
        display: "flex", gap: 14, alignItems: "baseline"
      }}>
        {children}
      </div>
      {sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", color: "#8E8A80", textTransform: "uppercase" }}>{sub}</div>}
    </div>);

}

/* SymbolGlyph — for CONTRAINTE / GIMMICK / TECHNIQUE that show short text symbols
   like "REFRAME 50%", "1/2 TON 5", "+9", "M2 P4" */
function SymbolGlyph({ children, accent = "#1C1B18" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100%", padding: "4px 8px"
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 30, lineHeight: 1.0, letterSpacing: "-0.015em",
        color: accent, textAlign: "center"
      }}>
        {children}
      </div>
    </div>);

}

/* ============================================================
   MiniCard — matches real deck aesthetic
   - Dark navy header band (CAGED) or category color (others)
   - Big chord/title at top
   - Visual centerpiece (ChordDiagram / RhythmGlyph / SymbolGlyph)
   - Description at bottom
   ============================================================ */
function MiniCard({ category = "caged", title, subtitle, instr, visual, style, variant = "illustrated", number }) {
  const c = CATS[category] || CATS.caged;
  return (
    <div className={`gfcard gfcard--${variant}`} style={{ ...style, ["--band"]: c.band }}>
      <div className="gfcard__head">
        <span className="gfcard__cat">{c.label}{subtitle ? <> &nbsp;—&nbsp; <span className="gfcard__sub">{subtitle}</span></> : null}</span>
      </div>
      <div className="gfcard__body">
        <h3 className="gfcard__title">{title}</h3>
        {visual && variant !== "minimal" &&
        <div className="gfcard__visual">{visual}</div>
        }
        {instr && <p className="gfcard__instr">{instr}</p>}
        {number && <div className="gfcard__num">{number}</div>}
      </div>
    </div>);

}

/* ============================================================
   BigCard — used in the Solution section. Real-card scale.
   ============================================================ */
function BigCard({ cardStyle = "illustrated" }) {
  return (
    <img
      src="assets/cards/AVOID NOTES - HARMONIE-2bb98a68.svg"
      alt="Carte HARMONIE — Avoid notes"
      className="gfbigcard-img" style={{ objectFit: "scale-down" }} />);


}

/* ============================================================
   Pre-built card content for the hero fan & elsewhere
   ============================================================ */
const HeroCards = {
  caged: {
    category: "caged",
    subtitle: "MI",
    title: "Em7",
    instr: "Forme Mi mineur ouverte. Septième mineure bleue sur la 4e corde.",
    visual:
    <ChordDiagram
      mutes={[]}
      opens={[
      { string: 0, label: "R", color: "ink" },
      { string: 3, label: "P5", color: "green" },
      { string: 4, label: "R", color: "ink" },
      { string: 5, label: "P5", color: "green" }]
      }
      notes={[
      { string: 1, fret: 2, label: "b7", color: "blue" },
      { string: 2, fret: 2, label: "b3", color: "red" },
      { string: 4, fret: 0.001, label: "", color: "ink" }].
      filter((n) => n.label)}
      frets={4} />


  },
  rythme: {
    category: "rythme",
    subtitle: "SYNCOPE",
    title: "Le « et » du 2",
    instr: "Ne joue pas sur le 2. Accentue le « et » juste après. Crée un rebond inattendu.",
    visual: <RhythmGlyph sub="contre-temps">2&nbsp;<span style={{ color: "#5CA877" }}>et</span>&nbsp;3&nbsp;1</RhythmGlyph>
  },
  contrainte: {
    category: "contrainte",
    subtitle: "REFRAME",
    title: "L'opposé",
    instr: "Imagine ce que tu jouerais. Fais le strict opposé. Hauteur, position, technique.",
    visual: <SymbolGlyph accent="#8B2E2C">REFRAME<br />50%</SymbolGlyph>
  },
  gimmick: {
    category: "gimmick",
    subtitle: "HARMONIQUES",
    title: "Naturelles",
    instr: "Cases 5, 7, 12. Ponctue tes phrases d'un son cristallin.",
    visual: <SymbolGlyph accent="#95562A">5&nbsp;&nbsp;7&nbsp;&nbsp;12</SymbolGlyph>
  }
};

window.MiniCard = MiniCard;
window.BigCard = BigCard;
window.ChordDiagram = ChordDiagram;
window.RhythmGlyph = RhythmGlyph;
window.SymbolGlyph = SymbolGlyph;
window.HeroCards = HeroCards;
window.CATS = CATS;