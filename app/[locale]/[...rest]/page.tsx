import { notFound } from "next/navigation";

/**
 * Catch-all so any unknown path under a locale (including `/xx/...`, which the
 * middleware rewrites under `en`) renders the localized 404 inside the layout.
 */
export default function UnknownPage() {
  notFound();
}
