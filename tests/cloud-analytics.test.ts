import { describe, expect, it } from "vitest";
import { anonymizeAppUrl } from "@/components/cloud/cloud-analytics";
import { isCloudService } from "@/components/cloud/cloud-service";

describe("app.succuro.com analytics", () => {
  it("replaces ids, tokens and dynamic segments, and drops the query string", () => {
    expect(anonymizeAppUrl("https://app.succuro.com/")).toBe("https://app.succuro.com/");
    expect(anonymizeAppUrl("https://app.succuro.com/tickets?q=refund+jane%40acme.example&status=open")).toBe("https://app.succuro.com/tickets");
    expect(anonymizeAppUrl("https://app.succuro.com/tickets/1042#reply")).toBe("https://app.succuro.com/tickets/[id]");
    expect(anonymizeAppUrl("https://app.succuro.com/tickets/new")).toBe("https://app.succuro.com/tickets/new");
    expect(anonymizeAppUrl("https://app.succuro.com/tickets/screened")).toBe("https://app.succuro.com/tickets/screened");
    expect(anonymizeAppUrl("https://app.succuro.com/t/Zm9vYmFyLXRva2Vu")).toBe("https://app.succuro.com/t/[token]");
    expect(anonymizeAppUrl("https://app.succuro.com/settings/saved-replies")).toBe("https://app.succuro.com/settings/saved-replies");
    expect(anonymizeAppUrl("https://app.succuro.com/connections/zendesk")).toBe("https://app.succuro.com/connections/[kind]");
    expect(anonymizeAppUrl("https://app.succuro.com/workspace/w_42")).toBe("https://app.succuro.com/workspace/[workspace]");
    expect(anonymizeAppUrl("https://app.succuro.com/tickets/1042/acme")).toBe("https://app.succuro.com/tickets/[id]/[id]");
  });

  it("runs only on the hosted service, never on a copy or a self-hosted instance", () => {
    expect(isCloudService({ VERCEL_GIT_REPO_OWNER: "Succuro", VERCEL_GIT_REPO_SLUG: "succuro-cloud" })).toBe(true);
    expect(isCloudService({ VERCEL_GIT_REPO_OWNER: "FAKGR0UP", VERCEL_GIT_REPO_SLUG: "succuro-instance" })).toBe(false);
    expect(isCloudService({})).toBe(false);
  });
});
