import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, FileText, ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { getSession } from "@/lib/session";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/car/$id")({
  head: () => ({ meta: [{ title: "Detalhes do CAR — OrientaCar" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: CarDetail,
});

const data: Record<string, { name: string; status: string; uf: string; mun: string; area: string; protocol: string; pendencias: string[] }> = {
  "1": { name: "Fazenda Boa Esperança", status: "Em Análise", uf: "MT", mun: "Sorriso", area: "412,5 ha", protocol: "MT-5107925-AB12.34CD", pendencias: ["Área divergente na reserva legal", "Documentação dominial pendente"] },
  "2": { name: "Sítio do Vale", status: "Em Análise", uf: "MT", mun: "Nova Mutum", area: "85,2 ha", protocol: "MT-5106109-EF56.78GH", pendencias: ["Sobreposição com APP detectada"] },
  "3": { name: "Fazenda Verde", status: "Aprovado", uf: "MT", mun: "Lucas do Rio Verde", area: "1.205,0 ha", protocol: "MT-5105259-IJ90.12KL", pendencias: [] },
  "4": { name: "Chácara Aurora", status: "Aprovado", uf: "MT", mun: "Sinop", area: "32,0 ha", protocol: "MT-5107909-MN34.56OP", pendencias: [] },
  "5": { name: "Fazenda Cerrado", status: "Pendente", uf: "MT", mun: "Primavera do Leste", area: "640,7 ha", protocol: "MT-5106307-QR78.90ST", pendencias: ["Shapefile com geometria inválida", "CPF do proprietário desatualizado"] },
};

function CarDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const item = data[id] ?? data["1"];

  return (
    <MobileShell
      header={
        <header className="flex items-center gap-2 border-b border-border bg-card px-3 py-3">
          <button
            onClick={() => navigate({ to: "/car" })}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 truncate text-base font-bold text-primary-dark">{item.name}</h1>
        </header>
      }
    >
      <div className="px-5 py-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-5 text-primary-foreground shadow">
          <p className="text-xs opacity-90">Protocolo</p>
          <p className="font-mono text-sm font-semibold">{item.protocol}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <Info label="UF" value={item.uf} />
            <Info label="Município" value={item.mun} />
            <Info label="Área" value={item.area} />
          </div>
        </div>

        <h2 className="mt-6 text-sm font-semibold text-foreground">Status</h2>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          {item.status === "Aprovado" ? (
            <ShieldCheck className="h-6 w-6 text-success" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-warning" />
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">{item.status}</p>
            <p className="text-xs text-muted-foreground">
              {item.status === "Aprovado"
                ? "Seu cadastro está regular."
                : "Existem itens que precisam da sua atenção."}
            </p>
          </div>
        </div>

        {item.pendencias.length > 0 && (
          <>
            <h2 className="mt-6 text-sm font-semibold text-foreground">Pendências</h2>
            <ul className="mt-2 space-y-2">
              {item.pendencias.map((p) => (
                <li key={p} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <span className="text-sm text-foreground">{p}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="mt-6 text-sm font-semibold text-foreground">Ações</h2>
        <div className="mt-2 space-y-2">
          <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left text-sm hover:bg-primary-soft/40">
            <MapPin className="h-5 w-5 text-primary" />
            Ver mapa do imóvel
          </button>
          <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left text-sm hover:bg-primary-soft/40">
            <FileText className="h-5 w-5 text-primary" />
            Documentos enviados
          </button>
          <Link
            to="/chat"
            className="flex w-full items-center gap-3 rounded-2xl border border-primary bg-primary-soft/40 p-4 text-left text-sm font-semibold text-primary"
          >
            <Sparkles className="h-5 w-5" />
            Resolver com o Chat IA
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2">
      <p className="text-[10px] uppercase opacity-80">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
