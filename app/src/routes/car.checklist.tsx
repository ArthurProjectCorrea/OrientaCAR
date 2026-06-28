import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, HelpCircle, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { getSession, emptyDraft, saveDraft } from "@/lib/session";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";

export const Route = createFileRoute("/car/checklist")({
  head: () => ({ meta: [{ title: "Antes de começar — OrientaCar" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: ChecklistPage,
});

type Item = {
  key: string;
  title: string;
  desc: string;
  help: {
    como: string;
    custo: string;
    onde: string;
    link?: { label: string; url: string };
  };
};

const items: Item[] = [
  {
    key: "cpf",
    title: "CPF e data de nascimento dos proprietários",
    desc: "De cada pessoa que é dona ou possuidora do imóvel.",
    help: {
      como: "Olhe na sua carteira de identidade, CPF ou título de eleitor.",
      custo: "Não tem custo. Se perdeu o CPF, dá pra emitir de graça pela internet.",
      onde: "Procure a Receita Federal ou um banco/correios.",
      link: { label: "Emitir CPF (Receita Federal)", url: "https://www.gov.br/receitafederal/pt-br/servicos/cadastro/cpf" },
    },
  },
  {
    key: "ccir",
    title: "CCIR — Certificado do INCRA",
    desc: "Comprova que o imóvel está cadastrado no INCRA.",
    help: {
      como: "Baixe pelo site do INCRA usando o código do imóvel.",
      custo: "A consulta é gratuita.",
      onde: "Portal do INCRA na internet.",
      link: { label: "Baixar CCIR no INCRA", url: "https://sncr.serpro.gov.br/ccir/emissao" },
    },
  },
  {
    key: "matricula",
    title: "Matrícula ou comprovante de posse",
    desc: "Documento do cartório que mostra que a terra é sua.",
    help: {
      como: "Vá ao cartório de registro de imóveis da sua região e peça uma certidão atualizada.",
      custo: "Tem custo (varia por cartório, em média R$ 50 a R$ 100).",
      onde: "Cartório de Registro de Imóveis presencial. Algumas regiões aceitam pedido online.",
      link: { label: "Encontrar cartórios (ONR)", url: "https://www.registrodeimoveis.org.br/" },
    },
  },
  {
    key: "endereco",
    title: "Endereço e CEP do imóvel",
    desc: "Pra o mapa abrir já na região certa da sua propriedade.",
    help: {
      como: "Use o CEP da sede ou da cidade mais próxima. Se não souber, pesquise pelo nome da fazenda.",
      custo: "Sem custo.",
      onde: "Consulta de CEP nos Correios.",
      link: { label: "Buscar CEP nos Correios", url: "https://buscacepinter.correios.com.br/" },
    },
  },
  {
    key: "area",
    title: "Saber a área total (em hectares)",
    desc: "Quantos hectares tem sua propriedade no total.",
    help: {
      como: "Está na matrícula do imóvel ou no CCIR.",
      custo: "Sem custo se você já tem os documentos acima.",
      onde: "Mesmo lugar dos documentos anteriores.",
    },
  },
  {
    key: "limite",
    title: "Saber mais ou menos os limites da terra",
    desc: "Onde começa e onde termina o seu imóvel.",
    help: {
      como: "Se não souber, peça ajuda a um técnico do sindicato rural, EMATER ou cooperativa.",
      custo: "Pelo sindicato ou EMATER, geralmente gratuito.",
      onde: "Sindicato Rural, EMATER, cooperativa ou técnico agrícola da sua confiança.",
    },
  },
];

function ChecklistPage() {
  const navigate = useNavigate();
  const [marked, setMarked] = useState<Record<string, "sim" | "nao" | null>>({});
  const [help, setHelp] = useState<Item | null>(null);

  function toggle(key: string, val: "sim" | "nao") {
    setMarked((m) => ({ ...m, [key]: m[key] === val ? null : val }));
  }

  const naoTem = items.filter((i) => marked[i.key] === "nao");
  const allAnswered = items.every((i) => marked[i.key] != null);

  function comecar() {
    const draft = emptyDraft();
    saveDraft(draft);
    navigate({ to: "/car/novo", search: { id: draft.id } });
  }

  return (
    <MobileShell
      header={
        <ScreenHeader title="Antes de começar" onBack={() => navigate({ to: "/inicio" })} />
      }
    >
      <div className="px-4 py-4">
        <div className="rounded-2xl bg-primary-soft p-4">
          <p className="text-base font-semibold text-primary-dark">
            Vamos ver o que você tem em mãos?
          </p>
          <p className="mt-1 text-sm text-foreground">
            Marque <b>"Sim, tenho"</b> ou <b>"Não tenho"</b>. Pode pedir ajuda em qualquer item — e
            <b> dá pra salvar e continuar depois</b>.
          </p>
        </div>

        <ul className="mt-4 space-y-3">
          {items.map((it) => {
            const v = marked[it.key];
            return (
              <li key={it.key} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-base font-bold text-foreground">{it.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggle(it.key, "sim")}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold ${
                      v === "sim"
                        ? "border-success bg-success/10 text-success"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {v === "sim" ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    Sim, tenho
                  </button>
                  <button
                    onClick={() => toggle(it.key, "nao")}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold ${
                      v === "nao"
                        ? "border-warning bg-warning/15 text-warning-foreground"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {v === "nao" ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    Não tenho
                  </button>
                </div>

                <button
                  onClick={() => setHelp(it)}
                  className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary"
                >
                  <HelpCircle className="h-4 w-4" /> Como conseguir?
                </button>
              </li>
            );
          })}
        </ul>

        {naoTem.length > 0 && (
          <div className="mt-4 rounded-2xl border-2 border-warning bg-warning/10 p-4">
            <p className="text-sm font-bold text-foreground">
              Você marcou {naoTem.length} item{naoTem.length > 1 ? "s" : ""} que ainda não tem.
            </p>
            <p className="mt-1 text-sm text-foreground">
              Sem problema! Você pode começar o cadastro mesmo assim, salvar o que já souber e
              voltar quando tiver os documentos.
            </p>
          </div>
        )}

        <button
          onClick={comecar}
          disabled={!allAnswered}
          className="mt-5 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {allAnswered ? "Começar meu cadastro" : "Marque todos os itens acima"}
        </button>
        <button
          onClick={() => navigate({ to: "/inicio" })}
          className="mt-2 w-full rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-foreground"
        >
          Voltar pra Início
        </button>
      </div>

      {help && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-3">
          <div className="w-full max-w-md rounded-3xl bg-card p-5 shadow-2xl">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-foreground">{help.title}</h3>
              <button onClick={() => setHelp(null)} aria-label="Fechar" className="rounded-full p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <HelpRow label="Como conseguir" text={help.help.como} />
            <HelpRow label="Tem custo?" text={help.help.custo} />
            <HelpRow label="Onde ir" text={help.help.onde} />
            {help.help.link && (
              <a
                href={help.help.link.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground"
              >
                {help.help.link.label} <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function HelpRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-3 rounded-xl bg-muted p-3">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{text}</p>
    </div>
  );
}
