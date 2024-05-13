"use client";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { LanguageContextProvider } from "@/contexts/language-context";
import { ReactQueryWrapper } from "@/libs/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { ReCaptchaProvider } from "next-recaptcha-v3";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    // for development purposes
    <ReactQueryWrapper>
      <LanguageContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReCaptchaProvider
            reCaptchaKey="6LfjFb8pAAAAAOno-LzTWXH4G83qXGM5Fgx0tCSl"
            language="tr"
            useEnterprise
          >
            {children} <ReactQueryDevtools initialIsOpen={true} />
          </ReCaptchaProvider>
        </ThemeProvider>
      </LanguageContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryWrapper>
  );
}
