import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type A11yState = {
  scale: 0 | 1 | 2 | 3;
  contrast: boolean;
  voice: boolean;
  setScale: (s: 0 | 1 | 2 | 3) => void;
  toggleContrast: () => void;
  toggleVoice: () => void;
  speak: (text: string) => void;
  stopSpeak: () => void;
};

const Ctx = createContext<A11yState | null>(null);
const KEY = "orientacar_a11y";

export function A11yProvider({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<0 | 1 | 2 | 3>(0);
  const [contrast, setContrast] = useState(false);
  const [voice, setVoice] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setScale(s.scale ?? 0);
        setContrast(!!s.contrast);
        setVoice(!!s.voice);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ scale, contrast, voice }));
  }, [scale, contrast, voice]);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = "pt-BR";
      u.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const pt = voices.find((v) => v.lang?.toLowerCase().startsWith("pt"));
      if (pt) u.voice = pt;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn("speech failed", e);
    }
  }
  function stopSpeak() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", handler);
    handler();
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", handler);
  }, []);

  useEffect(() => {
    if (!voice || typeof window === "undefined") return;
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-a11y-panel]")) return;
      if (target.closest("input, textarea, select")) return;
      const el = target.closest<HTMLElement>(
        "button, a, h1, h2, h3, h4, p, li, label, span, div[role='button']"
      );
      const text = (el?.innerText || target.innerText || "").trim();
      if (text && text.length < 600) speak(text);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [voice]);

  return (
    <Ctx.Provider
      value={{
        scale,
        contrast,
        voice,
        setScale,
        toggleContrast: () => setContrast((c) => !c),
        toggleVoice: () => setVoice((v) => !v),
        speak,
        stopSpeak,
      }}
    >
      <div
        className={[
          scale === 1 && "a11y-scale-1",
          scale === 2 && "a11y-scale-2",
          scale === 3 && "a11y-scale-3",
          contrast && "a11y-contrast",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useA11y() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useA11y must be inside A11yProvider");
  return c;
}

/* Tap-to-speak: when voice mode is on, clicking text reads it aloud */
export function SpeakOnTap({
  children,
  text,
  className = "",
}: {
  children: ReactNode;
  text: string;
  className?: string;
}) {
  const { voice, speak } = useA11y();
  return (
    <span
      className={className}
      onClick={voice ? () => speak(text) : undefined}
      role={voice ? "button" : undefined}
    >
      {children}
    </span>
  );
}
