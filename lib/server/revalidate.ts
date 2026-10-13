import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { withRevalidation, type ContentResource } from "@/lib/cache-tags";

/** Admin write handlers: `export const PUT = revalidating(["reviews"], handlePut)`. */
export function revalidating<A extends unknown[]>(
  resources: readonly ContentResource[],
  handler: (...args: A) => Promise<Response>,
) {
  return withRevalidation(resources, handler, { revalidateTag, revalidatePath });
}
