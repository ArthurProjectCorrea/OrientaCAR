import { Accessibility, X, Type, Contrast, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useA11y } from "@/lib/a11y";

export function A11yButton() {
  const [open, setOpen] = useState(false);
  const { scale, setScale, contrast, toggleContrast, voice, toggleVoice, stopSpeak } = useA11y();

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Acessibilidade"
        className="fixed bottom-24 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-earth text-earth-foreground shadow-lg shadow-earth/30 ring-4 ring-earth/15"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md p-3 pb-24">
          <div data-a11y-panel className="rounded-3xl border border-border bg-card p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Acessibilidade</h3>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Type className="h-4 w-4" /> Tamanho do texto
            </p>
            <div className="mb-5 grid grid-cols-4 gap-2">
              {([0, 1, 2, 3] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`rounded-xl border-2 py-3 font-bold ${
                    scale === s ? "border-primary bg-primary-soft text-primary-dark" : "border-border bg-background"
                  }`}
                  style={{ fontSize: `${14 + s * 3}px` }}
                >
                  A
                </button>
              ))}
            </div>

            <button
              onClick={toggleContrast}
              className={`mb-3 flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-semibold ${
                contrast ? "border-primary bg-primary-soft" : "border-border bg-background"
              }`}
            >
              <Contrast className="h-5 w-5" />
              <span className="flex-1">Alto contraste</span>
              <span className={`text-xs ${contrast ? "text-primary-dark" : "text-muted-foreground"}`}>
                {contrast ? "Ligado" : "Desligado"}
              </span>
            </button>

            <button
              onClick={() => {
                toggleVoice();
                if (voice) stopSpeak();
              }}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-semibold ${
                voice ? "border-primary bg-primary-soft" : "border-border bg-background"
              }`}
            >
              {voice ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              <span className="flex-1">
                Ler em voz alta
                <span className="block text-xs font-normal text-muted-foreground">
                  Toque em qualquer texto para ouvir
                </span>
              </span>
              <span className={`text-xs ${voice ? "text-primary-dark" : "text-muted-foreground"}`}>
                {voice ? "Ligado" : "Desligado"}
              </span>
            </button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Pensado para você se sentir em casa no aplicativo.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
