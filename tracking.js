/* Guitar Flow — couche de mesure côté site.
   Vanilla JS, chargé dans <head> avant React : il doit exister avant que les
   composants ne poussent leurs premiers événements.

   Le site ne parle à aucun outil directement. Il ne fait que :
     1. initialiser window.dataLayer (lu par Google Tag Manager),
     2. mémoriser d'où vient le visiteur (UTM, gclid, fbclid, referrer),
     3. exposer window.gfTrack(event, params) et window.gfAttribution(),
     4. injecter GTM si GF_CONFIG.gtmId est renseigné.
   GA4, Google Ads, le pixel Meta et le consentement se configurent dans GTM. */
(function () {
  var cfg = window.GF_CONFIG || {};
  window.dataLayer = window.dataLayer || [];

  /* ---------- Attribution : premier contact + dernier contact ---------- */
  var ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid", "ttclid"];
  var FIRST_KEY = "gf:attr:first";
  var LAST_KEY = "gf:attr:last";

  function readParams() {
    var out = {};
    try {
      var sp = new URLSearchParams(window.location.search);
      ATTR_KEYS.forEach(function (k) {
        var v = sp.get(k);
        if (v) out[k] = v.slice(0, 200);
      });
    } catch (e) { /* URLSearchParams absent : pas d'attribution, pas de casse */ }
    return out;
  }

  function store(storage, key, value) {
    try { storage.setItem(key, JSON.stringify(value)); } catch (e) { /* stockage bloqué */ }
  }
  function load(storage, key) {
    try { return JSON.parse(storage.getItem(key) || "null"); } catch (e) { return null; }
  }

  var params = readParams();
  var hasClickSignal = Object.keys(params).length > 0;
  var now = new Date().toISOString();

  // Un referrer externe sans UTM compte quand même comme une source
  // (trafic organique, lien partagé…). Le referrer interne est ignoré.
  var ref = "";
  try {
    if (document.referrer && new URL(document.referrer).host !== window.location.host) ref = document.referrer;
  } catch (e) { /* referrer illisible */ }

  var touch = {
    ts: now,
    landing: window.location.pathname + window.location.search,
    referrer: ref
  };
  ATTR_KEYS.forEach(function (k) { if (params[k]) touch[k] = params[k]; });

  // Premier contact : figé une fois pour toutes (localStorage).
  // Dernier contact : remplacé à chaque arrivée qui porte un signal (session).
  if (!load(localStorage, FIRST_KEY)) store(localStorage, FIRST_KEY, touch);
  if (hasClickSignal || ref || !load(sessionStorage, LAST_KEY)) store(sessionStorage, LAST_KEY, touch);

  /* ---------- Vision pilotée par l'URL (?vision=caged) ----------
     Permet d'envoyer une pub CAGED vers la lecture CAGED du site sans
     dépendre de ce que le visiteur a choisi lors d'une visite précédente. */
  try {
    var v = new URLSearchParams(window.location.search).get("vision");
    if (v === "caged" || v === "defis") localStorage.setItem("gf:vision", v);
  } catch (e) { /* idem */ }

  /* ---------- API publique ---------- */
  window.gfAttribution = function () {
    return {
      first: load(localStorage, FIRST_KEY),
      last: load(sessionStorage, LAST_KEY),
      vision: (function () { try { return localStorage.getItem("gf:vision") || "defis"; } catch (e) { return "defis"; } })()
    };
  };

  window.gfTrack = function (event, extra) {
    var payload = { event: event };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) payload[k] = extra[k];
    var last = load(sessionStorage, LAST_KEY) || {};
    // Les champs de source sont recopiés sur chaque événement : dans GTM ils
    // deviennent des variables Data Layer sans configuration supplémentaire.
    if (last.utm_source && payload.utm_source === undefined) payload.utm_source = last.utm_source;
    if (last.utm_campaign && payload.utm_campaign === undefined) payload.utm_campaign = last.utm_campaign;
    if (last.utm_content && payload.utm_content === undefined) payload.utm_content = last.utm_content;
    window.dataLayer.push(payload);
    return payload;
  };

  /* ---------- Google Tag Manager ---------- */
  if (cfg.gtmId && /^GTM-[A-Z0-9]+$/.test(cfg.gtmId)) {
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + cfg.gtmId;
    document.head.appendChild(s);
  }

  // Premier événement : la vision affichée et la source. GTM peut s'en servir
  // pour découper les rapports "défis" vs "CAGED".
  window.gfTrack("gf_ready", { vision: window.gfAttribution().vision });
})();
