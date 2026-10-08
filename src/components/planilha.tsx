import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  destinoLabel,
  formatKg,
  isoToDisplay,
  materialLabel,
  parsePeso,
  type Destino,
  type TruckEntry,
} from "@/lib/bica";
import { useBicaStore, useDayEntries } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function destTone(d: Destino): "pulmao" | "base" | "subbase" {
  return d;
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium tracking-wide text-faint uppercase">{label}</div>
      <div className="truncate text-sm text-ink">{children || "—"}</div>
    </div>
  );
}

function TruckCard({ entry }: { entry: TruckEntry }) {
  const openEdit = useBicaStore((s) => s.openEdit);
  const removeEntry = useBicaStore((s) => s.removeEntry);
  const restoreEntry = useBicaStore((s) => s.restoreEntry);

  function remove() {
    const removed = removeEntry(entry.id);
    if (!removed) return;
    toast("Caminhão removido", {
      action: {
        label: "Desfazer",
        onClick: () => restoreEntry(removed),
      },
    });
  }

  return (
    <article className="rounded-lg border border-rule bg-sheet p-4 shadow-sheet">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={destTone(entry.destino)}>{destinoLabel(entry.destino)}</Badge>
            {entry.material !== "bica" ? <Badge>{materialLabel(entry.material)}</Badge> : null}
            <h3 className="font-display text-xl font-semibold tracking-tight">{entry.caminhao || "Sem código"}</h3>
          </div>
          <p className="mt-1 font-mono text-sm text-muted">{entry.placa || "sem placa"}</p>
        </div>
        <div className="flex shrink-0">
          <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={() => openEdit(entry.id)}>
            <Pencil />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Excluir" onClick={remove}>
            <Trash2 />
          </Button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Cell label="Nota fiscal">{entry.notaFiscal}</Cell>
        <Cell label="Peso">{entry.peso ? `${formatKg(parsePeso(entry.peso))} kg` : ""}</Cell>
        <Cell label="Chegou">{entry.chegou}</Cell>
        <Cell label="Descarga">{entry.descarga}</Cell>
        <Cell label="Hora PF">{entry.horaPf}</Cell>
        <Cell label="OC">{entry.oc}</Cell>
        <Cell label="Estaca">{entry.estaca}</Cell>
        <Cell label="Rua">{entry.rua}</Cell>
      </div>
    </article>
  );
}

export function Planilha() {
  const entries = useDayEntries();
  const selectedDate = useBicaStore((s) => s.selectedDate);
  const openCreate = useBicaStore((s) => s.openCreate);
  const openEdit = useBicaStore((s) => s.openEdit);
  const removeEntry = useBicaStore((s) => s.removeEntry);
  const restoreEntry = useBicaStore((s) => s.restoreEntry);

  function remove(entry: TruckEntry) {
    const removed = removeEntry(entry.id);
    if (!removed) return;
    toast("Caminhão removido", {
      action: { label: "Desfazer", onClick: () => restoreEntry(removed) },
    });
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between gap-3 no-print">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Planilha</h2>
          <p className="text-sm text-muted">Caminhões e carretas de bica, saibro e rachinha</p>
        </div>
        <Button onClick={() => openCreate()} className="hidden sm:inline-flex">
          <Plus />
          Novo caminhão
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-rule-strong bg-sheet px-6 py-16 text-center no-print">
          <p className="font-display text-2xl font-semibold">Nenhum caminhão neste dia</p>
          <p className="mt-2 max-w-sm text-sm text-pretty text-muted">
            Lance um caminhão ou cole o texto do WhatsApp para montar a planilha automaticamente.
          </p>
          <Button className="mt-5" onClick={() => openCreate()}>
            <Plus />
            Lançar primeiro caminhão
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:hidden no-print">
            {entries.map((entry) => (
              <TruckCard key={entry.id} entry={entry} />
            ))}
          </div>

          <div className="hidden min-h-0 overflow-auto rounded-lg border border-rule bg-sheet shadow-sheet lg:block no-print">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-sheet-2 text-xs tracking-wide text-muted uppercase">
                <tr>
                  {[
                    "Bica para",
                    "Caminhão",
                    "Placa",
                    "Nota fiscal",
                    "Peso",
                    "Chegou",
                    "Descarga",
                    "Hora PF",
                    "OC",
                    "Estaca",
                    "Rua",
                    "",
                  ].map((h) => (
                    <th key={h || "actions"} className="border-b border-rule px-3 py-2.5 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="cursor-pointer border-b border-rule last:border-b-0 hover:bg-paper/70"
                    onClick={() => openEdit(entry.id)}
                  >
                    <td className="px-3 py-2.5">
                      <Badge tone={destTone(entry.destino)}>{destinoLabel(entry.destino)}</Badge>
                    </td>
                    <td className="px-3 py-2.5 font-medium">{entry.caminhao || "—"}</td>
                    <td className="px-3 py-2.5 font-mono text-xs">{entry.placa || "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums">{entry.notaFiscal || "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums">{entry.peso ? formatKg(parsePeso(entry.peso)) : "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums">{entry.chegou || "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums">{entry.descarga || "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums">{entry.horaPf || "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums">{entry.oc || "—"}</td>
                    <td className="px-3 py-2.5">{entry.estaca || "—"}</td>
                    <td className="max-w-48 truncate px-3 py-2.5">{entry.rua || "—"}</td>
                    <td className="px-2 py-1.5 text-right no-print" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon-sm" aria-label="Excluir" onClick={() => remove(entry)}>
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="print-only p-6">
        <h1 className="mb-1 text-center text-lg font-bold">Caminhões/Carretas de Bica/Saibro/Rachinha</h1>
        <p className="mb-4 text-right text-sm">Data: {isoToDisplay(selectedDate)}</p>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              {["Bica para", "Caminhão", "Placa", "Nota Fiscal", "PESO", "Chegou", "Descarga", "Hora PF", "OC", "Estaca", "Rua"].map(
                (h) => (
                  <th key={h} className="border border-ink px-1 py-1">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {(entries.length ? entries : Array.from({ length: 18 }, () => null)).map((entry, i) => (
              <tr key={entry?.id ?? i}>
                <td className="border border-ink px-1 py-1">{entry ? destinoLabel(entry.destino) : ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.caminhao ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.placa ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.notaFiscal ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.peso ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.chegou ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.descarga ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.horaPf ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.oc ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.estaca ?? ""}</td>
                <td className="border border-ink px-1 py-1">{entry?.rua ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
