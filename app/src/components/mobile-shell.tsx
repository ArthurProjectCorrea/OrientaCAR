import { Link, useLocation } from "@tanstack/react-router";
import { Home, Map, Sparkles, User } from "lucide-react";
import type { ReactNode } from "react";
import { A11yButton } from "@/components/a11y-button";

const tabs = [
  { to: "/inicio", label: "Início", icon: Home },
  { to: "/car", label: "Meu CAR", icon: Map },
  { to: "/chat", label: "Ajuda", icon: Sparkles },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function MobileShell({
  children,
  header,
  contentClassName = "",
  hideNav = false,
}: {
  children: ReactNode;
  header?: ReactNode;
  contentClassName?: string;
  hideNav?: boolean;
}) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-primary-soft/60 to-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background shadow-xl">
        {header}
        <main className={`flex-1 overflow-y-auto ${hideNav ? "pb-6" : "pb-28"} ${contentClassName}`}>{children}</main>
        {!hideNav && (
          <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border bg-card/95 backdrop-blur">
            <ul className="grid grid-cols-4">
              {tabs.map((t) => {
                const active = pathname.startsWith(t.to);
                const Icon = t.icon;
                return (
                  <li key={t.to}>
                    <Link
                      to={t.to}
                      className={`flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition-colors ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                          active ? "bg-primary-soft" : ""
                        }`}
                      >
                        <Icon className="h-6 w-6" strokeWidth={active ? 2.4 : 2} />
                      </span>
                      {t.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
        <A11yButton />
      </div>
    </div>
  );
}

export function ScreenHeader({
  title,
  right,
  variant = "plain",
  subtitle,
  onBack,
}: {
  title: string;
  right?: ReactNode;
  subtitle?: string;
  variant?: "plain" | "hero";
  onBack?: () => void;
}) {
  if (variant === "hero") {
    return (
      <header className="bg-gradient-to-br from-primary to-primary-dark px-5 pb-8 pt-10 text-primary-foreground">
        {subtitle && <p className="text-xs opacity-90">{subtitle}</p>}
        <h1 className="mt-1 text-2xl font-bold leading-tight">{title}</h1>
      </header>
    );
  }
  return (
    <header className="flex items-center justify-between gap-2 border-b border-border bg-card px-3 py-3">
      <div className="w-10">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted"
          >
            ‹
          </button>
        )}
      </div>
      <h1 className="flex-1 truncate text-center text-base font-bold text-primary-dark">{title}</h1>
      <div className="flex w-10 justify-end">{right}</div>
    </header>
  );
}
