/**
 * True only for the hosted service, app.succuro.com: a Vercel build of Succuro/succuro-cloud
 * (production and its previews). A copy of this repository deployed from
 * another repository, and a self-hosted instance, run without analytics.
 */
export function isCloudService(env: Record<string, string | undefined> = process.env): boolean {
  return env.VERCEL_GIT_REPO_OWNER?.toLowerCase() === "succuro" && env.VERCEL_GIT_REPO_SLUG === "succuro-cloud";
}
