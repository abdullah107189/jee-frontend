import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/customer", "/seller", "/admin"];
const API_URL = process.env.API_URL!;

/**
 * Auto-refresh at the proxy (browser request) layer.
 *
 * ✅ proxy response = real browser response → Set-Cookie reaches the browser.
 * ⚠️ Edge runtime: plain fetch + manual Set-Cookie parsing, no JWT libraries.
 *
 * Flow:
 *   fresh accessToken                → next()
 *   missing/expired access + refresh → POST Express /auth/refresh-token,
 *      forward new cookies to browser via NextResponse,
 *      inject fresh token via `x-access-token` header so RSC auth() only reads.
 *   refresh failure                  → /login?redirect=...
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Fresh (not expired) access token → proceed untouched
  if (accessToken && !isAccessExpired(accessToken)) {
    return NextResponse.next();
  }

  // Access missing / expired → must refresh
  if (!refreshToken) {
    return redirectToLogin(request, pathname);
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      cache: "no-store",
    });

    // Refresh failed → refresh token expired/revoked → login
    if (!res.ok) {
      return redirectToLogin(request, pathname);
    }

    const setCookies = res.headers.getSetCookie?.() ?? [];
    const json = await res.json().catch(() => null);
    const newAccessToken =
      json?.data?.accessToken ?? cookieValue(setCookies, "accessToken");

    // Fresh token for THIS request's Server Components (RSC reads only)
    const requestHeaders = new Headers(request.headers);
    if (newAccessToken) {
      requestHeaders.set("x-access-token", newAccessToken);
    }

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Forward Express Set-Cookie (new accessToken + refreshToken) → browser
    for (const cookieStr of setCookies) {
      setCookieFromHeader(response, cookieStr);
    }

    return response;
  } catch {
    return redirectToLogin(request, pathname);
  }
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * Decode JWT `exp` claim — expiry check only, no crypto verification.
 * Edge-safe (atob + TextDecoder), zero dependencies.
 */
function isAccessExpired(token: string): boolean {
  try {
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return true;

    const payload = JSON.parse(decodeBase64Url(payloadB64));
    const exp = (payload as { exp?: number }).exp;

    if (typeof exp !== "number") return true;

    // 5s skew buffer → avoids /me 401 races at the expiry edge
    return Date.now() >= (exp - 5) * 1000;
  } catch {
    return true;
  }
}

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
}

/** Parse a raw `Set-Cookie` header string → response.cookies.set(...). */
function setCookieFromHeader(response: NextResponse, cookieStr: string): void {
  const semi = cookieStr.indexOf(";");
  const nameValue = semi === -1 ? cookieStr : cookieStr.slice(0, semi);
  const eq = nameValue.indexOf("=");
  if (eq <= 0) return;

  const name = nameValue.slice(0, eq).trim();
  const value = nameValue.slice(eq + 1).trim();

  const options: CookieOptions = { path: "/" };
  const attrs = semi === -1 ? [] : cookieStr.slice(semi + 1).split(";");

  for (const rawAttr of attrs) {
    const attr = rawAttr.trim();
    const sep = attr.indexOf("=");
    const key = (sep === -1 ? attr : attr.slice(0, sep)).toLowerCase();
    const val = sep === -1 ? "" : attr.slice(sep + 1);

    switch (key) {
      case "path":
        options.path = val;
        break;
      case "domain":
        options.domain = val;
        break;
      case "expires":
        options.expires = new Date(val);
        break;
      case "max-age": {
        const n = parseInt(val, 10);
        if (Number.isFinite(n)) options.maxAge = n;
        break;
      }
      case "secure":
        options.secure = true;
        break;
      case "httponly":
        options.httpOnly = true;
        break;
      case "samesite":
        options.sameSite = val.toLowerCase() as "lax" | "strict" | "none";
        break;
    }
  }

  response.cookies.set(name, value, options);
}

/** Get a cookie value from raw `Set-Cookie` header strings. */
function cookieValue(setCookies: string[], name: string): string | null {
  for (const cookieStr of setCookies) {
    const eq = cookieStr.indexOf("=");
    if (eq <= 0) continue;
    if (cookieStr.slice(0, eq).trim() !== name) continue;
    const semi = cookieStr.indexOf(";", eq);
    return (
      semi === -1 ? cookieStr.slice(eq + 1) : cookieStr.slice(eq + 1, semi)
    ).trim();
  }
  return null;
}

export const config = {
  matcher: ["/customer/:path*", "/seller/:path*", "/admin/:path*"],
};
