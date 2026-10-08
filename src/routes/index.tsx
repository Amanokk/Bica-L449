import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardPaste,
  Plus,
  Printer,
} from "lucide-react";
import { Toaster } from "sonner";
import {
  formatKg,
  isoToDisplay,
  SAMPLE_DATE,
  summarize,
  todayISO,
} from "@/lib/bica";
import { shiftDate, useBicaStore, useDayEntries } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Planilha } from "@/components/planilha";
import { Relatorio } from "@/components/relatorio";
import { TruckForm } from "@/components/truck-form";
import { PasteDialog } from "@/components/paste-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const markHydrated = useBicaStore((s) => s.markHydrated);
  const hydrated = useBicaStore((s) => s.hydrated);
  const selectedDate = useBicaStore((s) => s.selectedDate);
  const setDate = useBicaStore((s) => s.setDate);
  const entriesAll = useBicaStore((s) => s.entries);
  const openCreate = useBicaStore((s) => s.openCreate);
  const setPasteOpen = useBicaStore((s) => s.setPasteOpen);
  const loadSample = useBicaStore((s) => s.loadSample);
  const dayEntries = useDayEntries();
  const [tab, setTab] = useState<"planilha" | "texto">("planilha");

  useEffect(() => {
    const persistApi = useBicaStore.persist;
    const unsub = persistApi.onFinishHydration(() => {
      markHydrated();
    });
    persistApi.rehydrate();
    if (persistApi.hasHydrated()) markHydrated();
    return unsub;
  }, [markHydrated]);


  const stats = useMemo(() => summarize(dayEntries), [dayEntries]);
  const daysWithData = useMemo(() => {
    const set = new Set(entriesAll.map((e) => e.date));
    set.add(selectedDate);
    return [...set].sort();
  }, [entriesAll, selectedDate]);

  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-4 px-4 py-6">
        <div className="h-16 rounded-lg bg-sheet-2" />
        <div className="h-20 rounded-lg bg-sheet-2" />
        <div className="h-96 rounded-xl bg-sheet-2" />
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-paper pb-24 lg:pb-8">
      <header className="border-b border-rule bg-moss text-moss-fg no-print">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-moss-fg/70 uppercase">Obra · descarga</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Diário de Bica</h1>
            <p className="mt-1 max-w-xl text-sm text-moss-fg/80">
              Planilha de caminhões e carretas — e o texto do dia, no formato do grupo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => setPasteOpen(true)}>
              <ClipboardPaste />
              Colar texto
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer />
              Imprimir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5">
        <section className="flex flex-col gap-3 rounded-xl border border-rule bg-sheet p-3 shadow-sheet sm:flex-row sm:items-center sm:justify-between sm:p-4 no-print">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Dia anterior"
              onClick={() => setDate(shiftDate(selectedDate, -1))}
            >
              <ChevronLeft />
            </Button>
            <Input
              type="date"
              aria-label="Data da planilha"
              className="w-auto min-w-40"
              value={selectedDate}
              onChange={(e) => setDate(e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              aria-label="Próximo dia"
              onClick={() => setDate(shiftDate(selectedDate, 1))}
            >
              <ChevronRight />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDate(todayISO())}>
              Hoje
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {daysWithData.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDate(d)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium",
                  d === selectedDate ? "bg-moss text-moss-fg" : "bg-sheet-2 text-muted hover:bg-paper-2",
                )}
              >
                {isoToDisplay(d, false)}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 no-print">
          <Stat label="Caminhões" value={String(stats.count)} />
          <Stat label="Peso total" value={`${formatKg(stats.totalKg)} kg`} />
          {stats.byDestino
            .filter((d) => d.count > 0)
            .map((d) => (
              <Stat
                key={d.id}
                label={d.label}
                value={`${d.count} · ${formatKg(d.kg)} kg`}
              />
            ))}
        </section>

        <div className="flex gap-1 rounded-lg bg-sheet-2 p-1 lg:hidden no-print">
          <TabButton active={tab === "planilha"} onClick={() => setTab("planilha")}>
            Planilha
          </TabButton>
          <TabButton active={tab === "texto"} onClick={() => setTab("texto")}>
            Texto
          </TabButton>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.9fr)]">
          <div className={cn(tab === "planilha" ? "block" : "hidden", "lg:block")}>
            <Planilha />
          </div>
          <div className={cn(tab === "texto" ? "block" : "hidden", "lg:block lg:sticky lg:top-4")}>
            <Relatorio />
          </div>
        </div>

        {selectedDate !== SAMPLE_DATE && !entriesAll.some((e) => e.date === SAMPLE_DATE) ? (
          <p className="text-center text-sm text-muted no-print">
            <button type="button" className="underline decoration-rule underline-offset-4" onClick={loadSample}>
              Carregar o exemplo do dia 18/09
            </button>
          </p>
        ) : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-sheet p-3 lg:hidden no-print">
        <Button className="h-12 w-full" onClick={() => openCreate()}>
          <Plus />
          Novo caminhão
        </Button>
      </div>

      <TruckForm />
      <PasteDialog />
      <Toaster position="bottom-center" richColors closeButton />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-rule bg-sheet px-4 py-3 shadow-sheet">
      <div className="text-xs font-medium tracking-wide text-faint uppercase">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 flex-1 rounded-md text-sm font-medium",
        active ? "bg-sheet text-ink shadow-sheet" : "text-muted",
      )}
    >
      {children}
    </button>
  );
}
