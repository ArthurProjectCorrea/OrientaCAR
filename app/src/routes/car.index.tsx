import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Plus, ShieldCheck, Clock, AlertTriangle, ChevronRight, FileEdit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getSession, listDrafts, deleteDraft, type DraftCar } from "@/lib/session";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";

export const Route = createFileRoute("/car/")({
  head: () => ({ meta: [{ title: "Meu CAR — OrientaCar" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: CarListPage,
});

type Status = "Em Análise" | "Aprovado" | "Pendente";
type Item = { id: string; name: string; uf: string; mun: string; status: Status };

const items: Item[] = [
  { id: "1", name: "Fazenda Boa Esperança", uf: "MT", mun: "Sorriso", status: "Em Análise" },
  { id: "3", name: "Fazenda Verde", uf: "MT", mun: "Lucas do Rio Verde", status: "Aprovado" },
  { id: "5", name: "Fazenda Cerrado", uf: "MT", mun: "Primavera do Leste", status: "Pendente" },
];

function CarListPage() {
  const [drafts, setDrafts] = useState<DraftCar[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setDrafts(listDrafts().filter((d) => !d.enviado));
  }, [tick]);

  function removerRascunho(id: string) {
    deleteDraft(id);
    setTick((t) => t + 1);
  }

  return (
    <MobileShell
      header={
        <ScreenHeader
          title="Meu CAR"
          right={
            <Link
              to="/car/checklist"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              aria-label="Novo cadastro"
            >
              <Plus className="h-5 w-5" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-3 px-4 py-4">
        {drafts.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-bold uppercase text-warning-foreground">
              Pra terminar ({drafts.length})
            </h2>
            <ul className="space-y-2">
              {drafts.map((d) => (
                <li
                  key={d.id}
                  className="rounded-2xl border-2 border-warning bg-warning/10 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {d.nomeImovel || "Cadastro sem nome"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Etapa {d.step + 1} de 7 ·{" "}
                        {new Date(d.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <button
                      onClick={() => removerRascunho(d.id)}
                      aria-label="Excluir"
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Link
                    to="/car/novo"
                    onClick={() => localStorage.setItem("orientacar_current_draft", d.id)}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-warning py-2.5 text-sm font-bold text-warning-foreground"
                  >
                    <FileEdit className="h-4 w-4" /> Continuar
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-2 mt-2 text-sm font-bold uppercase text-foreground">
            Cadastrados ({items.length})
          </h2>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-primary-dark">{item.name}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.mun}/{item.uf}
                </p>
                <Link
                  to="/car/$id"
                  params={{ id: item.id }}
                  className="mt-3 flex items-center justify-center gap-1 rounded-xl border-2 border-primary py-2.5 text-sm font-bold text-primary"
                >
                  Ver detalhes <ChevronRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MobileShell>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map = {
    "Em Análise": { cls: "bg-warning text-warning-foreground", Icon: Clock },
    Aprovado: { cls: "bg-success text-success-foreground", Icon: ShieldCheck },
    Pendente: { cls: "bg-destructive text-destructive-foreground", Icon: AlertTriangle },
  } as const;
  const { cls, Icon } = map[status];
  return (
    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}
