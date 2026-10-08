export type Destino = "pulmao" | "base" | "subbase";
export type Material = "bica" | "saibro" | "rachinha";

export interface TruckEntry {
  id: string;
  date: string;
  destino: Destino;
  material: Material;
  caminhao: string;
  placa: string;
  notaFiscal: string;
  peso: string;
  chegou: string;
  descarga: string;
  horaPf: string;
  oc: string;
  estaca: string;
  rua: string;
}

export const DESTINOS: { id: Destino; label: string; short: string }[] = [
  { id: "pulmao", label: "Pulmão", short: "Pulmão" },
  { id: "base", label: "Base", short: "Base" },
  { id: "subbase", label: "Sub-base", short: "Sub-base" },
];

export const MATERIAIS: { id: Material; label: string }[] = [
  { id: "bica", label: "Bica" },
  { id: "saibro", label: "Saibro" },
  { id: "rachinha", label: "Rachinha" },
];

export const DESTINO_ORDER: Destino[] = ["pulmao", "base", "subbase"];

export const EMPTY_TRUCK: Omit<TruckEntry, "id" | "date"> = {
  destino: "pulmao",
  material: "bica",
  caminhao: "",
  placa: "",
  notaFiscal: "",
  peso: "",
  chegou: "",
  descarga: "",
  horaPf: "",
  oc: "",
  estaca: "",
  rua: "Canteiro",
};

export function newId(): string {
  return crypto.randomUUID();
}

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isoToDisplay(iso: string, withYear = true): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return withYear ? `${d}/${m}/${y}` : `${d}/${m}`;
}

export function displayToIso(value: string, fallbackYear: number): string | null {
  const cleaned = value.trim();
  const m = cleaned.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
  if (!m) return null;
  const day = m[1].padStart(2, "0");
  const month = m[2].padStart(2, "0");
  let year = m[3] ? Number(m[3]) : fallbackYear;
  if (year < 100) year += 2000;
  return `${year}-${month}-${day}`;
}

export function destinoLabel(destino: Destino): string {
  return DESTINOS.find((d) => d.id === destino)?.label ?? destino;
}

export function materialLabel(material: Material): string {
  return MATERIAIS.find((m) => m.id === material)?.label ?? material;
}

export function normalizeTime(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function parsePeso(peso: string): number {
  const digits = peso.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

export function formatKg(n: number): string {
  return n.toLocaleString("pt-BR");
}


function materialPhrase(material: Material): string {
  if (material === "saibro") return "saibro";
  if (material === "rachinha") return "rachinha";
  return "bica";
}

function destinoTitleSuffix(destino: Destino): string {
  if (destino === "pulmao") return "Pulmão";
  if (destino === "subbase") return "para sub base";
  return "para Base";
}

export function truckTitle(entry: Pick<TruckEntry, "material" | "destino">): string {
  return `Caminhão de ${materialPhrase(entry.material)} ${destinoTitleSuffix(entry.destino)}`;
}

export function formatTruckBlock(entry: TruckEntry): string {
  const lines: string[] = [`*${truckTitle(entry)}*`];
  if (entry.caminhao.trim()) lines.push(entry.caminhao.trim());
  if (entry.placa.trim()) lines.push(`Placa ${entry.placa.trim()}`);
  if (entry.notaFiscal.trim()) lines.push(`NOTA FISCAL ${entry.notaFiscal.trim()}`);
  if (entry.peso.trim()) lines.push(`PESO ${entry.peso.trim().replace(/\s/g, "")}`);
  if (entry.chegou.trim()) lines.push(`CHEGOU - ${entry.chegou.trim()}`);
  if (entry.descarga.trim()) lines.push(`Descarga - ${entry.descarga.trim()}`);
  const location = [entry.estaca.trim() ? `Estaca ${entry.estaca.trim()}` : "", entry.rua.trim()]
    .filter(Boolean)
    .join(" — ");
  if (location) lines.push(location);
  if (entry.horaPf.trim()) lines.push(`HORA PF - ${entry.horaPf.trim()}`);
  if (entry.oc.trim()) lines.push(`OC - ${entry.oc.trim()}`);
  return lines.join("\n");
}

export function reportHeader(dateIso: string, entries: TruckEntry[]): string {
  const materials = [...new Set(entries.map((e) => e.material))];
  const name =
    materials.length === 1
      ? `CAMINHÕES DE ${materialPhrase(materials[0]).toUpperCase()}`
      : materials.length === 0
        ? "CAMINHÕES DE BICA"
        : "CAMINHÕES DE BICA/SAIBRO/RACHINHA";
  return `${name} DIA ${isoToDisplay(dateIso, false)}`;
}

export function formatDayReport(
  dateIso: string,
  entries: TruckEntry[],
  groupByDestino: boolean,
): string {
  const list = groupByDestino
    ? [...entries].sort((a, b) => DESTINO_ORDER.indexOf(a.destino) - DESTINO_ORDER.indexOf(b.destino))
    : entries;
  const blocks = list.map(formatTruckBlock);
  return [reportHeader(dateIso, entries), "", ...blocks.join("\n\n").split("\n")].join("\n").trim() + (blocks.length ? "\n" : "");
}

function normalizeDestino(raw: string): Destino | null {
  const t = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.includes("sub")) return "subbase";
  if (t.includes("pulmao")) return "pulmao";
  if (t.includes("base")) return "base";
  return null;
}


function normalizeMaterial(raw: string): Material {
  const t = raw.toLowerCase();
  if (t.includes("saibro")) return "saibro";
  if (t.includes("rachinha")) return "rachinha";
  return "bica";
}

const FIELD_LINE =
  /^(placa|nota fiscal|peso|chegou|descarga|hora pf|oc|estaca)\b/i;

export function parseDayReport(text: string, fallbackDate: string): {
  date: string;
  entries: Omit<TruckEntry, "id">[];
} {
  const raw = text.replace(/\r\n/g, "\n").trim();
  if (!raw) return { date: fallbackDate, entries: [] };

  const header = raw.match(
    /caminh[oõ]es(?:\s+de\s+([^\n]+?))?\s+dia\s+(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/i,
  );
  const year = Number(fallbackDate.slice(0, 4)) || new Date().getFullYear();
  const date = header?.[2] ? displayToIso(header[2], year) ?? fallbackDate : fallbackDate;

  const chunks = raw.split(/\n(?=\*?\s*Caminh[aã]o\s+de\s+)/i);
  const entries: Omit<TruckEntry, "id">[] = [];

  for (const chunk of chunks) {
    const titleMatch = chunk.match(
      /\*?\s*Caminh[aã]o\s+de\s+(bica|saibro|rachinha)\s+([^*\n]+)\*?/i,
    );
    if (!titleMatch) continue;

    const material = normalizeMaterial(titleMatch[1]);
    const destino = normalizeDestino(titleMatch[2]);
    if (!destino) continue;

    const body = chunk.slice(titleMatch.index! + titleMatch[0].length);
    const lines = body
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l !== "*");

    const entry: Omit<TruckEntry, "id"> = {
      date,
      destino,
      material,
      caminhao: "",
      placa: "",
      notaFiscal: "",
      peso: "",
      chegou: "",
      descarga: "",
      horaPf: "",
      oc: "",
      estaca: "",
      rua: "",
    };

    for (const line of lines) {
      const labeled = line.match(
        /^(placa|nota fiscal|peso|chegou|descarga|hora pf|oc|estaca)\s*[:\-–]?\s*(.*)$/i,
      );
      if (labeled) {
        const key = labeled[1].toLowerCase();
        const val = labeled[2].trim();
        if (key === "placa") entry.placa = val.replace(/\s+/g, "").toUpperCase();
        else if (key === "nota fiscal") entry.notaFiscal = val;
        else if (key === "peso") entry.peso = val.replace(/\s/g, "");
        else if (key === "chegou") entry.chegou = val;
        else if (key === "descarga") entry.descarga = val;
        else if (key === "hora pf") entry.horaPf = val;
        else if (key === "oc") entry.oc = val;
        else if (key === "estaca") entry.estaca = val;
        continue;
      }
      if (!entry.caminhao && !FIELD_LINE.test(line)) {
        entry.caminhao = line.toUpperCase();
        continue;
      }
      if (!entry.rua) {
        entry.rua = line;
      }
    }

    entries.push(entry);
  }

  return { date, entries };
}

export function summarize(entries: TruckEntry[]) {
  const totalKg = entries.reduce((sum, e) => sum + parsePeso(e.peso), 0);
  const byDestino = DESTINO_ORDER.map((id) => ({
    id,
    label: destinoLabel(id),
    count: entries.filter((e) => e.destino === id).length,
    kg: entries.filter((e) => e.destino === id).reduce((s, e) => s + parsePeso(e.peso), 0),
  }));
  return { count: entries.length, totalKg, byDestino };
}

export function knownFleet(entries: TruckEntry[]): { caminhao: string; placa: string }[] {
  const map = new Map<string, string>();
  for (const e of entries) {
    const name = e.caminhao.trim();
    if (!name) continue;
    if (e.placa.trim()) map.set(name, e.placa.trim());
    else if (!map.has(name)) map.set(name, "");
  }
  return [...map.entries()]
    .map(([caminhao, placa]) => ({ caminhao, placa }))
    .sort((a, b) => a.caminhao.localeCompare(b.caminhao, "pt-BR"));
}

export function lastForDestino(
  entries: TruckEntry[],
  destino: Destino,
): Pick<TruckEntry, "oc" | "rua" | "estaca"> | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].destino === destino) {
      return { oc: entries[i].oc, rua: entries[i].rua, estaca: entries[i].estaca };
    }
  }
  return null;
}

export const SAMPLE_DATE = "2026-09-18";

export const SAMPLE_ENTRIES: TruckEntry[] = [
  {
    id: "seed-1",
    date: SAMPLE_DATE,
    destino: "pulmao",
    material: "bica",
    caminhao: "LYC 249",
    placa: "RBJ6F60",
    notaFiscal: "11043",
    peso: "29100",
    chegou: "11:00",
    descarga: "11:07",
    horaPf: "10:07",
    oc: "157.838",
    estaca: "",
    rua: "Canteiro",
  },
  {
    id: "seed-2",
    date: SAMPLE_DATE,
    destino: "pulmao",
    material: "bica",
    caminhao: "LYC 276",
    placa: "SFX7G09",
    notaFiscal: "13835",
    peso: "30270",
    chegou: "10:54",
    descarga: "10:59",
    horaPf: "10:01",
    oc: "157.838",
    estaca: "",
    rua: "Canteiro",
  },
  {
    id: "seed-3",
    date: SAMPLE_DATE,
    destino: "pulmao",
    material: "bica",
    caminhao: "LYC 243",
    placa: "RQN6A52",
    notaFiscal: "11049",
    peso: "30390",
    chegou: "11:28",
    descarga: "11:32",
    horaPf: "10:54",
    oc: "157.838",
    estaca: "",
    rua: "Canteiro",
  },
  {
    id: "seed-4",
    date: SAMPLE_DATE,
    destino: "pulmao",
    material: "bica",
    caminhao: "LYC 276",
    placa: "SFX7G09",
    notaFiscal: "11058",
    peso: "28770",
    chegou: "14:48",
    descarga: "14:53",
    horaPf: "14:07",
    oc: "157.838",
    estaca: "",
    rua: "Canteiro",
  },
  {
    id: "seed-5",
    date: SAMPLE_DATE,
    destino: "pulmao",
    material: "bica",
    caminhao: "LYC 249",
    placa: "RBJ6F60",
    notaFiscal: "11059",
    peso: "28750",
    chegou: "14:48",
    descarga: "14:54",
    horaPf: "14:18",
    oc: "157.838",
    estaca: "",
    rua: "Canteiro",
  },
  {
    id: "seed-6",
    date: SAMPLE_DATE,
    destino: "pulmao",
    material: "bica",
    caminhao: "LYC 243",
    placa: "RQN6A52",
    notaFiscal: "11057",
    peso: "27160",
    chegou: "14:48",
    descarga: "14:53",
    horaPf: "13:58",
    oc: "157.838",
    estaca: "",
    rua: "Canteiro",
  },
  {
    id: "seed-7",
    date: SAMPLE_DATE,
    destino: "subbase",
    material: "bica",
    caminhao: "LYC 247",
    placa: "RQP9D26",
    notaFiscal: "10633",
    peso: "26220",
    chegou: "14:27",
    descarga: "14:44",
    horaPf: "13:48",
    oc: "154.951",
    estaca: "",
    rua: "Rua Visconde de Itaboraí",
  },
  {
    id: "seed-8",
    date: SAMPLE_DATE,
    destino: "subbase",
    material: "bica",
    caminhao: "LYC 243",
    placa: "RQN6A52",
    notaFiscal: "10632",
    peso: "27760",
    chegou: "14:27",
    descarga: "14:49",
    horaPf: "13:35",
    oc: "154.951",
    estaca: "",
    rua: "Rua Visconde de Itaboraí",
  },
];
