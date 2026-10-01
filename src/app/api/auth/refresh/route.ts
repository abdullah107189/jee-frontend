import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token" },
        { status: 401 },
      );
    }

    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return NextResponse.json(
        { success: false, message: json.message ?? "Refresh failed" },
        { status: 401 },
      );
    }

    // ✅ Route Handler e set LEGAL
    const response = NextResponse.json({
      success: true,
      accessToken: json.data.accessToken,
    });

    // Forward Express Set-Cookie headers
    const setCookieHeaders = res.headers.getSetCookie?.() ?? [];
    for (const cookieStr of setCookieHeaders) {
      const [nameValue, ...attrs] = cookieStr.split("; ");
      const [name, ...valueParts] = nameValue.split("=");
      const value = valueParts.join("=");

      const options: {
        path?: string;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "lax" | "strict" | "none";
        maxAge?: number;
      } = {};

      for (const attr of attrs) {
        const [k, ...vParts] = attr.split("=");
        const v = vParts.join("=");
        const key = k.toLowerCase();

        if (key === "path") options.path = v;
        else if (key === "httponly") options.httpOnly = true;
        else if (key === "secure") options.secure = true;
        else if (key === "samesite")
          options.sameSite = v.toLowerCase() as "lax" | "strict" | "none";
        else if (key === "max-age") options.maxAge = parseInt(v, 10);
      }

      if (!options.path) options.path = "/";

      response.cookies.set(name, value, options);
    }

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Network error" },
      { status: 500 },
    );
  }
}
