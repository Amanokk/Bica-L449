import { useState } from "react";
import { toast } from "sonner";
import { parseDayReport } from "@/lib/bica";
import { useBicaStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function PasteDialog() {
  const open = useBicaStore((s) => s.pasteOpen);
  const setPasteOpen = useBicaStore((s) => s.setPasteOpen);
  const selectedDate = useBicaStore((s) => s.selectedDate);
  const importEntries = useBicaStore((s) => s.importEntries);
  const [text, setText] = useState("");
  const [replace, setReplace] = useState(false);

  function submit() {
    const parsed = parseDayReport(text, selectedDate);
    if (!parsed.entries.length) {
      toast.error("Não achei caminhões nesse texto. Cole o formato do WhatsApp.");
      return;
    }
    const n = importEntries(parsed.date, parsed.entries, replace);
    toast.success(`${n} caminhão${n === 1 ? "" : "s"} lançado${n === 1 ? "" : "s"} no dia.`);
    setText("");
    setPasteOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setPasteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Colar texto</DialogTitle>
          <DialogDescription>
            Cole o recado do dia (CAMINHÕES DE BICA DIA …) e a planilha se preenche sozinha.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-5 py-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"CAMINHÕES DE BICA DIA 18/09\n\n*Caminhão de bica Pulmão*\nLYC 249\nPlaca RBJ6F60\n..."}
            className="min-h-56 font-mono text-xs"
          />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              className="size-4 accent-moss"
              checked={replace}
              onChange={(e) => setReplace(e.target.checked)}
            />
            Substituir os caminhões deste dia
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setPasteOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>Lançar na planilha</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
