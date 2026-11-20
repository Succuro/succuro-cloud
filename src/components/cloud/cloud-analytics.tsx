"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { EngagedEvent } from "./engaged-event";

/**
 * The application's pages, from app/: a [placeholder] segment is a
 * workspace, record or token that must never reach analytics. More static
 * routes come before the dynamic ones they would also match.
 */
const ROUTES = [
  "/",
  "/connections",
  "/connections/[kind]",
  "/consent",
  "/join/[token]",
  "/keys",
  "/reset-password",
  "/settings",
  "/settings/categories",
  "/settings/products",
  "/settings/saved-replies",
  "/sign-in",
  "/t/[token]",
  "/tickets",
  "/tickets/new",
  "/tickets/screened",
  "/tickets/[id]",
  "/welcome",
  "/workspace/[workspace]",
];

const STATIC_SEGMENTS = new Set(ROUTES.flatMap((route) => route.split("/").filter((s) => s && !s.startsWith("["))))

/**
 * Page path without customer data: ids, tokens and other dynamic segments
 * become their [placeholder], the query string and hash are dropped. A path
 * that is not a known page keeps only the application's own words, every
 * other segment becomes [id]. Exported for the tests.
 */
export function anonymizeAppUrl(url: string): string {
  const parsed = new URL(url);
  const segments = parsed.pathname.split("/").filter(Boolean);
  const route = ROUTES.map((r) => r.split("/").filter(Boolean)).find(
    (parts) => parts.length === segments.length && parts.every((part, i) => part.startsWith("[") || part === segments[i]),
  );
  const anonymized = route ?? segments.map((segment) => (STATIC_SEGMENTS.has(segment) ? segment : "[id]"));
  return `${parsed.origin}/${anonymized.join("/")}`;
}

/**
 * Vercel Web Analytics on app.succuro.com, rendered by the root layout only when
 * isCloudService(): cookieless page views with anonymized paths, plus the
 * `engaged` event (the input kind only). The referrer policy keeps in-app
 * referrers to the origin, so the script never reports a record's path.
 */
export function CloudAnalytics() {
  return (
    <>
      <meta name="referrer" content="strict-origin" />
      <Analytics beforeSend={(event: BeforeSendEvent) => ({ ...event, url: anonymizeAppUrl(event.url) })} />
      <EngagedEvent />
    </>
  );
}
