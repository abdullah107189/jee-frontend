import { cookies } from "next/headers";

/**
 * Express backend er `Set-Cookie` header Next.js cookie store e forward kore.
 */
export async function forwardSetCookies(res: Response): Promise<void> {
  const setCookieHeaders = res.headers.getSetCookie?.() ?? [];
  if (!setCookieHeaders.length) return;

  const store = await cookies();

  for (const cookieStr of setCookieHeaders) {
    const [nameValue, ...attrParts] = cookieStr.split("; ");
    const [name, ...valueParts] = nameValue.split("=");
    const value = valueParts.join("=");

    const options: {
      path?: string;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
      maxAge?: number;
      expires?: Date;
    } = {};

    for (const attr of attrParts) {
      const [k, ...vParts] = attr.split("=");
      const v = vParts.join("=");
      const key = k.toLowerCase();

      if (key === "path") options.path = v;
      else if (key === "httponly") options.httpOnly = true;
      else if (key === "secure") options.secure = true;
      else if (key === "samesite")
        options.sameSite = v.toLowerCase() as "lax" | "strict" | "none";
      else if (key === "max-age") options.maxAge = parseInt(v, 10);
      else if (key === "expires") options.expires = new Date(v);
      // domain skip — Next.js nijেই handle korbe
    }

    if (!options.path) options.path = "/";

    store.set(name, value, options);
  }
}

/**
 * Auth cookies clear kore (logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete("accessToken");
  store.delete("refreshToken");
}
