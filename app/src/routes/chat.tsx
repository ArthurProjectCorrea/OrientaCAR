import { createFileRoute, redirect } from "@tanstack/react-router";
import { Sparkles, Send, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSession, useSession } from "@/lib/session";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat IA — OrientaCar" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: ChatPage,
});

type Msg = { id: number; role: "user" | "bot"; text: string };

const suggestions = [
  "Quais são minhas pendências?",
  "Como corrigir documentação inválida?",
  "O que é área divergente?",
  "Como enviar um shapefile?",
];

const answers: Record<string, string> = {
  "Quais são minhas pendências?":
    "Você tem 2 imóveis em análise: Fazenda Boa Esperança (área divergente na reserva legal) e Sítio do Vale (sobreposição com APP). Quer abrir os detalhes?",
  "Como corrigir documentação inválida?":
    "Acesse o CAR com pendência, toque em 'Documentos enviados' e substitua o arquivo. Aceitamos PDF, JPG e shapefile (.zip) até 20 MB.",
  "O que é área divergente?":
    "Área divergente ocorre quando o polígono declarado não bate com a base cartográfica do órgão. Reenvie o shapefile atualizado ou solicite reanálise.",
  "Como enviar um shapefile?":
    "Vá em 'Novo Cadastro' > etapa Documentos e envie o .zip contendo .shp, .shx e .dbf. Validamos a geometria automaticamente.",
};

function ChatPage() {
  const { user } = useSession();
  const firstName = user?.name?.split(" ")[0] ?? "Produtor";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      const reply =
        answers[t] ??
        "Entendi! Vou checar isso no seu cadastro. Enquanto isso, confira a aba CAR para ver o status atual dos seus imóveis.";
      setMessages((m) => [...m, { id: id + 1, role: "bot", text: reply }]);
    }, 600);
  }

  const empty = messages.length === 0;

  return (
    <MobileShell
      header={
        <ScreenHeader
          title="Chat IA"
          right={
            <button
              onClick={() => setMessages([])}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              aria-label="Nova conversa"
            >
              <Plus className="h-4 w-4" />
            </button>
          }
        />
      }
      contentClassName="flex flex-col"
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
        {empty ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-primary shadow-sm">
              <Sparkles className="h-9 w-9" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-primary-dark">Olá, {firstName}!</h2>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Sou o assistente inteligente do OrientaCar. Como posso te ajudar?
            </p>
            <div className="mt-6 w-full space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full rounded-full border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary-soft/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    m.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-card text-foreground"
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
        className="sticky bottom-20 mx-5 mb-2 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-md"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </MobileShell>
  );
}
