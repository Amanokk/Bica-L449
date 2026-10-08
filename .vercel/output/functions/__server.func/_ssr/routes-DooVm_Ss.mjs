import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Plus, c as Copy, d as ChevronLeft, f as Check, i as Printer, l as ClipboardPaste, o as Pencil, r as Trash2, s as MessageCircle, t as X, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, c as Slot, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DooVm_Ss.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DESTINOS = [
	{
		id: "pulmao",
		label: "Pulmão",
		short: "Pulmão"
	},
	{
		id: "base",
		label: "Base",
		short: "Base"
	},
	{
		id: "subbase",
		label: "Sub-base",
		short: "Sub-base"
	}
];
var MATERIAIS = [
	{
		id: "bica",
		label: "Bica"
	},
	{
		id: "saibro",
		label: "Saibro"
	},
	{
		id: "rachinha",
		label: "Rachinha"
	}
];
var DESTINO_ORDER = [
	"pulmao",
	"base",
	"subbase"
];
var EMPTY_TRUCK = {
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
	rua: "Canteiro"
};
function newId() {
	return crypto.randomUUID();
}
function todayISO(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function isoToDisplay(iso, withYear = true) {
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return withYear ? `${d}/${m}/${y}` : `${d}/${m}`;
}
function displayToIso(value, fallbackYear) {
	const m = value.trim().match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
	if (!m) return null;
	const day = m[1].padStart(2, "0");
	const month = m[2].padStart(2, "0");
	let year = m[3] ? Number(m[3]) : fallbackYear;
	if (year < 100) year += 2e3;
	return `${year}-${month}-${day}`;
}
function destinoLabel(destino) {
	return DESTINOS.find((d) => d.id === destino)?.label ?? destino;
}
function materialLabel(material) {
	return MATERIAIS.find((m) => m.id === material)?.label ?? material;
}
function normalizeTime(raw) {
	const digits = raw.replace(/\D/g, "").slice(0, 4);
	if (digits.length <= 2) return digits;
	return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}
function parsePeso(peso) {
	const digits = peso.replace(/[^\d]/g, "");
	if (!digits) return 0;
	return Number(digits);
}
function formatKg(n) {
	return n.toLocaleString("pt-BR");
}
function materialPhrase(material) {
	if (material === "saibro") return "saibro";
	if (material === "rachinha") return "rachinha";
	return "bica";
}
function destinoTitleSuffix(destino) {
	if (destino === "pulmao") return "Pulmão";
	if (destino === "subbase") return "para sub base";
	return "para Base";
}
function truckTitle(entry) {
	return `Caminhão de ${materialPhrase(entry.material)} ${destinoTitleSuffix(entry.destino)}`;
}
function formatTruckBlock(entry) {
	const lines = [`*${truckTitle(entry)}*`];
	if (entry.caminhao.trim()) lines.push(entry.caminhao.trim());
	if (entry.placa.trim()) lines.push(`Placa ${entry.placa.trim()}`);
	if (entry.notaFiscal.trim()) lines.push(`NOTA FISCAL ${entry.notaFiscal.trim()}`);
	if (entry.peso.trim()) lines.push(`PESO ${entry.peso.trim().replace(/\s/g, "")}`);
	if (entry.chegou.trim()) lines.push(`CHEGOU - ${entry.chegou.trim()}`);
	if (entry.descarga.trim()) lines.push(`Descarga - ${entry.descarga.trim()}`);
	const location = [entry.estaca.trim() ? `Estaca ${entry.estaca.trim()}` : "", entry.rua.trim()].filter(Boolean).join(" — ");
	if (location) lines.push(location);
	if (entry.horaPf.trim()) lines.push(`HORA PF - ${entry.horaPf.trim()}`);
	if (entry.oc.trim()) lines.push(`OC - ${entry.oc.trim()}`);
	return lines.join("\n");
}
function reportHeader(dateIso, entries) {
	const materials = [...new Set(entries.map((e) => e.material))];
	return `${materials.length === 1 ? `CAMINHÕES DE ${materialPhrase(materials[0]).toUpperCase()}` : materials.length === 0 ? "CAMINHÕES DE BICA" : "CAMINHÕES DE BICA/SAIBRO/RACHINHA"} DIA ${isoToDisplay(dateIso, false)}`;
}
function formatDayReport(dateIso, entries, groupByDestino) {
	const blocks = (groupByDestino ? [...entries].sort((a, b) => DESTINO_ORDER.indexOf(a.destino) - DESTINO_ORDER.indexOf(b.destino)) : entries).map(formatTruckBlock);
	return [
		reportHeader(dateIso, entries),
		"",
		...blocks.join("\n\n").split("\n")
	].join("\n").trim() + (blocks.length ? "\n" : "");
}
function normalizeDestino(raw) {
	const t = raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
	if (t.includes("sub")) return "subbase";
	if (t.includes("pulmao")) return "pulmao";
	if (t.includes("base")) return "base";
	return null;
}
function normalizeMaterial(raw) {
	const t = raw.toLowerCase();
	if (t.includes("saibro")) return "saibro";
	if (t.includes("rachinha")) return "rachinha";
	return "bica";
}
var FIELD_LINE = /^(placa|nota fiscal|peso|chegou|descarga|hora pf|oc|estaca)\b/i;
function parseDayReport(text, fallbackDate) {
	const raw = text.replace(/\r\n/g, "\n").trim();
	if (!raw) return {
		date: fallbackDate,
		entries: []
	};
	const header = raw.match(/caminh[oõ]es(?:\s+de\s+([^\n]+?))?\s+dia\s+(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/i);
	const year = Number(fallbackDate.slice(0, 4)) || (/* @__PURE__ */ new Date()).getFullYear();
	const date = header?.[2] ? displayToIso(header[2], year) ?? fallbackDate : fallbackDate;
	const chunks = raw.split(/\n(?=\*?\s*Caminh[aã]o\s+de\s+)/i);
	const entries = [];
	for (const chunk of chunks) {
		const titleMatch = chunk.match(/\*?\s*Caminh[aã]o\s+de\s+(bica|saibro|rachinha)\s+([^*\n]+)\*?/i);
		if (!titleMatch) continue;
		const material = normalizeMaterial(titleMatch[1]);
		const destino = normalizeDestino(titleMatch[2]);
		if (!destino) continue;
		const lines = chunk.slice(titleMatch.index + titleMatch[0].length).split("\n").map((l) => l.trim()).filter((l) => l && l !== "*");
		const entry = {
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
			rua: ""
		};
		for (const line of lines) {
			const labeled = line.match(/^(placa|nota fiscal|peso|chegou|descarga|hora pf|oc|estaca)\s*[:\-–]?\s*(.*)$/i);
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
			if (!entry.rua) entry.rua = line;
		}
		entries.push(entry);
	}
	return {
		date,
		entries
	};
}
function summarize(entries) {
	const totalKg = entries.reduce((sum, e) => sum + parsePeso(e.peso), 0);
	const byDestino = DESTINO_ORDER.map((id) => ({
		id,
		label: destinoLabel(id),
		count: entries.filter((e) => e.destino === id).length,
		kg: entries.filter((e) => e.destino === id).reduce((s, e) => s + parsePeso(e.peso), 0)
	}));
	return {
		count: entries.length,
		totalKg,
		byDestino
	};
}
function knownFleet(entries) {
	const map = /* @__PURE__ */ new Map();
	for (const e of entries) {
		const name = e.caminhao.trim();
		if (!name) continue;
		if (e.placa.trim()) map.set(name, e.placa.trim());
		else if (!map.has(name)) map.set(name, "");
	}
	return [...map.entries()].map(([caminhao, placa]) => ({
		caminhao,
		placa
	})).sort((a, b) => a.caminhao.localeCompare(b.caminhao, "pt-BR"));
}
function lastForDestino(entries, destino) {
	for (let i = entries.length - 1; i >= 0; i--) if (entries[i].destino === destino) return {
		oc: entries[i].oc,
		rua: entries[i].rua,
		estaca: entries[i].estaca
	};
	return null;
}
var SAMPLE_DATE = "2026-09-18";
var SAMPLE_ENTRIES = [
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
		rua: "Canteiro"
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
		rua: "Canteiro"
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
		rua: "Canteiro"
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
		rua: "Canteiro"
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
		rua: "Canteiro"
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
		rua: "Canteiro"
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
		rua: "Rua Visconde de Itaboraí"
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
		rua: "Rua Visconde de Itaboraí"
	}
];
var useBicaStore = create()(persist((set, get) => ({
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
		const row = {
			...entry,
			id,
			date: date ?? get().selectedDate
		};
		set((s) => ({ entries: [...s.entries, row] }));
		return id;
	},
	updateEntry: (id, patch) => set((s) => ({ entries: s.entries.map((e) => e.id === id ? {
		...e,
		...patch,
		id: e.id
	} : e) })),
	removeEntry: (id) => {
		const found = get().entries.find((e) => e.id === id);
		set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
		return found;
	},
	restoreEntry: (entry, index) => set((s) => {
		const next = [...s.entries];
		const at = index == null ? next.length : Math.min(Math.max(index, 0), next.length);
		next.splice(at, 0, entry);
		return { entries: next };
	}),
	importEntries: (date, rows, replace) => {
		const mapped = rows.map((row) => ({
			...row,
			id: newId(),
			date: row.date || date
		}));
		set((s) => ({
			selectedDate: date,
			entries: replace ? [...s.entries.filter((e) => e.date !== date), ...mapped] : [...s.entries, ...mapped]
		}));
		return mapped.length;
	},
	openCreate: (preset) => set({
		editorOpen: true,
		editorMode: "create",
		editingId: null,
		createPreset: preset ?? null
	}),
	openEdit: (id) => set({
		editorOpen: true,
		editorMode: "edit",
		editingId: id,
		createPreset: null
	}),
	closeEditor: () => set({
		editorOpen: false,
		editingId: null,
		createPreset: null
	}),
	setPasteOpen: (open) => set({ pasteOpen: open }),
	loadSample: () => set((s) => {
		return {
			selectedDate: SAMPLE_DATE,
			entries: [...s.entries.filter((e) => e.date !== SAMPLE_DATE), ...SAMPLE_ENTRIES.map((e) => ({
				...e,
				id: newId()
			}))]
		};
	})
}), {
	name: "diario-de-bica-v1",
	skipHydration: true,
	partialize: (s) => ({
		selectedDate: s.selectedDate,
		groupByDestino: s.groupByDestino,
		entries: s.entries
	})
}));
function useDayEntries() {
	const selectedDate = useBicaStore((s) => s.selectedDate);
	const entries = useBicaStore((s) => s.entries);
	return (0, import_react.useMemo)(() => entries.filter((e) => e.date === selectedDate), [entries, selectedDate]);
}
function shiftDate(iso, days) {
	const [y, m, d] = iso.split("-").map(Number);
	const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
	dt.setDate(dt.getDate() + days);
	return todayISO(dt);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-moss text-moss-fg hover:bg-moss-2",
			outline: "border border-rule bg-sheet text-ink hover:bg-sheet-2",
			ghost: "text-ink hover:bg-sheet-2",
			secondary: "bg-sheet-2 text-ink hover:bg-paper-2",
			danger: "bg-danger text-danger-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-sm border border-rule bg-sheet px-3 text-sm text-ink shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { tone: {
		pulmao: "bg-pulmao-bg text-pulmao",
		base: "bg-base-bg text-base-dest",
		subbase: "bg-subbase-bg text-subbase",
		mute: "bg-sheet-2 text-muted"
	} },
	defaultVariants: { tone: "mute" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function destTone(d) {
	return d;
}
function Cell({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium tracking-wide text-faint uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "truncate text-sm text-ink",
			children: children || "—"
		})]
	});
}
function TruckCard({ entry }) {
	const openEdit = useBicaStore((s) => s.openEdit);
	const removeEntry = useBicaStore((s) => s.removeEntry);
	const restoreEntry = useBicaStore((s) => s.restoreEntry);
	function remove() {
		const removed = removeEntry(entry.id);
		if (!removed) return;
		toast("Caminhão removido", { action: {
			label: "Desfazer",
			onClick: () => restoreEntry(removed)
		} });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-rule bg-sheet p-4 shadow-sheet",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: destTone(entry.destino),
							children: destinoLabel(entry.destino)
						}),
						entry.material !== "bica" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: materialLabel(entry.material) }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-semibold tracking-tight",
							children: entry.caminhao || "Sem código"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-sm text-muted",
					children: entry.placa || "sem placa"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Editar",
					onClick: () => openEdit(entry.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Excluir",
					onClick: remove,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "Nota fiscal",
					children: entry.notaFiscal
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "Peso",
					children: entry.peso ? `${formatKg(parsePeso(entry.peso))} kg` : ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "Chegou",
					children: entry.chegou
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "Descarga",
					children: entry.descarga
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "Hora PF",
					children: entry.horaPf
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "OC",
					children: entry.oc
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "Estaca",
					children: entry.estaca
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					label: "Rua",
					children: entry.rua
				})
			]
		})]
	});
}
function Planilha() {
	const entries = useDayEntries();
	const selectedDate = useBicaStore((s) => s.selectedDate);
	const openCreate = useBicaStore((s) => s.openCreate);
	const openEdit = useBicaStore((s) => s.openEdit);
	const removeEntry = useBicaStore((s) => s.removeEntry);
	const restoreEntry = useBicaStore((s) => s.restoreEntry);
	function remove(entry) {
		const removed = removeEntry(entry.id);
		if (!removed) return;
		toast("Caminhão removido", { action: {
			label: "Desfazer",
			onClick: () => restoreEntry(removed)
		} });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-3 no-print",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Planilha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Caminhões e carretas de bica, saibro e rachinha"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => openCreate(),
					className: "hidden sm:inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Novo caminhão"]
				})]
			}),
			entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-rule-strong bg-sheet px-6 py-16 text-center no-print",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl font-semibold",
						children: "Nenhum caminhão neste dia"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-sm text-sm text-pretty text-muted",
						children: "Lance um caminhão ou cole o texto do WhatsApp para montar a planilha automaticamente."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-5",
						onClick: () => openCreate(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Lançar primeiro caminhão"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3 lg:hidden no-print",
				children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TruckCard, { entry }, entry.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden min-h-0 overflow-auto rounded-lg border border-rule bg-sheet shadow-sheet lg:block no-print",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[980px] border-collapse text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-sheet-2 text-xs tracking-wide text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
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
							""
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "border-b border-rule px-3 py-2.5 font-medium",
							children: h
						}, h || "actions")) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer border-b border-rule last:border-b-0 hover:bg-paper/70",
						onClick: () => openEdit(entry.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: destTone(entry.destino),
									children: destinoLabel(entry.destino)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 font-medium",
								children: entry.caminhao || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 font-mono text-xs",
								children: entry.placa || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 tabular-nums",
								children: entry.notaFiscal || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 tabular-nums",
								children: entry.peso ? formatKg(parsePeso(entry.peso)) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 tabular-nums",
								children: entry.chegou || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 tabular-nums",
								children: entry.descarga || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 tabular-nums",
								children: entry.horaPf || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 tabular-nums",
								children: entry.oc || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5",
								children: entry.estaca || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-48 truncate px-3 py-2.5",
								children: entry.rua || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-1.5 text-right no-print",
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									"aria-label": "Excluir",
									onClick: () => remove(entry),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})
							})
						]
					}, entry.id)) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "print-only p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mb-1 text-center text-lg font-bold",
						children: "Caminhões/Carretas de Bica/Saibro/Rachinha"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 text-right text-sm",
						children: ["Data: ", isoToDisplay(selectedDate)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Bica para",
							"Caminhão",
							"Placa",
							"Nota Fiscal",
							"PESO",
							"Chegou",
							"Descarga",
							"Hora PF",
							"OC",
							"Estaca",
							"Rua"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "border border-ink px-1 py-1",
							children: h
						}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (entries.length ? entries : Array.from({ length: 18 }, () => null)).map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry ? destinoLabel(entry.destino) : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.caminhao ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.placa ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.notaFiscal ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.peso ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.chegou ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.descarga ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.horaPf ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.oc ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.estaca ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-ink px-1 py-1",
								children: entry?.rua ?? ""
							})
						] }, entry?.id ?? i)) })]
					})
				]
			})
		]
	});
}
async function copyText(text) {
	await navigator.clipboard.writeText(text);
}
function Relatorio() {
	const entries = useDayEntries();
	const selectedDate = useBicaStore((s) => s.selectedDate);
	const groupByDestino = useBicaStore((s) => s.groupByDestino);
	const setGroupByDestino = useBicaStore((s) => s.setGroupByDestino);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const report = (0, import_react.useMemo)(() => formatDayReport(selectedDate, entries, groupByDestino), [
		selectedDate,
		entries,
		groupByDestino
	]);
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
	async function copyOne(id) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-h-0 flex-col rounded-xl border border-rule bg-sheet shadow-sheet no-print",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3 border-b border-rule px-4 py-3 sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Texto do dia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Pronto para colar no grupo"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-moss",
						checked: groupByDestino,
						onChange: (e) => setGroupByDestino(e.target.checked)
					}), "Agrupar por destino"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "min-h-48 flex-1 overflow-auto whitespace-pre-wrap px-4 py-4 font-mono text-xs leading-relaxed text-ink sm:px-5",
				children: entries.length ? report : "Lance caminhões na planilha para gerar o texto."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 border-t border-rule p-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: copyAll,
					disabled: !entries.length,
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Copiado" : "Copiar texto"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "outline",
					onClick: sendWhatsApp,
					disabled: !entries.length,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {}), "WhatsApp"]
				})]
			}),
			entries.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print border-t border-rule px-4 py-3 sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-faint uppercase",
					children: "Copiar um caminhão"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-1",
					children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm hover:bg-sheet-2",
						onClick: () => copyOne(entry.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [
								entry.caminhao || "Sem código",
								" · NF ",
								entry.notaFiscal || "—"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 shrink-0 text-faint" })]
					}) }, entry.id))
				})]
			}) : null
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-ink/50", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-xl border border-rule bg-sheet shadow-sheet sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[90vh] sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-3 right-3 rounded-sm p-2 text-muted hover:bg-sheet-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Fechar"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("border-b border-rule px-5 py-4 pr-12", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 border-t border-rule p-4 sm:flex-row sm:justify-end", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-2xl font-semibold tracking-tight text-ink", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("mt-1 text-sm text-muted", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-xs font-medium tracking-wide text-muted", className),
	...props
}));
Label.displayName = "Label";
var NativeSelect = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		ref,
		className: cn("native-select flex h-11 w-full appearance-none rounded-sm border border-rule bg-sheet px-3 pr-9 text-sm text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50", className),
		...props,
		children
	});
});
NativeSelect.displayName = "NativeSelect";
function Field({ id, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), children]
	});
}
function TruckForm() {
	const editorOpen = useBicaStore((s) => s.editorOpen);
	const editorMode = useBicaStore((s) => s.editorMode);
	const editingId = useBicaStore((s) => s.editingId);
	const createPreset = useBicaStore((s) => s.createPreset);
	const closeEditor = useBicaStore((s) => s.closeEditor);
	const addEntry = useBicaStore((s) => s.addEntry);
	const updateEntry = useBicaStore((s) => s.updateEntry);
	const allEntries = useBicaStore((s) => s.entries);
	editorMode === "edit" && allEntries.find((e) => e.id === editingId);
	const [form, setForm] = (0, import_react.useState)(EMPTY_TRUCK);
	(0, import_react.useEffect)(() => {
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
		const destino = createPreset?.destino ?? last?.destino ?? "pulmao";
		const hint = lastForDestino(dayEntries, destino);
		setForm({
			...EMPTY_TRUCK,
			destino,
			material: createPreset?.material ?? last?.material ?? "bica",
			oc: createPreset?.oc ?? hint?.oc ?? last?.oc ?? "",
			rua: createPreset?.rua ?? hint?.rua ?? last?.rua ?? "Canteiro",
			estaca: createPreset?.estaca ?? hint?.estaca ?? "",
			caminhao: createPreset?.caminhao ?? "",
			placa: createPreset?.placa ?? ""
		});
	}, [
		editorOpen,
		editorMode,
		editingId,
		createPreset
	]);
	const fleet = (0, import_react.useMemo)(() => knownFleet(allEntries), [allEntries]);
	function patch(key, value) {
		setForm((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function onCaminhao(value) {
		const upper = value.toUpperCase();
		const known = fleet.find((f) => f.caminhao.toUpperCase() === upper);
		setForm((prev) => ({
			...prev,
			caminhao: upper,
			placa: known?.placa && !prev.placa ? known.placa : prev.placa
		}));
	}
	function onDestino(destino) {
		const state = useBicaStore.getState();
		const hint = lastForDestino(state.entries.filter((e) => e.date === state.selectedDate), destino);
		setForm((prev) => ({
			...prev,
			destino,
			oc: prev.oc || hint?.oc || "",
			rua: prev.rua || hint?.rua || "Canteiro",
			estaca: prev.estaca || hint?.estaca || ""
		}));
	}
	function persist(andAnother) {
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
				estaca: prev.estaca
			}));
			return;
		}
		closeEditor();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: editorOpen,
		onOpenChange: (open) => !open && closeEditor(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editorMode === "edit" ? "Editar caminhão" : "Novo caminhão" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: editorMode === "edit" ? "Ajuste os dados deste lançamento." : "Lançamento na planilha do dia. Depois o texto do WhatsApp sai pronto." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid grid-cols-1 gap-3 overflow-y-auto px-5 py-4 sm:grid-cols-2",
			onSubmit: (e) => {
				e.preventDefault();
				persist(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "destino",
					label: "Bica para",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						id: "destino",
						value: form.destino,
						onChange: (e) => onDestino(e.target.value),
						children: DESTINOS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.label
						}, d.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "material",
					label: "Material",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						id: "material",
						value: form.material,
						onChange: (e) => patch("material", e.target.value),
						children: MATERIAIS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m.id,
							children: m.label
						}, m.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					id: "caminhao",
					label: "Caminhão",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "caminhao",
						list: "fleet-names",
						autoComplete: "off",
						placeholder: "LYC 249",
						value: form.caminhao,
						onChange: (e) => onCaminhao(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
						id: "fleet-names",
						children: fleet.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: f.caminhao }, f.caminhao))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "placa",
					label: "Placa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "placa",
						autoComplete: "off",
						placeholder: "RBJ6F60",
						value: form.placa,
						onChange: (e) => patch("placa", e.target.value.toUpperCase().replace(/\s+/g, ""))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "nf",
					label: "Nota fiscal",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "nf",
						inputMode: "numeric",
						placeholder: "11043",
						value: form.notaFiscal,
						onChange: (e) => patch("notaFiscal", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "peso",
					label: "Peso (kg)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "peso",
						inputMode: "numeric",
						placeholder: "29100",
						value: form.peso,
						onChange: (e) => patch("peso", e.target.value.replace(/[^\d]/g, ""))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "chegou",
					label: "Chegou",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "chegou",
						inputMode: "numeric",
						placeholder: "14:48",
						value: form.chegou,
						onChange: (e) => patch("chegou", normalizeTime(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "descarga",
					label: "Descarga",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "descarga",
						inputMode: "numeric",
						placeholder: "14:53",
						value: form.descarga,
						onChange: (e) => patch("descarga", normalizeTime(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "horaPf",
					label: "Hora PF",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "horaPf",
						inputMode: "numeric",
						placeholder: "14:07",
						value: form.horaPf,
						onChange: (e) => patch("horaPf", normalizeTime(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "oc",
					label: "OC",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "oc",
						placeholder: "157.838",
						value: form.oc,
						onChange: (e) => patch("oc", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "estaca",
					label: "Estaca",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "estaca",
						placeholder: "—",
						value: form.estaca,
						onChange: (e) => patch("estaca", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					id: "rua",
					label: "Rua / local",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "rua",
						list: "rua-options",
						placeholder: "Canteiro",
						value: form.rua,
						onChange: (e) => patch("rua", e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("datalist", {
						id: "rua-options",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Canteiro" }), [...new Set(allEntries.map((e) => e.rua).filter(Boolean))].filter((r) => r !== "Canteiro").slice(0, 12).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: r }, r))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "col-span-full -mx-5 -mb-4 mt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: closeEditor,
							children: "Cancelar"
						}),
						editorMode === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => persist(true),
							children: "Salvar e outro"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: editorMode === "edit" ? "Salvar" : "Lançar na planilha"
						})
					]
				})
			]
		})] })
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-32 w-full rounded-md border border-rule bg-sheet px-3 py-3 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function PasteDialog() {
	const open = useBicaStore((s) => s.pasteOpen);
	const setPasteOpen = useBicaStore((s) => s.setPasteOpen);
	const selectedDate = useBicaStore((s) => s.selectedDate);
	const importEntries = useBicaStore((s) => s.importEntries);
	const [text, setText] = (0, import_react.useState)("");
	const [replace, setReplace] = (0, import_react.useState)(false);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setPasteOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Colar texto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Cole o recado do dia (CAMINHÕES DE BICA DIA …) e a planilha se preenche sozinha." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "CAMINHÕES DE BICA DIA 18/09\n\n*Caminhão de bica Pulmão*\nLYC 249\nPlaca RBJ6F60\n...",
					className: "min-h-56 font-mono text-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-moss",
						checked: replace,
						onChange: (e) => setReplace(e.target.checked)
					}), "Substituir os caminhões deste dia"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setPasteOpen(false),
				children: "Cancelar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				children: "Lançar na planilha"
			})] })
		] })
	});
}
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
	const [tab, setTab] = (0, import_react.useState)("planilha");
	(0, import_react.useEffect)(() => {
		const persistApi = useBicaStore.persist;
		const unsub = persistApi.onFinishHydration(() => {
			markHydrated();
		});
		persistApi.rehydrate();
		if (persistApi.hasHydrated()) markHydrated();
		return unsub;
	}, [markHydrated]);
	const stats = (0, import_react.useMemo)(() => summarize(dayEntries), [dayEntries]);
	const daysWithData = (0, import_react.useMemo)(() => {
		const set = new Set(entriesAll.map((e) => e.date));
		set.add(selectedDate);
		return [...set].sort();
	}, [entriesAll, selectedDate]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-7xl flex-col gap-4 px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 rounded-lg bg-sheet-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 rounded-lg bg-sheet-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-96 rounded-xl bg-sheet-2" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper pb-24 lg:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-rule bg-moss text-moss-fg no-print",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.18em] text-moss-fg/70 uppercase",
							children: "Obra · descarga"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-semibold tracking-tight sm:text-5xl",
							children: "Diário de Bica"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xl text-sm text-moss-fg/80",
							children: "Planilha de caminhões e carretas — e o texto do dia, no formato do grupo."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => setPasteOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, {}), "Colar texto"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => window.print(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Imprimir"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-3 rounded-xl border border-rule bg-sheet p-3 shadow-sheet sm:flex-row sm:items-center sm:justify-between sm:p-4 no-print",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									"aria-label": "Dia anterior",
									onClick: () => setDate(shiftDate(selectedDate, -1)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									"aria-label": "Data da planilha",
									className: "w-auto min-w-40",
									value: selectedDate,
									onChange: (e) => setDate(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									"aria-label": "Próximo dia",
									onClick: () => setDate(shiftDate(selectedDate, 1)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setDate(todayISO()),
									children: "Hoje"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: daysWithData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDate(d),
								className: cn("rounded-full px-3 py-1.5 text-xs font-medium", d === selectedDate ? "bg-moss text-moss-fg" : "bg-sheet-2 text-muted hover:bg-paper-2"),
								children: isoToDisplay(d, false)
							}, d))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-4 no-print",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Caminhões",
								value: String(stats.count)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Peso total",
								value: `${formatKg(stats.totalKg)} kg`
							}),
							stats.byDestino.filter((d) => d.count > 0).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: d.label,
								value: `${d.count} · ${formatKg(d.kg)} kg`
							}, d.id))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 rounded-lg bg-sheet-2 p-1 lg:hidden no-print",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
							active: tab === "planilha",
							onClick: () => setTab("planilha"),
							children: "Planilha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
							active: tab === "texto",
							onClick: () => setTab("texto"),
							children: "Texto"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.9fr)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn(tab === "planilha" ? "block" : "hidden", "lg:block"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Planilha, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn(tab === "texto" ? "block" : "hidden", "lg:block lg:sticky lg:top-4"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Relatorio, {})
						})]
					}),
					selectedDate !== "2026-09-18" && !entriesAll.some((e) => e.date === "2026-09-18") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted no-print",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "underline decoration-rule underline-offset-4",
							onClick: loadSample,
							children: "Carregar o exemplo do dia 18/09"
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-sheet p-3 lg:hidden no-print",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "h-12 w-full",
					onClick: () => openCreate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Novo caminhão"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TruckForm, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasteDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "bottom-center",
				richColors: true,
				closeButton: true
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-rule bg-sheet px-4 py-3 shadow-sheet",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium tracking-wide text-faint uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight",
			children: value
		})]
	});
}
function TabButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-10 flex-1 rounded-md text-sm font-medium", active ? "bg-sheet text-ink shadow-sheet" : "text-muted"),
		children
	});
}
//#endregion
export { Home as component };
