import { Sparkles, X, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Msg = { id: number; role: "user" | "bot"; text: string };

export function AiHelper({ context }: { context?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const quickAsks = [
    "O que é Reserva Legal?",
    "O que é APP?",
    "Como marcar a sede?",
    "Quais documentos preciso?",
  ];

  const answers: Record<string, string> = {
    "O que é Reserva Legal?":
      "Reserva Legal é a área dentro da propriedade rural destinada à conservação da vegetação nativa — varia de 20% a 80% conforme o bioma (Lei 12.651/2012).",
    "O que é APP?":
      "Área de Preservação Permanente protege margens de rios, nascentes, topos de morro e encostas íngremes. Não pode ser desmatada.",
    "Como marcar a sede?":
      "Na etapa de georreferenciamento toque em 'Marcar Sede' e arraste o pino até a casa/edificação principal. É obrigatório no SICAR.",
    "Quais documentos preciso?":
      "CCIR, ITR, matrícula ou posse, CPF/RG do proprietário e shapefile do perímetro (se já tiver).",
  };

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      const reply =
        answers[t] ??
        `Sobre "${context ?? "esta etapa"}": posso explicar terminologias do CAR, exigências do SICAR e como preencher cada campo. Reformule sua dúvida que eu ajudo!`;
      setMessages((m) => [...m, { id: id + 1, role: "bot", text: reply }]);
    }, 500);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          aria-label="Assistente IA"
        >
          <Sparkles className="h-5 w-5" />
          Ajuda IA
        </button>
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-3 pb-20">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <div>
                  <p className="text-sm font-bold leading-none">Assistente OrientaCar</p>
                  {context && <p className="mt-0.5 text-[10px] opacity-90">Ajuda sobre: {context}</p>}
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="rounded-full p-1 hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="max-h-72 overflow-y-auto px-3 py-3">
              {messages.length === 0 ? (
                <div className="space-y-2">
                  <p className="px-1 text-xs text-muted-foreground">Dúvidas frequentes:</p>
                  {quickAsks.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-xs hover:border-primary hover:bg-primary-soft/40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {messages.map((m) => (
                    <li key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                          m.role === "user"
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm bg-muted text-foreground"
                        }`}
                      >
                        {m.text}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-background px-3 py-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte algo..."
                className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                aria-label="Enviar"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
