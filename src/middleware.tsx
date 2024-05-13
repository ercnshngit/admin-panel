import { verifyJwtToken } from "@/libs/jose";
import { NextResponse } from "next/server";
import cors from "./utils/cors";

const isAuthPages = (url: string) =>
  url.startsWith("/login") || url.startsWith("/register");

export async function middleware(request: any) {
  const path = request.nextUrl.pathname;
  // api auth middleware
  if (request.nextUrl.pathname.startsWith("/api")) {
    try {
      const response = await NextResponse.next();
      if (request.method === "OPTIONS") {
        return cors(
          request,
          new Response(null, {
            status: 204,
          })
        );
      }
      return response;
    } catch (error: any) {
      console.log(error);
      return new Response(
        JSON.stringify({
          error: error.message == null ? error : error.message,
        }),
        {
          status: 500,
        }
      );
    }
  }

  // front auth middleware
  else {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      const { url, nextUrl, cookies } = request;
      const { value: token } = cookies.get("token") ?? { value: null };
      const hasVerifiedToken = token && (await verifyJwtToken(token));
      if (isAuthPages(nextUrl.pathname)) {
        if (!hasVerifiedToken) {
          const response = NextResponse.next();
          response.cookies.delete("token");
          return response;
        }
        request.nextUrl.pathname = "/dashboard";
        return NextResponse.redirect(request.nextUrl);
      }

      if (!hasVerifiedToken) {
        const searchParams = new URLSearchParams(nextUrl.searchParams);
        searchParams.set("next", nextUrl.pathname);

        const response = NextResponse.redirect(
          new URL(`/login?${searchParams}`, url)
        );
        response.cookies.delete("token");

        return response;
      }
    } else {
      const cookiesStore = request.cookies;
      const defaultLanguage = cookiesStore.get("language") || "en";
      if (request.nextUrl.pathname.startsWith("/homepage")) {
        if (defaultLanguage === "tr") {
          request.nextUrl.pathname = "/anasayfa";
          return NextResponse.redirect(request.nextUrl);
        }
      } else if (request.nextUrl.pathname.startsWith("/anasayfa")) {
        if (defaultLanguage === "en") {
          request.nextUrl.pathname = "/homepage";
          return NextResponse.redirect(request.nextUrl);
        }
      }

      if (
        request.nextUrl.pathname === "/" ||
        request.nextUrl.pathname === "" ||
        request.nextUrl.pathname.startsWith("/?")
      ) {
        if (defaultLanguage === "tr") {
          request.nextUrl.pathname = "/anasayfa";
        } else {
          request.nextUrl.pathname = "/homepage";
        }
        return NextResponse.redirect(request.nextUrl);
      } else if (
        request.nextUrl.pathname === "/egitim/" ||
        request.nextUrl.pathname === "/egitim" ||
        request.nextUrl.pathname.startsWith("/egitim?")
      ) {
        request.nextUrl.pathname = "/egitim/homepage";
        return NextResponse.redirect(request.nextUrl);
      } else {
        return NextResponse.next();
      }
    }
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
