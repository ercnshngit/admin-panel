"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "universal-cookie";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  setLanguageWithoutCookie: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageContextProvider({ children }: { children: ReactNode }) {
  const cookies = new Cookies();
  const defaultLanguage = cookies.get("language") || "en";
  const [language, setLanguage] = useState<string>(defaultLanguage);

  const setLanguageWithoutCookie = (lang: string) => {
    setLanguage(lang);
  };
  const setLanguageWithCookie = (lang: string) => {
    setLanguage(lang);
    cookies.set("language", lang, {
      path: "/",
    });
  };

  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (path.startsWith("/homepage")) {
      if (language === "tr") {
        router.push("/anasayfa");
        router.refresh();
      }
    } else if (path.startsWith("/anasayfa")) {
      if (language === "en") {
        console.log("burasi calisti2");

        router.push("/homepage");
      }
    }
  }, [language, path, router]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setLanguageWithCookie,
        setLanguageWithoutCookie,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageContext");
  }

  return context;
}
