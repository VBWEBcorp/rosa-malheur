import {
  emailShell,
  emailEyebrow,
  emailHeading,
  emailParagraph,
  emailButton,
  emailInfoBox,
  esc,
  EMAIL_COLORS as C,
} from "@/lib/email-layout";

interface NewOrderAdminProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  total: number;
  pickupPoint?: {
    name: string;
    street: string;
    zip: string;
    city: string;
  } | null;
  adminUrl?: string;
}

const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/**
 * Email envoyé à la commerçante (Fanny) à chaque commande payée. Contient tout
 * ce dont elle a besoin pour préparer le colis et créer l'étiquette Mondial
 * Relay en compte particulier : articles, total, coordonnées du client et
 * surtout le POINT RELAIS choisi (nom + adresse).
 */
export function generateNewOrderAdminEmail(props: NewOrderAdminProps): string {
  const fmt = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount / 100);

  const itemRows = props.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid ${C.hairline}; font-family:${SANS}; font-size:14px; color:${C.ink};">${esc(item.name)}</td>
        <td style="padding:12px 0; border-bottom:1px solid ${C.hairline}; font-family:${SANS}; font-size:14px; color:${C.muted}; text-align:center; width:54px;">×${item.quantity}</td>
        <td style="padding:12px 0; border-bottom:1px solid ${C.hairline}; font-family:${SANS}; font-size:14px; color:${C.ink}; font-weight:600; text-align:right; width:90px;">${fmt(item.unitPrice * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const relayBox = props.pickupPoint
    ? `
    <p style="font-family:${SANS}; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:${C.gold}; margin:28px 0 0; font-weight:700;">Point relais à expédier</p>
    ${emailInfoBox(
      `<p style="font-family:${SANS}; font-size:14px; line-height:1.6; color:${C.body}; margin:0;">
        <strong style="color:${C.ink};">${esc(props.pickupPoint.name)}</strong><br>
        ${esc(props.pickupPoint.street)}<br>
        ${esc(props.pickupPoint.zip)} ${esc(props.pickupPoint.city)}
      </p>`
    )}`
    : "";

  const content = `
    ${emailEyebrow("Nouvelle commande")}
    ${emailHeading(`Une commande vient de tomber !`)}
    ${emailParagraph(
      `Commande <strong style="color:${C.ink};">${esc(props.orderNumber)}</strong> payée. Voici tout ce qu'il te faut pour préparer le colis.`
    )}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 8px;">
      <tbody>${itemRows}</tbody>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px;">
      <tr>
        <td style="font-family:${SANS}; font-size:15px; font-weight:700; color:${C.ink};">Total</td>
        <td style="font-family:${SANS}; font-size:15px; font-weight:700; color:${C.ink}; text-align:right;">${fmt(props.total)}</td>
      </tr>
    </table>

    <p style="font-family:${SANS}; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:${C.muted}; margin:28px 0 0;">Client</p>
    ${emailInfoBox(
      `<p style="font-family:${SANS}; font-size:14px; line-height:1.6; color:${C.body}; margin:0;">
        <strong style="color:${C.ink};">${esc(props.customerName)}</strong><br>
        ${esc(props.customerEmail)}${props.customerPhone ? `<br>${esc(props.customerPhone)}` : ""}
      </p>`
    )}

    ${relayBox}

    ${
      props.adminUrl
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 4px;"><tr><td align="center">${emailButton(
            props.adminUrl,
            "Voir la commande"
          )}</td></tr></table>`
        : ""
    }
  `;

  return emailShell({
    title: `Nouvelle commande ${props.orderNumber}`,
    preheader: `Commande ${props.orderNumber} payée — à préparer.`,
    content,
  });
}
