"use client";
import { useLanguage } from "@/contexts/language-context";
import { getGeneralBySlug } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect } from "react";
import Cookies from "universal-cookie";

export default function LanguageSwitcherController() {
  const { setLanguage } = useLanguage();
  const { data: switcher } = useQuery(["language-switcher"], () =>
    getGeneralBySlug("language-switcher")
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (switcher && !!!switcher?.status) {
      setLanguage("en");
      if (pathname === "/anasayfa") {
        console.log("burasi calisti");
        router.push("/homepage");
      }
    }
  }, [switcher]);
  return null;
}
