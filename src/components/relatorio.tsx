import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDayReport, formatTruckBlock } from "@/lib/bica";
import { useBicaStore, useDayEntries } from "@/lib/store";
import { Button } from "@/components/ui/button";

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function Relatorio() {
  const entries = useDayEntries();
  const selectedDate = useBicaStore((s) => s.selectedDate);
  const groupByDestino = useBicaStore((s) => s.groupByDestino);
  const setGroupByDestino = useBicaStore((s) => s.setGroupByDestino);
  const [copied, setCopied] = useState(false);

  const report = useMemo(
    () => formatDayReport(selectedDate, entries, groupByDestino),
    [selectedDate, entries, groupByDestino],
  );

  async function copyAll() {
    if (!entries.length) {
      toast.error("Não há caminhões para copiar.");
      return;
    }
    await copyText(report);
    setCopied(true);
    toast.success("Texto copiado. Cole no WhatsApp.");
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function copyOne(id: string) {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    await copyText(formatTruckBlock(entry));
    toast.success("Bloco copiado.");
  }

  function sendWhatsApp() {
    if (!entries.length) {
      toast.error("Não há caminhões para enviar.");
      return;
    }
    const url = `https://wa.me/?text=${encodeURIComponent(report)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <aside className="flex min-h-0 flex-col rounded-xl border border-rule bg-sheet shadow-sheet no-print">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rule px-4 py-3 sm:px-5">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Texto do dia</h2>
          <p className="text-sm text-muted">Pronto para colar no grupo</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            className="size-4 accent-moss"
            checked={groupByDestino}
            onChange={(e) => setGroupByDestino(e.target.checked)}
          />
          Agrupar por destino
        </label>
      </div>

      <pre className="min-h-48 flex-1 overflow-auto whitespace-pre-wrap px-4 py-4 font-mono text-xs leading-relaxed text-ink sm:px-5">
        {entries.length ? report : "Lance caminhões na planilha para gerar o texto."}
      </pre>

      <div className="flex flex-col gap-2 border-t border-rule p-3 sm:flex-row">
        <Button className="flex-1" onClick={copyAll} disabled={!entries.length}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copiado" : "Copiar texto"}
        </Button>
        <Button className="flex-1" variant="outline" onClick={sendWhatsApp} disabled={!entries.length}>
          <MessageCircle />
          WhatsApp
        </Button>
      </div>

      {entries.length > 1 ? (
        <div className="no-print border-t border-rule px-4 py-3 sm:px-5">
          <p className="mb-2 text-xs font-medium tracking-wide text-faint uppercase">Copiar um caminhão</p>
          <ul className="flex flex-col gap-1">
            {entries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm hover:bg-sheet-2"
                  onClick={() => copyOne(entry.id)}
                >
                  <span className="truncate">
                    {entry.caminhao || "Sem código"} · NF {entry.notaFiscal || "—"}
                  </span>
                  <Copy className="size-3.5 shrink-0 text-faint" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
