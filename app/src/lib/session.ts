import { useEffect, useState } from "react";

const KEY = "orientacar_user";
const DRAFTS_KEY = "orientacar_drafts";

export type SessionUser = { name: string; cpf: string };

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setUser(getSession());
    setReady(true);
  }, []);
  return { user, ready, setUser };
}

/* ====================== Drafts (rascunhos de CAR) ====================== */

export type Proprietario = {
  tipo: "fisica" | "juridica";
  cpfCnpj: string;
  nascimento?: string;
  nome: string;
  nomeMae?: string;
};

export type Representante = { cpf: string; nascimento: string; nome: string };

export type DraftCar = {
  id: string;
  createdAt: number;
  updatedAt: number;
  step: number;
  // 1 — Identificação
  proprietarios: Proprietario[];
  // 2 — Imóvel
  origem: "sigef" | "novo" | null;
  sigefSelecionado?: { nome: string; municipio: string; matricula: string; areaHa: number };
  nomeImovel: string;
  uf: string;
  municipio: string;
  descAcesso: string;
  zona: "rural" | "urbana" | "";
  cib: string;
  cep: string;
  // 3 — Documentação
  docs: { tipo: "propriedade" | "posse"; nome: string; area: string; tipoDoc: string }[];
  reservaAverbada: boolean;
  legislacaoAnterior: boolean;
  // 4 — Representante
  representantes: Representante[];
  // 5 — Geo
  perimetroDesenhado: boolean;
  areaCalculadaHa: number;
  sedeMarcada: boolean;
  camadas: { ti: boolean; uc: boolean; embargo: boolean; vizinhos: boolean };
  // 6 — Alertas (derivado)
  // 7 — Resumo
  enviado?: boolean;
};

export function emptyDraft(): DraftCar {
  const id = `draft-${Date.now()}`;
  const now = Date.now();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    step: 0,
    proprietarios: [],
    origem: null,
    nomeImovel: "",
    uf: "",
    municipio: "",
    descAcesso: "",
    zona: "",
    cib: "",
    cep: "",
    docs: [],
    reservaAverbada: false,
    legislacaoAnterior: false,
    representantes: [],
    perimetroDesenhado: false,
    areaCalculadaHa: 0,
    sedeMarcada: false,
    camadas: { ti: true, uc: true, embargo: true, vizinhos: true },
  };
}

export function listDrafts(): DraftCar[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? (JSON.parse(raw) as DraftCar[]) : [];
  } catch {
    return [];
  }
}

export function saveDraft(draft: DraftCar) {
  const all = listDrafts();
  const idx = all.findIndex((d) => d.id === draft.id);
  const next = { ...draft, updatedAt: Date.now() };
  if (idx >= 0) all[idx] = next;
  else all.push(next);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(all));
}

export function getDraft(id: string): DraftCar | null {
  return listDrafts().find((d) => d.id === id) ?? null;
}

export function deleteDraft(id: string) {
  const all = listDrafts().filter((d) => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(all));
}
