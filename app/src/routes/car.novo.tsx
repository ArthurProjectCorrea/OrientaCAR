import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft, Check, Save, Upload, MapPin, Home, Sparkles, AlertTriangle, Layers,
  CheckCircle2, Plus, Trash2, Search, Pencil, Mic, MicOff, Info,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getSession, listDrafts, saveDraft, getDraft, emptyDraft,
  type DraftCar, type Proprietario, type Representante,
} from "@/lib/session";
import { MobileShell } from "@/components/mobile-shell";
import { AiHelper } from "@/components/ai-helper";
import satelliteFarm from "@/assets/satellite-farm.jpg";

const CURRENT_KEY = "orientacar_current_draft";

export const Route = createFileRoute("/car/novo")({
  head: () => ({ meta: [{ title: "Novo CAR — OrientaCar" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: NovoCar,
});

const steps = [
  { key: "identificacao", label: "Identificação" },
  { key: "imovel", label: "Imóvel" },
  { key: "documentacao", label: "Documentação" },
  { key: "representante", label: "Representante" },
  { key: "geo", label: "Mapa" },
  { key: "alertas", label: "Alertas" },
  { key: "resumo", label: "Resumo" },
] as const;

const sigefMock = [
  { nome: "LOTE 65 DA QUADRA 56 - PARTE", municipio: "Alto Santo/CE", matricula: "9130730254613", areaHa: 10.64 },
  { nome: "LOTE 56 E 57 DA QUADRA Nº 13", municipio: "Alvinópolis/MG", matricula: "9132511008898", areaHa: 7.885 },
  { nome: "Fazenda Múltiplos Proprietários", municipio: "Brasília/DF", matricula: "1234567890123", areaHa: 26.35 },
];

function NovoCar() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<DraftCar | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let id = typeof window !== "undefined" ? localStorage.getItem(CURRENT_KEY) : null;
    let d = id ? getDraft(id) : null;
    if (!d) {
      // fallback: most recent unsent draft, or new
      const open = listDrafts().filter((x) => !x.enviado).sort((a, b) => b.updatedAt - a.updatedAt)[0];
      d = open ?? emptyDraft();
      saveDraft(d);
    }
    localStorage.setItem(CURRENT_KEY, d.id);
    setDraft(d);
  }, []);

  function update(patch: Partial<DraftCar>) {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }

  function persist(label = "Rascunho salvo") {
    if (!draft) return;
    saveDraft(draft);
    setSaved(label);
    setTimeout(() => setSaved(null), 1800);
  }

  if (!draft) return null;
  const current = steps[draft.step];

  function canAdvance() {
    if (!draft) return false;
    switch (current.key) {
      case "identificacao": return draft.proprietarios.length > 0;
      case "imovel": return !!draft.nomeImovel && !!draft.uf && !!draft.municipio && !!draft.zona;
      case "documentacao":
        return draft.origem === "sigef" ? true : draft.docs.length > 0;
      case "representante": return true; // opcional
      case "geo": return draft.perimetroDesenhado && draft.sedeMarcada;
      case "alertas": return true;
      case "resumo": return true;
    }
  }

  if (done) {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-foreground">Tudo certo!</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Seu cadastro de <strong>{draft.nomeImovel || "imóvel"}</strong> foi enviado.
            Você pode acompanhar pelo aplicativo.
          </p>
          <button
            onClick={() => navigate({ to: "/car" })}
            className="mt-8 w-full max-w-xs rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground"
          >
            Ver meus cadastros
          </button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      hideNav
      header={
        <header className="border-b border-border bg-card">
          <div className="flex items-center gap-2 px-3 py-3">
            <button
              onClick={() => {
                if (draft.step === 0) navigate({ to: "/inicio" });
                else update({ step: draft.step - 1 });
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-primary-dark">Novo cadastro</h1>
              <p className="text-[11px] text-muted-foreground">
                Etapa {draft.step + 1} de {steps.length} · {current.label}
              </p>
            </div>
            <button
              onClick={() => persist()}
              className="flex items-center gap-1 rounded-xl bg-earth/15 px-3 py-2 text-xs font-bold text-earth"
            >
              <Save className="h-4 w-4" /> Salvar
            </button>
          </div>
          {/* progress */}
          <div className="flex gap-1 px-3 pb-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= draft.step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </header>
      }
    >
      {saved && (
        <div className="sticky top-0 z-20 mx-3 mt-2 rounded-xl bg-success/15 px-3 py-2 text-center text-sm font-semibold text-success">
          ✓ {saved}
        </div>
      )}

      <div className="px-4 py-5">
        <StepBanner step={current.key} />

        {current.key === "identificacao" && <Identificacao draft={draft} update={update} />}
        {current.key === "imovel" && <Imovel draft={draft} update={update} />}
        {current.key === "documentacao" && <Documentacao draft={draft} update={update} />}
        {current.key === "representante" && <RepresentanteStep draft={draft} update={update} />}
        {current.key === "geo" && <Geo draft={draft} update={update} />}
        {current.key === "alertas" && <Alertas draft={draft} />}
        {current.key === "resumo" && <Resumo draft={draft} />}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={() => { persist("Cadastro salvo, volte quando quiser"); navigate({ to: "/car" }); }}
            className="rounded-2xl border-2 border-border bg-card py-4 text-sm font-bold text-foreground"
          >
            Salvar e sair
          </button>
          <button
            onClick={() => {
              if (!canAdvance()) return;
              if (draft.step < steps.length - 1) {
                update({ step: draft.step + 1 });
                setTimeout(() => persist(), 0);
              } else {
                update({ enviado: true });
                saveDraft({ ...draft, enviado: true });
                setDone(true);
              }
            }}
            disabled={!canAdvance()}
            className="rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {draft.step < steps.length - 1 ? "Continuar" : "Enviar cadastro"}
          </button>
        </div>
      </div>

      <AiHelper context={current.label} />
    </MobileShell>
  );
}

/* ============================== STEPS ============================== */

function StepBanner({ step }: { step: string }) {
  const map: Record<string, { t: string; d: string }> = {
    identificacao: { t: "Quem é o dono da terra?", d: "Informe CPF e data de nascimento. O sistema busca o nome pra você." },
    imovel: { t: "Sobre o imóvel", d: "Você já cadastrou no SIGEF/SNCR? Se sim, é só selecionar. Se não, vamos criar um novo." },
    documentacao: { t: "Documentos do imóvel", d: "Confirme os documentos que o INCRA já tem ou envie os seus." },
    representante: { t: "Tem alguém ajudando você?", d: "Se tem um técnico ou parente cuidando do CAR, cadastre aqui. Senão, pode pular." },
    geo: { t: "Onde fica e qual o tamanho", d: "Desenhe o limite da terra no mapa e marque a sede. A área é calculada na hora." },
    alertas: { t: "O que precisa de atenção", d: "Veja se tem algo a ajustar antes de enviar." },
    resumo: { t: "Confira tudo antes de enviar", d: "Dá uma olhada se está tudo certo. Pode voltar pra corrigir." },
  };
  const m = map[step];
  return (
    <div className="mb-5 rounded-2xl bg-primary-soft p-4">
      <p className="text-lg font-bold text-primary-dark">{m.t}</p>
      <p className="mt-1 text-sm text-foreground">{m.d}</p>
    </div>
  );
}

/* ----------- 1. Identificação ----------- */
function Identificacao({ draft, update }: { draft: DraftCar; update: (p: Partial<DraftCar>) => void }) {
  const [tipo, setTipo] = useState<"fisica" | "juridica">("fisica");
  const [cpf, setCpf] = useState("");
  const [nasc, setNasc] = useState("");
  const [foundName, setFoundName] = useState<{ nome: string; mae: string } | null>(null);

  function buscar() {
    if (cpf.replace(/\D/g, "").length >= 11 && nasc.length >= 8) {
      // mock lookup
      setFoundName({ nome: "Raimundo S***", mae: "Maria S***" });
    }
  }

  function adicionar() {
    if (!foundName) return;
    const p: Proprietario = {
      tipo,
      cpfCnpj: cpf,
      nascimento: nasc,
      nome: foundName.nome,
      nomeMae: foundName.mae,
    };
    update({ proprietarios: [...draft.proprietarios, p] });
    setCpf(""); setNasc(""); setFoundName(null);
  }

  function remover(i: number) {
    update({ proprietarios: draft.proprietarios.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-4">
      <Section title="Adicionar proprietário ou possuidor">
        <div className="mb-3 flex gap-2">
          <Radio label="Pessoa física" checked={tipo === "fisica"} onChange={() => setTipo("fisica")} />
          <Radio label="Pessoa jurídica" checked={tipo === "juridica"} onChange={() => setTipo("juridica")} />
        </div>
        <BigField
          label={tipo === "fisica" ? "CPF" : "CNPJ"}
          value={cpf}
          onChange={(v) => { setCpf(v); setFoundName(null); }}
          placeholder="000.000.000-00"
          required
        />
        {tipo === "fisica" && (
          <BigField
            label="Data de nascimento"
            value={nasc}
            onChange={(v) => { setNasc(v); setFoundName(null); }}
            placeholder="DD/MM/AAAA"
            required
          />
        )}

        {!foundName ? (
          <button
            onClick={buscar}
            disabled={cpf.length < 11}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-primary-soft py-3 text-base font-bold text-primary-dark disabled:opacity-50"
          >
            <Search className="h-5 w-5" /> Buscar dados
          </button>
        ) : (
          <div className="rounded-2xl border-2 border-success bg-success/5 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-success">
              <CheckCircle2 className="h-4 w-4" /> Encontramos:
            </p>
            <p className="mt-2 text-base font-bold text-foreground">{foundName.nome}</p>
            <p className="text-sm text-muted-foreground">Mãe: {foundName.mae}</p>
            <button
              onClick={adicionar}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Adicionar à lista
            </button>
          </div>
        )}
      </Section>

      <Section title={`Proprietários adicionados (${draft.proprietarios.length})`}>
        {draft.proprietarios.length === 0 ? (
          <p className="rounded-xl bg-muted py-6 text-center text-sm text-muted-foreground">
            Nenhum proprietário ainda. Adicione pelo menos um.
          </p>
        ) : (
          <ul className="space-y-2">
            {draft.proprietarios.map((p, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-earth/15 font-bold text-earth">
                  {p.nome.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{p.nome}</p>
                  <p className="text-xs text-muted-foreground">{p.cpfCnpj}</p>
                </div>
                <button onClick={() => remover(i)} aria-label="Remover" className="rounded-lg p-2 hover:bg-muted">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ----------- 2. Imóvel ----------- */
function Imovel({ draft, update }: { draft: DraftCar; update: (p: Partial<DraftCar>) => void }) {
  return (
    <div className="space-y-4">
      <Section title="Origem do imóvel">
        <p className="mb-3 text-sm text-muted-foreground">Esse imóvel já tem cadastro no SIGEF/SNCR?</p>
        <div className="grid grid-cols-2 gap-2">
          <Choice
            active={draft.origem === "sigef"}
            label="Sim, já tenho"
            sub="Buscar no SIGEF"
            onClick={() => update({ origem: "sigef" })}
          />
          <Choice
            active={draft.origem === "novo"}
            label="Não, é novo"
            sub="Cadastrar do zero"
            onClick={() => update({ origem: "novo" })}
          />
        </div>
      </Section>

      {draft.origem === "sigef" && (
        <Section title="Selecione no SIGEF">
          <ul className="space-y-2">
            {sigefMock.map((s) => {
              const sel = draft.sigefSelecionado?.matricula === s.matricula;
              return (
                <li key={s.matricula}>
                  <button
                    onClick={() =>
                      update({
                        sigefSelecionado: s,
                        nomeImovel: s.nome,
                        municipio: s.municipio.split("/")[0],
                        uf: s.municipio.split("/")[1],
                      })
                    }
                    className={`w-full rounded-2xl border-2 p-3 text-left ${
                      sel ? "border-primary bg-primary-soft" : "border-border bg-card"
                    }`}
                  >
                    <p className="text-sm font-bold text-foreground">{s.nome}</p>
                    <p className="text-xs text-muted-foreground">{s.municipio} · {s.areaHa} ha</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section title="Dados do imóvel">
        <BigField label="Nome do imóvel" value={draft.nomeImovel} onChange={(v) => update({ nomeImovel: v })} placeholder="Ex: Fazenda Boa Esperança" required />
        <div className="grid grid-cols-2 gap-2">
          <BigField label="UF" value={draft.uf} onChange={(v) => update({ uf: v.toUpperCase() })} placeholder="MT" required />
          <BigField label="CEP" value={draft.cep} onChange={(v) => update({ cep: v })} placeholder="00000-000" />
        </div>
        <BigField label="Município" value={draft.municipio} onChange={(v) => update({ municipio: v })} placeholder="Ex: Sorriso" required />
        <BigField label="Como chegar (descrição de acesso)" value={draft.descAcesso} onChange={(v) => update({ descAcesso: v })} placeholder="Ex: Estrada do KM 12, em frente ao posto..." multiline />

        <p className="mb-2 mt-3 text-sm font-bold text-foreground">Zona</p>
        <div className="grid grid-cols-2 gap-2">
          <Choice active={draft.zona === "rural"} label="Rural" onClick={() => update({ zona: "rural" })} />
          <Choice active={draft.zona === "urbana"} label="Urbana" onClick={() => update({ zona: "urbana" })} />
        </div>
      </Section>
    </div>
  );
}

/* ----------- 3. Documentação ----------- */
function Documentacao({ draft, update }: { draft: DraftCar; update: (p: Partial<DraftCar>) => void }) {
  const [tipo, setTipo] = useState<"propriedade" | "posse">("propriedade");
  const [nome, setNome] = useState("");
  const [area, setArea] = useState("");
  const [tipoDoc, setTipoDoc] = useState("Matrícula");

  function adicionar() {
    if (!nome || !area) return;
    update({ docs: [...draft.docs, { tipo, nome, area, tipoDoc }] });
    setNome(""); setArea("");
  }

  if (draft.origem === "sigef") {
    return (
      <div className="space-y-4">
        <Section title="Documentos vindos do SNCR/INCRA">
          <div className="rounded-2xl border border-border bg-card p-4">
            <RowKV k="Situação" v="Área Registrada" />
            <RowKV k="Cartório" v="1º Serviço Notarial" />
            <RowKV k="Matrícula" v={draft.sigefSelecionado?.matricula ?? "—"} />
            <RowKV k="Área registrada" v={`${draft.sigefSelecionado?.areaHa ?? 0} ha`} />
          </div>
        </Section>
        <Toggle
          label="Possui Reserva Legal averbada"
          checked={draft.reservaAverbada}
          onChange={(v) => update({ reservaAverbada: v })}
        />
        <Toggle
          label="Reserva Legal está sob legislação anterior à Lei 12.651/2012"
          checked={draft.legislacaoAnterior}
          onChange={(v) => update({ legislacaoAnterior: v })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Section title="Adicionar documento">
        <div className="mb-3 flex gap-2">
          <Radio label="Propriedade" checked={tipo === "propriedade"} onChange={() => setTipo("propriedade")} />
          <Radio label="Posse" checked={tipo === "posse"} onChange={() => setTipo("posse")} />
        </div>
        <BigField label="Nome do imóvel/documento" value={nome} onChange={setNome} required />
        <BigField label="Área (ha)" value={area} onChange={setArea} placeholder="Ex: 250" required />
        <p className="mb-2 text-sm font-bold text-foreground">Tipo do documento</p>
        <div className="mb-3 grid grid-cols-2 gap-2">
          {["Matrícula", "CCIR", "Contrato", "Outro"].map((t) => (
            <Choice key={t} active={tipoDoc === t} label={t} onClick={() => setTipoDoc(t)} />
          ))}
        </div>
        <button
          onClick={adicionar}
          disabled={!nome || !area}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Adicionar à lista
        </button>
      </Section>

      <Section title="Anexar arquivo (opcional)">
        <DocUpload label="Cópia do documento" hint="PDF ou foto" />
      </Section>

      <Section title={`Documentos adicionados (${draft.docs.length})`}>
        {draft.docs.length === 0 ? (
          <p className="rounded-xl bg-muted py-6 text-center text-sm text-muted-foreground">
            Nenhum documento ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {draft.docs.map((d, i) => (
              <li key={i} className="rounded-2xl border border-border bg-card p-3">
                <p className="text-sm font-bold text-foreground">{d.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {d.tipo} · {d.tipoDoc} · {d.area} ha
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ----------- 4. Representante ----------- */
function RepresentanteStep({ draft, update }: { draft: DraftCar; update: (p: Partial<DraftCar>) => void }) {
  const [cpf, setCpf] = useState("");
  const [nasc, setNasc] = useState("");
  const [found, setFound] = useState<string | null>(null);

  function buscar() {
    if (cpf.replace(/\D/g, "").length >= 11) setFound("João T***");
  }
  function adicionar() {
    if (!found) return;
    const r: Representante = { cpf, nascimento: nasc, nome: found };
    update({ representantes: [...draft.representantes, r] });
    setCpf(""); setNasc(""); setFound(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 rounded-2xl border border-border bg-card p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-foreground">
          O representante é quem pode mexer no seu CAR no seu lugar — um técnico, parente ou alguém de confiança.
          <b> Esse passo é opcional.</b>
        </p>
      </div>
      <Section title="Adicionar representante">
        <BigField label="CPF" value={cpf} onChange={setCpf} placeholder="000.000.000-00" />
        <BigField label="Data de nascimento" value={nasc} onChange={setNasc} placeholder="DD/MM/AAAA" />
        {!found ? (
          <button
            onClick={buscar}
            disabled={cpf.length < 11}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-primary-soft py-3 text-base font-bold text-primary-dark disabled:opacity-50"
          >
            <Search className="h-5 w-5" /> Buscar
          </button>
        ) : (
          <div className="rounded-2xl border-2 border-success bg-success/5 p-4">
            <p className="text-base font-bold text-foreground">{found}</p>
            <button
              onClick={adicionar}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        )}
      </Section>

      {draft.representantes.length > 0 && (
        <Section title="Representantes">
          <ul className="space-y-2">
            {draft.representantes.map((r, i) => (
              <li key={i} className="rounded-2xl border border-border bg-card p-3">
                <p className="text-sm font-bold text-foreground">{r.nome}</p>
                <p className="text-xs text-muted-foreground">{r.cpf}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/* ----------- 5. Geo ----------- */
function Geo({ draft, update }: { draft: DraftCar; update: (p: Partial<DraftCar>) => void }) {
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [sedeAt, setSedeAt] = useState<{ x: number; y: number } | null>(null);
  const [mode, setMode] = useState<"perimetro" | "sede">("perimetro");

  // Calculate approx area in ha based on polygon area in pixels — mocked scale
  const areaHa = useMemo(() => {
    if (points.length < 3) return 0;
    let a = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      a += points[i].x * points[j].y - points[j].x * points[i].y;
    }
    return Math.abs(a / 2) * 0.012; // mock factor → ha
  }, [points]);

  useEffect(() => {
    if (areaHa > 0) update({ areaCalculadaHa: Math.round(areaHa * 100) / 100 });
  }, [areaHa]);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (mode === "perimetro") {
      setPoints((p) => [...p, { x, y }]);
    } else {
      setSedeAt({ x, y });
      update({ sedeMarcada: true });
    }
  }

  function finalizar() {
    if (points.length < 3) return;
    setDrawing(false);
    update({ perimetroDesenhado: true });
  }

  function preencher() {
    // Pre-fill from SIGEF — pretty polygon
    setPoints([
      { x: 60, y: 70 }, { x: 230, y: 50 }, { x: 290, y: 140 },
      { x: 240, y: 220 }, { x: 100, y: 230 }, { x: 40, y: 150 },
    ]);
    update({ perimetroDesenhado: true });
  }

  const sigefArea = draft.sigefSelecionado?.areaHa;
  const matchOk = sigefArea && Math.abs(sigefArea - draft.areaCalculadaHa) / sigefArea < 0.1;

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-3">
        <p className="mb-2 text-sm font-bold text-foreground">O que você quer marcar?</p>
        <div className="grid grid-cols-2 gap-2">
          <Choice
            active={mode === "perimetro"}
            label="Limite da terra"
            sub={`${points.length} pontos`}
            onClick={() => setMode("perimetro")}
          />
          <Choice
            active={mode === "sede"}
            label="Sede / Casa"
            sub={sedeAt ? "Marcada ✓" : "Pendente"}
            onClick={() => { setMode("sede"); setDrawing(true); }}
          />
        </div>
      </div>

      {/* Map */}
      <div
        onClick={handleClick}
        className={`relative h-80 overflow-hidden rounded-2xl border-2 border-border bg-muted ${drawing ? "cursor-crosshair" : ""}`}
        style={{
          backgroundImage: `url(${satelliteFarm})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute left-2 top-2 rounded-md bg-card/90 px-2 py-1 text-[10px] font-bold">
          {draft.municipio || "Sua região"} {draft.uf && `/ ${draft.uf}`}
        </div>
        <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
          Satélite
        </div>

        {/* Camadas */}
        {draft.camadas.ti && (
          <div className="absolute right-0 top-0 h-24 w-28 bg-warning/30" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 60%)" }} />
        )}
        {draft.camadas.uc && (
          <div className="absolute bottom-0 left-0 h-20 w-32 bg-success/30" style={{ clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 100%)" }} />
        )}
        {draft.camadas.embargo && (
          <div className="absolute right-14 top-24 h-10 w-12 rounded bg-destructive/40 ring-2 ring-destructive/60" />
        )}

        {/* Polygon being drawn */}
        {points.length > 0 && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {points.length >= 2 && (
              <polyline
                points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill={points.length >= 3 ? "oklch(0.52 0.14 150 / 0.25)" : "none"}
                stroke="oklch(0.36 0.11 150)"
                strokeWidth="3"
              />
            )}
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="6" fill="oklch(0.52 0.14 150)" stroke="white" strokeWidth="2" />
            ))}
          </svg>
        )}

        {sedeAt && (
          <div className="pointer-events-none absolute" style={{ left: sedeAt.x - 14, top: sedeAt.y - 28 }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-earth text-earth-foreground shadow-lg ring-2 ring-white">
              <Home className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Live area badge — KEY UX improvement vs SICAR */}
        {points.length >= 3 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
            {areaHa.toFixed(2)} ha selecionados
          </div>
        )}

        {!drawing && points.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/40 backdrop-blur-[1px]">
            <button
              onClick={() => { setDrawing(true); setMode("perimetro"); }}
              className="rounded-2xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground shadow-lg"
            >
              Começar a desenhar
            </button>
            {draft.sigefSelecionado && (
              <button onClick={preencher} className="rounded-2xl bg-earth px-5 py-3 text-sm font-bold text-earth-foreground shadow-lg">
                <Sparkles className="mr-1 inline h-4 w-4" /> Preencher pelo SIGEF
              </button>
            )}
          </div>
        )}
      </div>

      {/* Drawing toolbar */}
      {drawing && mode === "perimetro" && (
        <div className="flex gap-2">
          <button
            onClick={() => setPoints((p) => p.slice(0, -1))}
            className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-bold"
          >
            Desfazer
          </button>
          <button
            onClick={() => { setPoints([]); update({ perimetroDesenhado: false, areaCalculadaHa: 0 }); }}
            className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-bold"
          >
            Limpar
          </button>
          <button
            onClick={finalizar}
            disabled={points.length < 3}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            Finalizar
          </button>
        </div>
      )}

      {/* Legenda + camadas */}
      <div className="rounded-2xl border border-border bg-card p-3">
        <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Camadas no mapa</p>
        <div className="grid grid-cols-2 gap-2">
          {([
            ["ti", "Terras Indígenas", "bg-warning"],
            ["uc", "Unidades Conserv.", "bg-success"],
            ["embargo", "Áreas embargadas", "bg-destructive"],
            ["vizinhos", "Vizinhos", "bg-muted-foreground"],
          ] as const).map(([k, label, dot]) => (
            <button
              key={k}
              onClick={() => update({ camadas: { ...draft.camadas, [k]: !draft.camadas[k] } })}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-bold ${
                draft.camadas[k] ? "border-primary bg-primary-soft text-primary-dark" : "border-border bg-background text-muted-foreground"
              }`}
            >
              <span className={`h-3 w-3 rounded-full ${dot}`} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Validação de área */}
      {draft.perimetroDesenhado && sigefArea && (
        <div
          className={`rounded-2xl border-2 p-4 ${
            matchOk ? "border-success bg-success/10" : "border-warning bg-warning/15"
          }`}
        >
          <p className="text-sm font-bold text-foreground">
            {matchOk ? "✓ Área bate com o documento!" : "⚠ Área não bate"}
          </p>
          <p className="mt-1 text-sm text-foreground">
            Documento: <b>{sigefArea} ha</b> · Desenhado: <b>{draft.areaCalculadaHa} ha</b>
          </p>
          {!matchOk && (
            <p className="mt-1 text-xs text-foreground">
              Ajuste o desenho ou peça ajuda à IA. A diferença pode causar pendência.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------- 6. Alertas e pendências ----------- */
function Alertas({ draft }: { draft: DraftCar }) {
  const alerts: { tipo: "amarelo" | "vermelho"; texto: string }[] = [];
  if (!draft.cib) alerts.push({ tipo: "amarelo", texto: "Código CIB do imóvel não informado." });
  if (draft.docs.length === 0 && draft.origem !== "sigef")
    alerts.push({ tipo: "vermelho", texto: "Nenhum documento foi adicionado." });
  if (draft.sigefSelecionado && Math.abs(draft.sigefSelecionado.areaHa - draft.areaCalculadaHa) / draft.sigefSelecionado.areaHa > 0.1)
    alerts.push({ tipo: "amarelo", texto: "Área desenhada está diferente da área no documento." });
  if (!draft.descAcesso) alerts.push({ tipo: "amarelo", texto: "Descrição de acesso vazia." });

  if (alerts.length === 0)
    alerts.push({ tipo: "amarelo", texto: "Tudo certo! Não encontramos pendências bloqueantes." });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-muted p-4 text-sm text-foreground">
        <p>
          <b className="text-warning-foreground">Amarelo</b>: você pode enviar, mas vale revisar.
          <br />
          <b className="text-destructive">Vermelho</b>: precisa corrigir antes de enviar.
        </p>
      </div>
      <ul className="space-y-2">
        {alerts.map((a, i) => (
          <li
            key={i}
            className={`flex gap-3 rounded-2xl border-2 p-4 ${
              a.tipo === "vermelho" ? "border-destructive bg-destructive/10" : "border-warning bg-warning/15"
            }`}
          >
            <AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${a.tipo === "vermelho" ? "text-destructive" : "text-warning-foreground"}`} />
            <span className="text-sm text-foreground">{a.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------- 7. Resumo ----------- */
function Resumo({ draft }: { draft: DraftCar }) {
  return (
    <div className="space-y-3">
      <Card title="Proprietários">
        {draft.proprietarios.map((p, i) => (
          <p key={i} className="text-sm">{p.nome} — {p.cpfCnpj}</p>
        ))}
      </Card>
      <Card title="Imóvel">
        <RowKV k="Nome" v={draft.nomeImovel || "—"} />
        <RowKV k="Município/UF" v={`${draft.municipio || "—"}/${draft.uf || "—"}`} />
        <RowKV k="Zona" v={draft.zona || "—"} />
        <RowKV k="Origem" v={draft.origem === "sigef" ? "SIGEF/SNCR" : "Novo cadastro"} />
      </Card>
      <Card title="Documentação">
        <RowKV k="Documentos" v={`${draft.docs.length} item(ns)`} />
        <RowKV k="Reserva averbada" v={draft.reservaAverbada ? "Sim" : "Não"} />
      </Card>
      <Card title="Representante">
        <p className="text-sm">{draft.representantes.length === 0 ? "Nenhum" : draft.representantes.map((r) => r.nome).join(", ")}</p>
      </Card>
      <Card title="Mapa">
        <RowKV k="Perímetro" v={draft.perimetroDesenhado ? "Desenhado" : "Pendente"} />
        <RowKV k="Área calculada" v={`${draft.areaCalculadaHa} ha`} />
        <RowKV k="Sede" v={draft.sedeMarcada ? "Marcada" : "Pendente"} />
      </Card>
    </div>
  );
}

/* ============================== Building blocks ============================== */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary-dark">{title}</h3>
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function RowKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-border py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-bold text-foreground">{v}</span>
    </div>
  );
}

function BigField({
  label, value, onChange, placeholder, required, multiline,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
        />
      )}
    </label>
  );
}

function Radio({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex flex-1 items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-bold ${
        checked ? "border-primary bg-primary-soft text-primary-dark" : "border-border bg-card text-foreground"
      }`}
    >
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${checked ? "border-primary bg-primary" : "border-border"}`}>
        {checked && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      {label}
    </button>
  );
}

function Choice({ active, label, sub, onClick }: { active: boolean; label: string; sub?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border-2 px-3 py-3 text-left ${
        active ? "border-primary bg-primary-soft" : "border-border bg-card"
      }`}
    >
      <p className="text-sm font-bold text-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </button>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left ${
        checked ? "border-primary bg-primary-soft" : "border-border bg-card"
      }`}
    >
      <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </span>
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
    </button>
  );
}

function DocUpload({ label, hint }: { label: string; hint: string }) {
  const [filled, setFilled] = useState(false);
  return (
    <button
      onClick={() => setFilled((f) => !f)}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left ${
        filled ? "border-success bg-success/5" : "border-dashed border-border bg-card"
      }`}
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${filled ? "bg-success text-white" : "bg-primary-soft text-primary"}`}>
        {filled ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{filled ? "Arquivo selecionado" : hint}</span>
      </span>
    </button>
  );
}
