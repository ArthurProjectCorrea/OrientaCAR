import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { User, Bell, Settings, ChevronRight, LogOut, Shield, HelpCircle } from "lucide-react";
import { clearSession, getSession, useSession } from "@/lib/session";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — OrientaCar" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: PerfilPage,
});

function PerfilPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const initials = (user?.name ?? "RS")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const masked = (user?.cpf ?? "***.***.***-56").replace(/\d(?=\d{2})/g, "*");

  function logout() {
    clearSession();
    navigate({ to: "/login" });
  }

  return (
    <MobileShell header={<ScreenHeader title="Perfil" />}>
      <div className="px-5 py-5">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow">
            {initials}
          </div>
          <h2 className="mt-3 text-lg font-bold text-foreground">{user?.name ?? "Produtor"}</h2>
          <p className="text-xs text-muted-foreground">CPF: {masked}</p>
        </div>

        <div className="mt-5 space-y-2">
          <Row icon={<User className="h-5 w-5" />} label="Editar Perfil" />
          <Row icon={<Bell className="h-5 w-5" />} label="Notificações" />
          <Row icon={<Shield className="h-5 w-5" />} label="Privacidade e segurança" />
          <Row icon={<Settings className="h-5 w-5" />} label="Configurações" />
          <Row icon={<HelpCircle className="h-5 w-5" />} label="Ajuda e suporte" />
        </div>

        <button
          onClick={logout}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">OrientaCar v1.0 · haCARthon</p>
      </div>
    </MobileShell>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-primary-soft/40">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
