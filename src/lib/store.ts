import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Destino,
  type TruckEntry,
  SAMPLE_DATE,
  SAMPLE_ENTRIES,
  newId,
  todayISO,
} from "@/lib/bica";

export type EditorMode = "create" | "edit";

interface BicaState {
  hydrated: boolean;
  selectedDate: string;
  groupByDestino: boolean;
  entries: TruckEntry[];
  editorOpen: boolean;
  editorMode: EditorMode;
  editingId: string | null;
  createPreset: Partial<TruckEntry> | null;
  pasteOpen: boolean;
  markHydrated: () => void;
  setDate: (date: string) => void;
  setGroupByDestino: (value: boolean) => void;
  addEntry: (entry: Omit<TruckEntry, "id" | "date">, date?: string) => string;
  updateEntry: (id: string, patch: Partial<TruckEntry>) => void;
  removeEntry: (id: string) => TruckEntry | undefined;
  restoreEntry: (entry: TruckEntry, index?: number) => void;
  importEntries: (date: string, rows: Omit<TruckEntry, "id">[], replace: boolean) => number;
  openCreate: (preset?: Partial<TruckEntry>) => void;
  openEdit: (id: string) => void;
  closeEditor: () => void;
  setPasteOpen: (open: boolean) => void;
  loadSample: () => void;
}

export const useBicaStore = create<BicaState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      selectedDate: SAMPLE_DATE,
      groupByDestino: true,
      entries: SAMPLE_ENTRIES,
      editorOpen: false,
      editorMode: "create",
      editingId: null,
      createPreset: null,
      pasteOpen: false,
      markHydrated: () => {
        if (get().hydrated) return;
        set({ hydrated: true });
      },
      setDate: (date) => set({ selectedDate: date }),
      setGroupByDestino: (value) => set({ groupByDestino: value }),
      addEntry: (entry, date) => {
        const id = newId();
        const row: TruckEntry = { ...entry, id, date: date ?? get().selectedDate };
        set((s) => ({ entries: [...s.entries, row] }));
        return id;
      },
      updateEntry: (id, patch) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch, id: e.id } : e)),
        })),
      removeEntry: (id) => {
        const found = get().entries.find((e) => e.id === id);
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
        return found;
      },
      restoreEntry: (entry, index) =>
        set((s) => {
          const next = [...s.entries];
          const at = index == null ? next.length : Math.min(Math.max(index, 0), next.length);
          next.splice(at, 0, entry);
          return { entries: next };
        }),
      importEntries: (date, rows, replace) => {
        const mapped: TruckEntry[] = rows.map((row) => ({
          ...row,
          id: newId(),
          date: row.date || date,
        }));
        set((s) => ({
          selectedDate: date,
          entries: replace
            ? [...s.entries.filter((e) => e.date !== date), ...mapped]
            : [...s.entries, ...mapped],
        }));
        return mapped.length;
      },
      openCreate: (preset) =>
        set({
          editorOpen: true,
          editorMode: "create",
          editingId: null,
          createPreset: preset ?? null,
        }),
      openEdit: (id) => set({ editorOpen: true, editorMode: "edit", editingId: id, createPreset: null }),
      closeEditor: () => set({ editorOpen: false, editingId: null, createPreset: null }),
      setPasteOpen: (open) => set({ pasteOpen: open }),
      loadSample: () =>
        set((s) => {
          const withoutSample = s.entries.filter((e) => e.date !== SAMPLE_DATE);
          return {
            selectedDate: SAMPLE_DATE,
            entries: [...withoutSample, ...SAMPLE_ENTRIES.map((e) => ({ ...e, id: newId() }))],
          };
        }),
    }),
    {
      name: "diario-de-bica-v1",
      skipHydration: true,
      partialize: (s) => ({
        selectedDate: s.selectedDate,
        groupByDestino: s.groupByDestino,
        entries: s.entries,
      }),
    },
  ),
);

export function useDayEntries(): TruckEntry[] {
  const selectedDate = useBicaStore((s) => s.selectedDate);
  const entries = useBicaStore((s) => s.entries);
  return useMemo(
    () => entries.filter((e) => e.date === selectedDate),
    [entries, selectedDate],
  );
}

export function suggestDestino(entries: TruckEntry[]): Destino {
  if (entries.length === 0) return "pulmao";
  return entries[entries.length - 1].destino;
}

export function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  return todayISO(dt);
}
