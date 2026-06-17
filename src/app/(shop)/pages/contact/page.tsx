import { redirect } from "next/navigation";

/**
 * Ancienne page de contact (design hérité du template). La vraie page de
 * contact rebrandée vit sur `/contact`. On redirige pour éviter tout doublon.
 */
export default function LegacyContactRedirect() {
  redirect("/contact");
}
