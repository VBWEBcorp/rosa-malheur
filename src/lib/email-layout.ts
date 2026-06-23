/**
 * Charte graphique commune à TOUS les emails transactionnels — identité
 * "Rosa Malheur" : affiche sérigraphiée 70s (crème, noir, orange, rose),
 * cartes "sticker" à grosse bordure noire arrondie, étoiles rétro, logo en
 * en-tête, titres en Baloo 2.
 *
 * Tous les styles sont inline (compatibilité Gmail/Outlook/Apple Mail) ; le
 * bloc <style> n'ajoute que l'import de police (best-effort) + le responsive.
 * `color-scheme: light only` empêche l'inversion en mode sombre.
 *
 * NB : les variables gardent leurs noms historiques (`gold`…) pour ne pas
 * casser les appelants ; seules leurs valeurs suivent la charte Rosa Malheur.
 */
import { SITE_URL } from "./seo";

export const SHOP_NAME = "Rosa Malheur";
export const SHOP_TAGLINE = "Laisses pour chien en corde d'escalade recyclée";

/** Logo détouré servi par le site. URL absolue obligatoire dans un email.
 *  En local, on pointe sur l'URL de dev pour que l'aperçu affiche le logo ;
 *  en prod, NEXT_PUBLIC_APP_URL = le vrai domaine (sinon repli sur SITE_URL). */
export const LOGO_URL = `${process.env.NEXT_PUBLIC_APP_URL || SITE_URL}/brand/rosa-malheur.png`;

export const EMAIL_COLORS = {
  gold: "#DC480F", // orange sérigraphie (accent principal)
  goldDark: "#B23A0C",
  goldLight: "#E9692F",
  cream: "#F4D9BC", // fond extérieur
  softCream: "#FBEEDD",
  pink: "#EBA0A4",
  pinkSoft: "#F9DEDF", // fond des encadrés
  ink: "#0E0D0D", // noir charte
  body: "#4A443E",
  muted: "#8C8478",
  border: "#EAD3B6",
  hairline: "#F2E2CE",
  white: "#ffffff",
};

const C = EMAIL_COLORS;
const SANS = "'Nunito','Segoe UI',Roboto,Helvetica,Arial,sans-serif";
// Baloo 2 si dispo (Apple Mail, iOS), sinon repli arrondi puis sans-serif.
const DISPLAY = "'Baloo 2','Trebuchet MS','Segoe UI',Helvetica,Arial,sans-serif";

export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c)
  );
}

/** Petit intitulé orange en majuscules, étoile rétro en préfixe. */
export function emailEyebrow(text: string): string {
  return `<p style="font-family:${DISPLAY}; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; color:${C.gold}; font-weight:800; margin:0 0 14px;"><span style="color:${C.pink};">&#10038;</span>&nbsp;${text}</p>`;
}

/** Titre principal en Baloo 2, gras, noir. Accepte du HTML simple (<br>). */
export function emailHeading(html: string): string {
  return `<h1 class="rm-h1" style="font-family:${DISPLAY}; font-size:30px; line-height:1.08; font-weight:800; color:${C.ink}; margin:0 0 18px;">${html}</h1>`;
}

/** Paragraphe de corps de texte. Accepte du HTML simple. */
export function emailParagraph(html: string): string {
  return `<p style="font-family:${SANS}; font-size:15px; line-height:1.7; color:${C.body}; margin:0 0 16px;">${html}</p>`;
}

/** Bouton pilule orange à bordure noire (style sticker). */
export function emailButton(href: string, label: string): string {
  return `<a href="${href}" class="rm-btn" style="display:inline-block; background-color:${C.gold}; color:#ffffff !important; font-family:${DISPLAY}; font-size:13px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; text-decoration:none; padding:15px 36px; border-radius:999px; border:2px solid ${C.ink};">${label}</a>`;
}

/** Encadré rose pâle à grosse bordure noire arrondie (adresse, relais, note). */
export function emailInfoBox(innerHtml: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
    <tr><td style="background:${C.pinkSoft}; border:2px solid ${C.ink}; border-radius:16px; padding:18px 20px;">${innerHtml}</td></tr>
  </table>`;
}

/** Séparateur : trois étoiles rétro centrées. */
export function emailDivider(): string {
  return `<p style="text-align:center; font-size:16px; letter-spacing:0.5em; color:${C.pink}; margin:26px 0;"><span style="color:${C.gold};">&#10038;</span> &#10038; <span style="color:${C.gold};">&#10038;</span></p>`;
}

/** Enveloppe complète : logo en en-tête, carte sticker, pied de page. */
export function emailShell({
  title,
  preheader,
  content,
}: {
  title: string;
  preheader?: string;
  content: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(title)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700&display=swap');
  body { margin:0; padding:0; width:100% !important; background:${C.cream}; }
  img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  @media only screen and (max-width:620px) {
    .rm-card-pad { padding:32px 24px 28px !important; }
    .rm-h1 { font-size:25px !important; }
    .rm-logo { width:148px !important; }
    .rm-btn { display:block !important; text-align:center !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background:${C.cream};">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; opacity:0; color:transparent;">${esc(preheader || "")}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cream};">
    <tr><td align="center" style="padding:30px 16px 40px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

        <!-- En-tête : logo -->
        <tr><td align="center" style="padding:6px 0 22px;">
          <img src="${LOGO_URL}" alt="${esc(SHOP_NAME)}" width="172" class="rm-logo" style="display:block; width:172px; max-width:172px; height:auto;">
        </td></tr>

        <!-- Carte sticker -->
        <tr><td style="background:${C.white}; border:2px solid ${C.ink}; border-radius:22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td class="rm-card-pad" style="padding:42px 44px 38px;">
              ${content}
            </td></tr>
          </table>
        </td></tr>

        <!-- Étoiles + pied de page -->
        <tr><td align="center" style="padding:26px 24px 6px;">
          <p style="font-size:15px; letter-spacing:0.5em; color:${C.pink}; margin:0 0 16px;"><span style="color:${C.gold};">&#10038;</span> &#10038; <span style="color:${C.gold};">&#10038;</span></p>
          <p style="font-family:${DISPLAY}; font-size:15px; font-weight:800; letter-spacing:0.04em; color:${C.ink}; margin:0 0 4px;">${SHOP_NAME}</p>
          <p style="font-family:${SANS}; font-size:12px; color:${C.muted}; margin:0;">${SHOP_TAGLINE}</p>
          <p style="font-family:${SANS}; font-size:11px; color:${C.muted}; margin:12px 0 0;">© ${new Date().getFullYear()} ${SHOP_NAME}. Fait main en France.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
