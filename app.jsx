/* global React, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect */
/* global Nav, Hero, Problem, Showcase_contraintes, Showcase_CAGED, HowTo, Categories, SocialProof, Objection, WhySection, FinalCTA, Footer */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "base",
  "cardStyle": "illustrated",
  "heroDensity": "breathing",
  "ctaBg": "dark"
}/*EDITMODE-END*/;

// Les deux visions du site : les défis créatifs, ou le système CAGED.
// La structure ne change pas — seule la lecture qu'on en donne.
const VISION_KEY = "gf:vision";

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [vision, setVision] = React.useState(() => {
    try {
      return localStorage.getItem(VISION_KEY) === "caged" ? "caged" : "defis";
    } catch (e) {
      return "defis";
    }
  });

  // Apply tweak vars to body
  React.useEffect(() => {
    document.body.dataset.palette = t.palette;
    document.body.dataset.density = t.heroDensity;
  }, [t.palette, t.heroDensity]);

  React.useEffect(() => {
    document.body.dataset.vision = vision;
    try {
      localStorage.setItem(VISION_KEY, vision);
    } catch (e) {
      /* navigation privée : la vision ne survit pas au reload, tant pis */
    }
  }, [vision]);

  const toggleVision = () => setVision((v) => (v === "caged" ? "defis" : "caged"));

  return (
    <>
      <Nav vision={vision} onToggleVision={toggleVision}/>
      <Hero density={t.heroDensity} cardStyle={t.cardStyle}/>
      <Showcase_contraintes/>
      <Showcase_CAGED/>
      <HowTo/>
      <Categories/>
      <WhySection/>
      <FinalCTA bg={t.ctaBg}/>
      <Footer/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakRadio
            label="Accent"
            value={t.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              { value: "base",      label: "Base" },
              { value: "inverted",  label: "Encre" },
              { value: "secondary", label: "Vert" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Style de carte">
          <TweakRadio
            label="Mock-up"
            value={t.cardStyle}
            onChange={(v) => setTweak("cardStyle", v)}
            options={[
              { value: "minimal",      label: "Minimal" },
              { value: "illustrated",  label: "Illustré" },
              { value: "typographic",  label: "Typo" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Densité du Hero">
          <TweakRadio
            label="Spacing"
            value={t.heroDensity}
            onChange={(v) => setTweak("heroDensity", v)}
            options={[
              { value: "tight",     label: "Tight" },
              { value: "breathing", label: "Breathing" },
            ]}
          />
        </TweakSection>

        <TweakSection label="CTA Final">
          <TweakRadio
            label="Fond"
            value={t.ctaBg}
            onChange={(v) => setTweak("ctaBg", v)}
            options={[
              { value: "dark",   label: "Sombre" },
              { value: "accent", label: "Accent" },
              { value: "light",  label: "Clair" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
