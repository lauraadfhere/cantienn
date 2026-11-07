// Worker runtime configuration. Values come from Worker variables/secrets
// (process.env is populated by OpenNext on Cloudflare; see wrangler.jsonc).

export interface ParseConfig {
  serverUrl: string;
  appId: string;
  restKey: string;
  masterKey: string;
}

export interface BackendConfig {
  siteName: string;
  siteUrl: string;
  jwtSecret: string;
  parse: ParseConfig | null;
}

export function getBackendConfig(): BackendConfig {
  const env = process.env;
  const parseServerUrl = (env.PARSE_SERVER_URL || "").replace(/\/$/, "");
  const parseAppId = env.PARSE_APP_ID || "";
  const parseRestKey = env.PARSE_REST_KEY || "";

  return {
    siteName: env.SITE_NAME || "WIPPEL",
    siteUrl: env.SITE_URL || "",
    jwtSecret: env.JWT_SECRET || env.SESSION_SECRET || "",
    parse: parseServerUrl && parseAppId && parseRestKey
      ? { serverUrl: parseServerUrl, appId: parseAppId, restKey: parseRestKey, masterKey: env.PARSE_MASTER_KEY || "" }
      : null,
  };
}
