"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useLanguage } from "@/contexts/language-context";

export default function LanguageSwitcher({
  defaultLanguage,
  raw,
}: {
  defaultLanguage?: "tr" | "en";
  raw?: boolean;
}) {
  const { language, setLanguageWithoutCookie } = useLanguage();

  useEffect(() => {
    if (defaultLanguage === undefined) return;
    if (language === defaultLanguage) return;
    setLanguageWithoutCookie(defaultLanguage);
  }, [defaultLanguage]);

  if (raw) {
    return (
      <Tabs value={language} onValueChange={setLanguageWithoutCookie}>
        <TabsList>
          <TabsTrigger value="tr">TR</TabsTrigger>
          <TabsTrigger value="en">EN</TabsTrigger>
        </TabsList>
      </Tabs>
    );
  }

  return (
    <nav className="flex items-center justify-between py-2 mb-2 border-b border-border">
      <button
        type="button"
        onClick={() =>
          setLanguageWithoutCookie(language === "tr" ? "en" : "tr")
        }
      >
        İçerik Dili:
      </button>
      <Tabs value={language} onValueChange={setLanguageWithoutCookie}>
        <TabsList>
          <TabsTrigger value="tr">TR</TabsTrigger>
          <TabsTrigger value="en">EN</TabsTrigger>
        </TabsList>
      </Tabs>
    </nav>
  );
}
