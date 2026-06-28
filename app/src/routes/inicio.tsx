import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import {
  Sparkles, Plus, Scale, MapPinned, Newspaper, FileText, ChevronRight, Play, Pause,
  ClipboardCheck, LifeBuoy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSession, useSession, listDrafts } from "@/lib/session";
import { MobileShell } from "@/components/mobile-shell";
import ruralHero from "@/assets/rural-hero.jpg";


export const Route = createFileRoute("/inicio")({
  head: () => ({ meta: [{ title: "Início — OrientaCar" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: InicioPage,
});

const news = [
  {
    icon: Scale,
    tag: "Lei",
    title: "Novo Código Florestal — o que muda pra você",
    body: "Resumo simples das regras de Reserva Legal e APP para pequenos produtores.",
  },
  {
    icon: Sparkles,
    tag: "Novidade",
    title: "CAR Pré-Preenchido já funciona",
    body: "O sistema busca os dados do seu imóvel no INCRA e no CCIR pra você só conferir.",
  },
  {
    icon: MapPinned,
    tag: "Mapa",
    title: "Camadas atualizadas",
    body: "Terras Indígenas, Unidades de Conservação e áreas embargadas com base mais recente.",
  },
  {
    icon: FileText,
    tag: "Crédito",
    title: "Pronaf exige CAR válido",
    body: "Veja como manter seu cadastro regular para liberar crédito rural.",
  },
  {
    icon: Newspaper,
    tag: "Prazo",
    title: "Inscrição prorrogada",
    body: "Você tem até 31/12/2026 pra fazer ou ajustar seu CAR.",
  },
];

function InicioPage() {
  const { user } = useSession();
  const firstName = user?.name?.split(" ")[0] ?? "Produtor";
  const [drafts, setDrafts] = useState(0);

  useEffect(() => {
    setDrafts(listDrafts().filter((d) => !d.enviado).length);
  }, []);

  return (
    <MobileShell
      header={
        <header className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark px-5 pb-16 pt-10 text-primary-foreground">
          <img
            src={ruralHero}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-soft-light"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary-dark/80 to-transparent" />
          <div className="relative">
            <p className="text-sm opacity-90">Bom te ver de novo,</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight">Seu {firstName}</h1>
            <p className="mt-2 text-sm opacity-95">
              Aqui você cuida do seu CAR com calma e sem complicação.
            </p>
          </div>
        </header>
      }

    >
      <section className="-mt-6 px-4">
        <NewsCarousel />
      </section>

      <section className="mt-4 px-4">
        <Link
          to="/car/checklist"
          className="flex items-center gap-4 rounded-3xl bg-earth p-5 text-earth-foreground shadow-lg shadow-earth/20"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Plus className="h-7 w-7" />
          </span>
          <span className="flex-1">
            <span className="block text-lg font-bold">Começar um CAR novo</span>
            <span className="block text-sm opacity-90">A gente te guia passo a passo</span>
          </span>
          <ChevronRight className="h-6 w-6" />
        </Link>
      </section>

      {drafts > 0 && (
        <section className="mt-3 px-4">
          <Link
            to="/car"
            className="flex items-center gap-3 rounded-2xl border-2 border-warning bg-warning/10 p-4"
          >
            <ClipboardCheck className="h-6 w-6 text-warning-foreground" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">
                Você tem {drafts} cadastro{drafts > 1 ? "s" : ""} pra terminar
              </p>
              <p className="text-xs text-muted-foreground">Toque pra continuar de onde parou.</p>
            </div>
          </Link>
        </section>
      )}

      <section className="mt-4 px-4 pb-4">
        <h2 className="mb-3 text-base font-bold text-foreground">Atalhos</h2>
        <div className="grid grid-cols-2 gap-3">
          <Shortcut to="/car" icon={<MapPinned className="h-6 w-6" />} title="Meus imóveis" />
          <Shortcut to="/chat" icon={<LifeBuoy className="h-6 w-6" />} title="Pedir ajuda" />
        </div>
      </section>
    </MobileShell>
  );
}

function NewsCarousel() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % news.length), 5000);
    return () => clearInterval(t);
  }, [playing]);

  useEffect(() => {
    const el = ref.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [idx]);

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Avisos importantes</h2>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground shadow"
          aria-label={playing ? "Pausar carrossel" : "Reproduzir carrossel"}
        >
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {playing ? "Pausar" : "Iniciar"}
        </button>
      </div>

      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== idx) setIdx(i);
        }}
      >
        {news.map((n) => (
          <article
            key={n.title}
            className="min-w-[90%] snap-start rounded-3xl border border-border bg-card p-5 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <n.icon className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-earth/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-earth">
                {n.tag}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold leading-snug text-foreground">{n.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {news.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Aviso ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </>
  );
}

function Shortcut({ to, icon, title }: { to: string; icon: React.ReactNode; title: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        {icon}
      </span>
      <span className="text-sm font-bold text-foreground">{title}</span>
    </Link>
  );
}
