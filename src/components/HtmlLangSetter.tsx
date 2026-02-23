"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

export function HtmlLangSetter() {
  const lang = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
