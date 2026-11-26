"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, Bell, CalendarDays, ChevronDown, CircleHelp,
  Clock3, Coins, Download, Filter, LayoutDashboard, Search, SlidersHorizontal,
  TrendingUp, Wallet, Landmark, Menu, X, Info
} from "lucide-react";

type AssetType = "Ação" | "FII";
type EventType = "Dividendo" | "JCP" | "Rendimento";
type EventStatus = "A receber" | "Pago" | "Data COM";

type DividendEvent = {
  ticker: string; company: string; assetType: AssetType; eventType: EventType;
  amount: number; comDate: string; exDate: string; paymentDate: string; status: EventStatus;
};

const events: DividendEvent[] = [
  { ticker:"ITUB4", company:"Itaú Unibanco", assetType:"Ação", eventType:"JCP", amount:0.32, comDate:"2026-12-02", exDate:"2026-12-03", paymentDate:"2026-12-30", status:"A receber" },
  { ticker:"HGLG11", company:"Pátria Logística", assetType:"FII", eventType:"Rendimento", amount:1.10, comDate:"2026-12-01", exDate:"2026-12-02", paymentDate:"2026-12-15", status:"A receber" },
  { ticker:"PETR4", company:"Petrobras", assetType:"Ação", eventType:"Dividendo", amount:0.48, comDate:"2026-11-28", exDate:"2026-12-01", paymentDate:"2026-12-20", status:"A receber" },
  { ticker:"MXRF11", company:"Maxi Renda", assetType:"FII", eventType:"Rendimento", amount:0.10, comDate:"2026-11-27", exDate:"2026-11-30", paymentDate:"2026-12-12", status:"A receber" },
  { ticker:"BBAS3", company:"Banco do Brasil", assetType:"Ação", eventType:"JCP", amount:0.21, comDate:"2026-11-25", exDate:"2026-11-26", paymentDate:"2026-12-10", status:"Data COM" },
  { ticker:"KNRI11", company:"Kinea Renda Imobiliária", assetType:"FII", eventType:"Rendimento", amount:1.00, comDate:"2026-11-14", exDate:"2026-11-17", paymentDate:"2026-11-25", status:"Pago" },
  { ticker:"VALE3", company:"Vale", assetType:"Ação", eventType:"Dividendo", amount:1.82, comDate:"2026-11-10", exDate:"2026-11-11", paymentDate:"2026-11-28", status:"A receber" },
  { ticker:"XPLG11", company:"XP Log", assetType:"FII", eventType:"Rendimento", amount:0.82, comDate:"2026-11-07", exDate:"2026-11-10", paymentDate:"2026-11-14", status:"Pago" },
];

const brl = (value: number) => value.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
const date = (value: string) => new Date(value + "T12:00:00").toLocaleDateString("pt-BR", { day:"2-digit", month:"short" });

export default function Home() {
  const [assetFilter, setAssetFilter] = useState<"Todos" | AssetType>("Todos");
  const [period, setPeriod] = useState<"Todos" | "Próximos" | "Recentes">("Todos");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = useMemo(() => events.filter((event) => {
    const matchesType = assetFilter === "Todos" || event.assetType === assetFilter;
    const matchesQuery = (event.ticker + " " + event.company).toLowerCase().includes(query.toLowerCase());
    const matchesPeriod = period === "Todos" || (period === "Próximos" ? event.comDate >= "2026-11-26" : event.comDate < "2026-11-26");
    return matchesType && matchesQuery && matchesPeriod;
  }).sort((a,b) => b.comDate.localeCompare(a.comDate)), [assetFilter, period, query]);

  const upcoming = events.filter(e => e.comDate >= "2026-11-26").length;
  const total = events.reduce((sum,e) => sum + e.amount, 0);

  return (
    <div className="page-shell flex">
      <aside className="sidebar hidden min-h-screen shrink-0 flex-col px-5 py-6 md:flex">
        <a href="#" className="mb-10 flex items-center gap-3 px-1">
          <span className="brand-mark"><Coins size={19}/></span>
          <span><span className="block font-[family-name:var(--font-display)] text-[15px] font-extrabold tracking-tight">proventos<span className="text-[#16805a]">.</span></span><span className="block text-[10px] font-medium tracking-[.13em] text-[#9aa49e]">MONITOR DE MERCADO</span></span>
        </a>
        <p className="mb-3 px-3 text-[10px] font-bold tracking-[.13em] text-[#a0aaa4]">MENU PRINCIPAL</p>
        <nav className="space-y-1">
          <a className="nav-link active" href="#"><LayoutDashboard size={17}/> Visão geral</a>
          <a className="nav-link" href="#eventos"><CalendarDays size={17}/> Calendário de proventos</a>
          <a className="nav-link" href="#eventos"><Wallet size={17}/> Ações e FIIs</a>
        </nav>
        <div className="mt-auto rounded-xl bg-[#f5f8f5] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold"><CircleHelp size={15} className="text-[#438568]"/> Sobre os dados</div>
          <p className="text-[11px] leading-relaxed text-[#7a867f]">Este painel é uma demonstração visual. Os eventos exibidos não representam dados oficiais ou recomendações.</p>
        </div>
        <div className="mt-5 border-t border-[#edf0ed] pt-4 text-[10px] text-[#9aa49e]">MONITOR DE PROVENTOS · MVP 0.1</div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-[70px] items-center justify-between border-b border-[#e9ede9] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-[#718078] md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu ? <X size={19}/> : <Menu size={19}/>}</button>
            <span className="text-xs font-semibold text-[#8b9690]">Painel <span className="mx-2 text-[#c6cec8]">/</span> <span className="text-[#25352d]">Visão geral</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-[#e9eee9] bg-[#fafbfa] px-3 py-1.5 text-[10px] font-semibold text-[#7b887f] sm:inline-flex"><span className="mr-1.5 mt-1 h-1.5 w-1.5 rounded-full bg-[#d69a38]"/> Ambiente de demonstração</span>
            <button className="rounded-lg border border-[#e9ede9] p-2 text-[#75827a]" aria-label="Notificações"><Bell size={17}/></button>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e7f1ea] text-[11px] font-bold text-[#28704e]">MP</div>
          </div>
        </header>

        {mobileMenu && <div className="border-b border-[#e9ede9] bg-white px-5 py-3 md:hidden"><a href="#" className="nav-link active"><LayoutDashboard size={17}/> Visão geral</a><a href="#eventos" className="nav-link"><CalendarDays size={17}/> Calendário de proventos</a></div>}

        <main className="main-content py-8 sm:py-10">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-[#478568]"><span className="h-1.5 w-1.5 rounded-full bg-[#478568]"/> Quinta-feira, 26 de novembro de 2026</div>
              <h1 className="font-[family-name:var(--font-display)] text-[27px] font-extrabold tracking-tight text-[#1c2b23] sm:text-[32px]">Visão geral</h1>
              <p className="mt-1 text-sm text-[#87928b]">Acompanhe os próximos proventos e organize seus rendimentos.</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#e4eae5] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#536159] shadow-sm"><Download size={15}/> Exportar dados</button>
          </div>

          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#e9e5d6] bg-[#fbfaf5] px-4 py-3 text-[11px] leading-relaxed text-[#857b5f]"><Info size={15} className="mt-0.5 shrink-0"/><span><strong className="font-bold">Dados ilustrativos:</strong> os ativos, valores e datas abaixo são fictícios e servem apenas para demonstrar o funcionamento do MVP.</span></div>

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="stat-card"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold text-[#829087]">Eventos listados</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf4ef] text-[#367653]"><CalendarDays size={16}/></span></div><div className="font-[family-name:var(--font-display)] text-[27px] font-extrabold tracking-tight">08</div><div className="mt-1 text-[11px] text-[#9aa49e]">Ações e fundos imobiliários</div></div>
            <div className="stat-card"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold text-[#829087]">Próximos eventos</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf4ef] text-[#367653]"><Clock3 size={16}/></span></div><div className="font-[family-name:var(--font-display)] text-[27px] font-extrabold tracking-tight">{String(upcoming).padStart(2,"0")}</div><div className="mt-1 text-[11px] text-[#9aa49e]">Com data COM a partir de hoje</div></div>
            <div className="stat-card"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold text-[#829087]">Soma por ativo</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf4ef] text-[#367653]"><Coins size={16}/></span></div><div className="font-[family-name:var(--font-display)] text-[27px] font-extrabold tracking-tight">{brl(total)}</div><div className="mt-1 text-[11px] text-[#9aa49e]">Valores brutos por ação ou cota</div></div>
            <div className="stat-card"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold text-[#829087]">Tipos de ativos</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf4ef] text-[#367653]"><Landmark size={16}/></span></div><div className="font-[family-name:var(--font-display)] text-[27px] font-extrabold tracking-tight">02</div><div className="mt-1 text-[11px] text-[#9aa49e]">Ações e fundos imobiliários</div></div>
          </section>

          <section id="eventos" className="overflow-hidden rounded-[14px] border border-[#e7ece8] bg-white">
            <div className="flex flex-col justify-between gap-4 border-b border-[#edf0ed] p-5 sm:flex-row sm:items-center sm:px-6">
              <div><h2 className="font-[family-name:var(--font-display)] text-base font-extrabold">Agenda de proventos</h2><p className="mt-1 text-xs text-[#929d96]">Eventos anunciados para ações e FIIs</p></div>
              <div className="flex items-center gap-2 text-[11px] text-[#8b9690]"><Clock3 size={14}/> Atualização demonstrativa</div>
            </div>
            <div className="flex flex-col gap-3 border-b border-[#edf0ed] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-wrap gap-2">
                {(["Todos","Ação","FII"] as const).map(type => <button key={type} onClick={() => setAssetFilter(type)} className={`filter-chip ${assetFilter === type ? "selected" : ""}`}>{type === "Ação" ? "Ações" : type === "Todos" ? "Todos os ativos" : "FIIs"}</button>)}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select value={period} onChange={e => setPeriod(e.target.value as typeof period)} className="rounded-lg border border-[#e5eae6] bg-white px-3 py-2 text-xs font-semibold text-[#66736b] outline-none"><option value="Todos">Todo período</option><option value="Próximos">Próximos eventos</option><option value="Recentes">Datas COM anteriores</option></select>
                <div className="relative min-w-[170px] flex-1 sm:w-[190px] sm:flex-none"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aaa4]"/><input className="search-field" placeholder="Buscar ativo..." value={query} onChange={e => setQuery(e.target.value)}/></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead><tr className="bg-[#fafbfa] text-[10px] font-bold uppercase tracking-[.08em] text-[#98a39c]"><th className="px-6 py-3.5">Ativo</th><th className="px-4 py-3.5">Tipo</th><th className="px-4 py-3.5">Valor bruto</th><th className="px-4 py-3.5">Data COM</th><th className="px-4 py-3.5">Data EX</th><th className="px-4 py-3.5">Pagamento</th><th className="px-6 py-3.5">Status</th></tr></thead>
                <tbody>{filtered.map(event => <tr key={event.ticker + event.comDate} className="table-row text-xs"><td className="px-6 py-4"><div className="font-bold text-[#26372e]">{event.ticker}</div><div className="mt-1 text-[10px] text-[#98a39c]">{event.company}</div></td><td className="px-4 py-4"><span className={`pill ${event.assetType === "FII" ? "bg-[#f0edfa] text-[#7561a4]" : "bg-[#edf3f7] text-[#52758b]"}`}>{event.eventType}</span></td><td className="px-4 py-4 font-semibold text-[#34453b]">{brl(event.amount)}</td><td className="px-4 py-4"><span className="font-bold text-[#2f6047]">{date(event.comDate)}</span></td><td className="px-4 py-4 text-[#748078]">{date(event.exDate)}</td><td className="px-4 py-4 text-[#748078]">{date(event.paymentDate)}</td><td className="px-6 py-4"><span className={`pill ${event.status === "Pago" ? "bg-[#edf5ef] text-[#43815c]" : event.status === "Data COM" ? "bg-[#fff5e6] text-[#a77a31]" : "bg-[#f1f3f2] text-[#738078]"}`}>{event.status}</span></td></tr>)}</tbody>
              </table>
              {filtered.length === 0 && <div className="px-6 py-12 text-center text-sm text-[#8b9690]">Nenhum evento encontrado para os filtros selecionados.</div>}
            </div>
            <div className="flex flex-col justify-between gap-2 border-t border-[#edf0ed] px-5 py-3.5 text-[10px] text-[#9aa49e] sm:flex-row sm:items-center sm:px-6"><span>Exibindo {filtered.length} de {events.length} eventos demonstrativos</span><span>Valores brutos por ação ou cota · Datas ilustrativas</span></div>
          </section>
          <footer className="flex flex-col justify-between gap-2 py-7 text-[10px] text-[#9ca69f] sm:flex-row"><span>© 2026 Monitor de Proventos. Projeto independente.</span><span>Informações demonstrativas. Não constitui recomendação de investimento.</span></footer>
        </main>
      </div>
    </div>
  );
}
