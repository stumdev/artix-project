// hooks/useAutoSlug.ts
"use client";
import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/slug";

type UseAutoSlugOpts = {
  name: string;
  slug: string;
  setSlug: (v: string) => void;
  initialAuto?: boolean;
};

export function useAutoSlug({ name, slug, setSlug, initialAuto }: UseAutoSlugOpts) {
  const [isAuto, setIsAuto] = useState<boolean>(
    initialAuto ?? (typeof slug === "string" ? slug.trim() === "" : true)
  );
  const lastAutoRef = useRef<string>("");

  useEffect(() => {
    if (!isAuto) return;
    const next = slugify(name ?? "");
    lastAutoRef.current = next;
    if (next !== slug) setSlug(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, isAuto]);

  function onSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (v !== lastAutoRef.current) setIsAuto(false);
  }

  function regenerateFromName() {
    setIsAuto(true);
    const next = slugify(name ?? "");
    lastAutoRef.current = next;
    setSlug(next);
  }

  function ensureSlugFromNameIfEmpty(currentName: string, currentSlug: string) {
    if (!currentSlug?.trim()) {
      const next = slugify(currentName ?? "");
      lastAutoRef.current = next;
      setSlug(next);
      return next;
    }
    return currentSlug;
  }

  return { isAuto, onSlugChange, regenerateFromName, ensureSlugFromNameIfEmpty,
    disableAuto: () => setIsAuto(false), enableAuto: () => setIsAuto(true) };
}
