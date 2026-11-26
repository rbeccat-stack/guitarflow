/* Guitar Flow — création du contact HubSpot pour la page /cours.
   Fonction Vercel (Node). Le formulaire HubSpot public ne crée pas de fiche
   contact sans email : on passe donc par l'API CRM, qui l'accepte.

   Variable d'environnement Vercel requise : HUBSPOT_TOKEN
   (clé d'une app privée HubSpot, portées crm.objects.contacts.read + write).
   Le jeton ne quitte jamais le serveur. */

const API = "https://api.hubapi.com/crm/v3/objects/contacts";
const ALLOWED_HOSTS = /^(www\.)?guitarflow\.fr$|\.vercel\.app$|^localhost$|^127\.0\.0\.1$/;

function clip(v, n) { return typeof v === "string" ? v.trim().slice(0, n) : ""; }

async function hs(path, token, method, body) {
  const r = await fetch(API + path, {
    method,
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* réponse non JSON */ }
  return { ok: r.ok, status: r.status, json, text };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "method" }); }

  // Appels acceptés uniquement depuis le site (anti-abus basique).
  let originHost = "";
  try { originHost = new URL(req.headers.origin || req.headers.referer || "").hostname; } catch (e) { /* vide */ }
  if (!ALLOWED_HOSTS.test(originHost)) return res.status(403).json({ error: "origin" });

  const token = process.env.HUBSPOT_TOKEN;
  if (!token) return res.status(503).json({ error: "not_configured" });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  if (b.website) return res.status(200).json({ ok: true }); // pot de miel : on fait semblant

  const firstname = clip(b.firstname, 80);
  const lastname = clip(b.lastname, 80);
  const phone = clip(b.phone, 30);
  const envie = clip(b.envie, 500);
  const source = clip(b.source, 20);
  if (firstname.length < 2 || !lastname || phone.replace(/\D/g, "").length < 9) {
    return res.status(400).json({ error: "invalid" });
  }

  const properties = { firstname, lastname, phone, mobilephone: phone };
  if (envie) properties.envie = envie;

  // Dédoublonnage par téléphone : HubSpot ne le fait que sur l'email.
  const found = await hs("/search", token, "POST", {
    filterGroups: [
      { filters: [{ propertyName: "phone", operator: "EQ", value: phone }] },
      { filters: [{ propertyName: "mobilephone", operator: "EQ", value: phone }] }
    ],
    properties: ["firstname"], limit: 1
  });
  const existing = found.ok && found.json && found.json.results && found.json.results[0];

  let out;
  if (existing) {
    out = await hs("/" + existing.id, token, "PATCH", { properties });
  } else {
    properties.lifecyclestage = "lead";
    out = await hs("", token, "POST", { properties });
    // Propriété inconnue (ex. envie supprimée) : on réessaie sans les extras.
    if (!out.ok && out.status === 400 && envie) {
      delete properties.envie;
      out = await hs("", token, "POST", { properties });
    }
  }

  if (!out.ok) {
    console.error("HubSpot CRM", out.status, out.text.slice(0, 500), "source=" + source);
    return res.status(502).json({ error: "hubspot", status: out.status });
  }
  return res.status(200).json({ ok: true, id: out.json && out.json.id, updated: !!existing });
};
