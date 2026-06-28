import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { setSession } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — OrientaCar" },
      { name: "description", content: "Acesse o OrientaCar e gerencie seu Cadastro Ambiental Rural." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function formatCpf(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cpf.replace(/\D/g, "").length < 11 || password.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setSession({ name: "Raimundo da Silva", cpf });
      navigate({ to: "/inicio" });
    }, 400);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-primary-soft/60 to-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-6 py-7 text-primary-foreground shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs opacity-90">Sistema de Cadastro Ambiental Rural</p>
              <h1 className="text-2xl font-bold">OrientaCar</h1>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-95">
            Acompanhe seus imóveis rurais, pendências e o assistente inteligente do CAR.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-foreground">Entrar</h2>
          <p className="mt-1 text-sm text-muted-foreground">Informe seu CPF e senha.</p>

          <label className="mt-5 block text-sm font-medium text-foreground">CPF</label>
          <input
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />

          <label className="mt-4 block text-sm font-medium text-foreground">Senha</label>
          <div className="relative mt-2">
            <input
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-2 flex justify-end">
            <button type="button" className="text-xs font-medium text-primary">
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Não tem cadastro?{" "}
            <button type="button" className="font-semibold text-primary">
              Criar conta
            </button>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} OrientaCar · haCARthon
        </p>
      </div>
    </div>
  );
}
