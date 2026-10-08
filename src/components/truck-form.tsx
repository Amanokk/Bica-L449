import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  DESTINOS,
  EMPTY_TRUCK,
  MATERIAIS,
  knownFleet,
  lastForDestino,
  normalizeTime,
  type Destino,
  type Material,
  type TruckEntry,
} from "@/lib/bica";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";

type FormState = Omit<TruckEntry, "id" | "date">;

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function TruckForm() {
  const editorOpen = useBicaStore((s) => s.editorOpen);
  const editorMode = useBicaStore((s) => s.editorMode);
  const editingId = useBicaStore((s) => s.editingId);
  const createPreset = useBicaStore((s) => s.createPreset);
  const closeEditor = useBicaStore((s) => s.closeEditor);
  const addEntry = useBicaStore((s) => s.addEntry);
  const updateEntry = useBicaStore((s) => s.updateEntry);
  const allEntries = useBicaStore((s) => s.entries);

  const editing = editorMode === "edit" ? allEntries.find((e) => e.id === editingId) : undefined;

  const [form, setForm] = useState<FormState>(EMPTY_TRUCK);

  useEffect(() => {
    if (!editorOpen) return;
    const state = useBicaStore.getState();
    const dayEntries = state.entries.filter((e) => e.date === state.selectedDate);
    if (editorMode === "edit") {
      const current = state.entries.find((e) => e.id === editingId);
      if (current) {
        const { id: _id, date: _date, ...rest } = current;
        setForm(rest);
      }
      return;
    }
    const last = dayEntries[dayEntries.length - 1];
    const destino = (createPreset?.destino ?? last?.destino ?? "pulmao") as Destino;
    const hint = lastForDestino(dayEntries, destino);
    setForm({
      ...EMPTY_TRUCK,
      destino,
      material: createPreset?.material ?? last?.material ?? "bica",
      oc: createPreset?.oc ?? hint?.oc ?? last?.oc ?? "",
      rua: createPreset?.rua ?? hint?.rua ?? last?.rua ?? "Canteiro",
      estaca: createPreset?.estaca ?? hint?.estaca ?? "",
      caminhao: createPreset?.caminhao ?? "",
      placa: createPreset?.placa ?? "",
    });
  }, [editorOpen, editorMode, editingId, createPreset]);

  const fleet = useMemo(() => knownFleet(allEntries), [allEntries]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onCaminhao(value: string) {
    const upper = value.toUpperCase();
    const known = fleet.find((f) => f.caminhao.toUpperCase() === upper);
    setForm((prev) => ({
      ...prev,
      caminhao: upper,
      placa: known?.placa && !prev.placa ? known.placa : prev.placa,
    }));
  }

  function onDestino(destino: Destino) {
    const state = useBicaStore.getState();
    const dayEntries = state.entries.filter((e) => e.date === state.selectedDate);
    const hint = lastForDestino(dayEntries, destino);
    setForm((prev) => ({
      ...prev,
      destino,
      oc: prev.oc || hint?.oc || "",
      rua: prev.rua || hint?.rua || "Canteiro",
      estaca: prev.estaca || hint?.estaca || "",
    }));
  }

  function persist(andAnother: boolean) {
    if (!form.caminhao.trim() && !form.placa.trim() && !form.notaFiscal.trim()) {
      toast.error("Preencha ao menos caminhão, placa ou nota fiscal.");
      return;
    }
    if (editorMode === "edit" && editingId) {
      updateEntry(editingId, form);
      toast.success("Caminhão atualizado.");
      closeEditor();
      return;
    }
    addEntry(form);
    toast.success("Caminhão lançado.");
    if (andAnother) {
      setForm((prev) => ({
        ...EMPTY_TRUCK,
        destino: prev.destino,
        material: prev.material,
        oc: prev.oc,
        rua: prev.rua,
        estaca: prev.estaca,
      }));
      return;
    }
    closeEditor();
  }

  return (
    <Dialog open={editorOpen} onOpenChange={(open) => !open && closeEditor()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editorMode === "edit" ? "Editar caminhão" : "Novo caminhão"}</DialogTitle>
          <DialogDescription>
            {editorMode === "edit"
              ? "Ajuste os dados deste lançamento."
              : "Lançamento na planilha do dia. Depois o texto do WhatsApp sai pronto."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid grid-cols-1 gap-3 overflow-y-auto px-5 py-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            persist(false);
          }}
        >
          <Field id="destino" label="Bica para">
            <NativeSelect
              id="destino"
              value={form.destino}
              onChange={(e) => onDestino(e.target.value as Destino)}
            >
              {DESTINOS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field id="material" label="Material">
            <NativeSelect
              id="material"
              value={form.material}
              onChange={(e) => patch("material", e.target.value as Material)}
            >
              {MATERIAIS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field id="caminhao" label="Caminhão">
            <Input
              id="caminhao"
              list="fleet-names"
              autoComplete="off"
              placeholder="LYC 249"
              value={form.caminhao}
              onChange={(e) => onCaminhao(e.target.value)}
            />
            <datalist id="fleet-names">
              {fleet.map((f) => (
                <option key={f.caminhao} value={f.caminhao} />
              ))}
            </datalist>
          </Field>
          <Field id="placa" label="Placa">
            <Input
              id="placa"
              autoComplete="off"
              placeholder="RBJ6F60"
              value={form.placa}
              onChange={(e) => patch("placa", e.target.value.toUpperCase().replace(/\s+/g, ""))}
            />
          </Field>
          <Field id="nf" label="Nota fiscal">
            <Input
              id="nf"
              inputMode="numeric"
              placeholder="11043"
              value={form.notaFiscal}
              onChange={(e) => patch("notaFiscal", e.target.value)}
            />
          </Field>
          <Field id="peso" label="Peso (kg)">
            <Input
              id="peso"
              inputMode="numeric"
              placeholder="29100"
              value={form.peso}
              onChange={(e) => patch("peso", e.target.value.replace(/[^\d]/g, ""))}
            />
          </Field>
          <Field id="chegou" label="Chegou">
            <Input
              id="chegou"
              inputMode="numeric"
              placeholder="14:48"
              value={form.chegou}
              onChange={(e) => patch("chegou", normalizeTime(e.target.value))}
            />
          </Field>
          <Field id="descarga" label="Descarga">
            <Input
              id="descarga"
              inputMode="numeric"
              placeholder="14:53"
              value={form.descarga}
              onChange={(e) => patch("descarga", normalizeTime(e.target.value))}
            />
          </Field>
          <Field id="horaPf" label="Hora PF">
            <Input
              id="horaPf"
              inputMode="numeric"
              placeholder="14:07"
              value={form.horaPf}
              onChange={(e) => patch("horaPf", normalizeTime(e.target.value))}
            />
          </Field>
          <Field id="oc" label="OC">
            <Input id="oc" placeholder="157.838" value={form.oc} onChange={(e) => patch("oc", e.target.value)} />
          </Field>
          <Field id="estaca" label="Estaca">
            <Input
              id="estaca"
              placeholder="—"
              value={form.estaca}
              onChange={(e) => patch("estaca", e.target.value)}
            />
          </Field>
          <Field id="rua" label="Rua / local">
            <Input
              id="rua"
              list="rua-options"
              placeholder="Canteiro"
              value={form.rua}
              onChange={(e) => patch("rua", e.target.value)}
            />
            <datalist id="rua-options">
              <option value="Canteiro" />
              {[...new Set(allEntries.map((e) => e.rua).filter(Boolean))]
                .filter((r) => r !== "Canteiro")
                .slice(0, 12)
                .map((r) => (
                  <option key={r} value={r} />
                ))}
            </datalist>
          </Field>
          <DialogFooter className="col-span-full -mx-5 -mb-4 mt-1">
            <Button type="button" variant="ghost" onClick={closeEditor}>
              Cancelar
            </Button>
            {editorMode === "create" ? (
              <Button type="button" variant="outline" onClick={() => persist(true)}>
                Salvar e outro
              </Button>
            ) : null}
            <Button type="submit">{editorMode === "edit" ? "Salvar" : "Lançar na planilha"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
