import { NextRequest, NextResponse } from "next/server";
import { generateOrderConfirmationEmail } from "@/components/emails/OrderConfirmation";
import { generateNewOrderAdminEmail } from "@/components/emails/NewOrderAdmin";

/**
 * Aperçu local des emails (DEV uniquement) — ouvre dans le navigateur :
 *   /api/email-preview?type=order   → confirmation client
 *   /api/email-preview?type=admin   → notification « nouvelle commande »
 * Renvoie 404 en production pour ne pas exposer la route.
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const type = req.nextUrl.searchParams.get("type") || "order";
  const items = [
    { name: "Laisse multiposition — corde orange", quantity: 1, unitPrice: 4900 },
    { name: "Laisse simple 1,50 m — corde bleue", quantity: 2, unitPrice: 3500 },
  ];

  const html =
    type === "admin"
      ? generateNewOrderAdminEmail({
          orderNumber: "RM-2026-0042",
          customerName: "Camille Durand",
          customerEmail: "camille.durand@example.com",
          customerPhone: "06 12 34 56 78",
          items,
          total: 11900,
          pickupPoint: {
            name: "Tabac Presse du Centre",
            street: "12 rue de la Paix",
            zip: "35000",
            city: "Rennes",
          },
          adminUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/admin/orders`,
        })
      : generateOrderConfirmationEmail({
          orderNumber: "RM-2026-0042",
          customerName: "Camille",
          items,
          subtotal: 11900,
          shippingCost: 0,
          discount: 0,
          giftCardAmount: 0,
          total: 11900,
          shippingAddress: {
            name: "Camille Durand",
            street: "Tabac Presse du Centre, 12 rue de la Paix",
            city: "Rennes",
            zip: "35000",
            country: "FR",
          },
        });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
