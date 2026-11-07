// HS256 JWT signing and verification using WebCrypto (Workers-compatible).
// Token format matches the Go backend (internal/auth/jwt.go) so existing
// clients and tokens stay valid.

export type TokenType = "access" | "refresh";

export interface Claims {
  userId: string;
  email: string;
  name: string;
  role: string;
  tokenType: TokenType;
  exp: number;
  iat: number;
  nbf: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeString(value: string): string {
  return base64UrlEncodeBytes(encoder.encode(value));
}

function base64UrlDecodeToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

const ACCESS_TTL_SECONDS = 24 * 60 * 60;
const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;

export async function signToken(
  secret: string,
  user: { userId: string; email: string; name: string; role: string },
  tokenType: TokenType,
): Promise<string> {
  if (!secret) throw new Error("secret key is not configured");

  const now = Math.floor(Date.now() / 1000);
  const ttl = tokenType === "refresh" ? REFRESH_TTL_SECONDS : ACCESS_TTL_SECONDS;
  const header = base64UrlEncodeString(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncodeString(
    JSON.stringify({ ...user, tokenType, iat: now, nbf: now, exp: now + ttl }),
  );
  const signingInput = `${header}.${payload}`;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(signingInput));
  return `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

export async function verifyToken(secret: string, token: string): Promise<Claims> {
  if (!secret) throw new Error("secret key is not configured");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("invalid token");
  const [headerPart, payloadPart, signaturePart] = parts;

  const header = JSON.parse(decoder.decode(base64UrlDecodeToBytes(headerPart))) as { alg?: string };
  if (header.alg !== "HS256") throw new Error("unexpected signing method");

  const valid = await crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret),
    base64UrlDecodeToBytes(signaturePart),
    encoder.encode(`${headerPart}.${payloadPart}`),
  );
  if (!valid) throw new Error("invalid token");

  const claims = JSON.parse(decoder.decode(base64UrlDecodeToBytes(payloadPart))) as Claims;
  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== "number" || claims.exp < now) throw new Error("token expired");
  if (typeof claims.nbf === "number" && claims.nbf > now) throw new Error("token not yet valid");

  return claims;
}
