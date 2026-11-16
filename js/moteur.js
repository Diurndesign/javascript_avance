"use strict";
/* =====================================================================
   BIP AGENCE · moteur du jeu
   ===================================================================== */
const TEACHER_CODE = "itecom";        // code formateur (Carnet › Options)
const MAX_STEPS = 600;
const TYPES = {
  observe: { label: "Observer", verb: "Observe et réponds" },
  predict: { label: "Prédire", verb: "Devine avant de lancer" },
  fill: { label: "Compléter", verb: "Remplis les cases vides" },
  fix: { label: "Réparer", verb: "Trouve et corrige les bugs" },
  write: { label: "Coder", verb: "Écris le code" },
  real: { label: "Mission client", verb: "Livre la commande du client" },
  path: { label: "Chemin", verb: "Trace le chemin vers la donnée" }
};
const chLabel = n => { const c = CHAPTERS.find(x => x.n === n); if (!c) return ""; if (c.formation) return "Formation"; return "Client " + (CHAPTERS.filter(x => !x.formation).indexOf(c) + 1); };

/* ---------- sauvegarde ---------- */
const KEY = "bip-agence-v1";
let store = { progress: {}, drafts: {}, teacher: false };
try { const raw = localStorage.getItem(KEY); if (raw) store = Object.assign(store, JSON.parse(raw)); } catch (e) { /* jeu sans sauvegarde */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* rien */ } }

let current = null, session = null, liveRun = null, silent = false;
const silentErrors = [];

/* =====================================================================
   OUTILS
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
const md = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
const levelIndex = id => LEVELS.findIndex(l => l.id === id);
const isDone = id => !!store.progress[id];
const isUnlocked = i => store.teacher || i === 0 || isDone(LEVELS[i - 1].id) || isDone(LEVELS[i].id);
const chapterDone = n => LEVELS.filter(l => l.ch === n).every(l => isDone(l.id));
const totalStars = () => Object.values(store.progress).reduce((s, p) => s + (p.stars || 0), 0);
const nextLevel = () => LEVELS.find((l, i) => !isDone(l.id) && isUnlocked(i)) || null;
const starsHTML = n => "★".repeat(n) + `<span class="off">${"★".repeat(3 - n)}</span>`;
const isCodeType = L => ["fill", "fix", "write", "real"].includes(L.type);

/* --- outils des objectifs (utilisés dans levels.js) --- */
const norm = s => String(s).replace(/\s+/g, " ").trim();
const logTexts = r => r ? r.logs.map(l => norm(l.text)) : [];
const hasText = (r, s) => logTexts(r).includes(norm(s));
const hasArg = (r, pred) => !!r && r.logs.some(l => l.args.some(a => { try { return pred(a); } catch (e) { return false; } }));
const V = (r, name) => (r && r.vars ? r.vars[name] : undefined);
const near = (a, b) => typeof a === "number" && Math.abs(a - b) < 1e-9;
const txt = (stage, sel) => { const el = stage && stage.querySelector(sel); return el ? norm(el.textContent) : null; };
function allRuns(c, fn) { for (const r of c.runs) { const res = fn(r, r.scenario || {}); if (res !== true) return res || false; } return true; }
function freshRun(c) { const st = document.createElement("div"); st.innerHTML = c.L.stage || ""; return execute(c.L, c.code, c.L.scenarios ? c.L.scenarios[0] : null, st, {}); }
function submitForm(stage, sel) { const f = stage.querySelector(sel); const ev = new Event("submit", { bubbles: true, cancelable: true }); if (f) f.dispatchEvent(ev); return ev; }
function typeIn(stage, sel, value, evt) { const el = stage.querySelector(sel); if (!el) return; el.value = value; if (evt) el.dispatchEvent(new Event(evt, { bubbles: true })); }

/* ---------- coloration ---------- */
const KW = new Set(["let", "const", "var", "function", "return", "if", "else", "true", "false", "null", "undefined", "new", "typeof", "of", "in"]);
function bracketInfo(src) {
  const info = new Map(), stack = [];
  const re = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\.)*`?)|([{}()\[\]])/g; let m;
  const pairs = { "}": "{", ")": "(", "]": "[" };
  while ((m = re.exec(src))) {
    if (!m[3]) continue;
    const c = m[3], i = m.index;
    if ("{([".includes(c)) { info.set(i, { d: stack.length, bad: true }); stack.push({ c, i }); }
    else {
      const top = stack[stack.length - 1];
      if (top && top.c === pairs[c]) { stack.pop(); const o = info.get(top.i); o.bad = false; o.partner = i; info.set(i, { d: stack.length, partner: top.i }); }
      else info.set(i, { d: 0, bad: true });
    }
  }
  return info;
}
function highlight(src, match) {
  const br = bracketInfo(src);
  const re = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\.)*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$À-ÿŒœ][\w$À-ÿŒœ]*)|(=>|===|!==|>=|<=|&&|\|\||[=+\-*/%<>!])|([{}()\[\]])/g;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const t = m[0]; let cls = "o";
    if (m[6]) { const b = br.get(m.index) || { d: 0 }; cls = b.bad ? "bad" : "b" + (b.d % 4); if (match && match.has(m.index)) cls += " bm"; out += `<span class="t-${cls}">${esc(t)}</span>`; last = re.lastIndex; continue; }
    if (m[1]) cls = "c"; else if (m[2]) cls = "s"; else if (m[3]) cls = "n";
    else if (m[4]) { if (KW.has(t)) cls = "k"; else { const prev = src[m.index - 1]; const call = /^\s*\(/.test(src.slice(re.lastIndex)); cls = prev === "." ? (call ? "m" : "p") : (call ? "f" : "v"); } }
    out += `<span class="t-${cls}">${esc(t)}</span>`;
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}

/* ---------- valeurs ---------- */
class ElSnap { constructor(label) { this.label = label; } }
const isEl = v => typeof Node !== "undefined" && v instanceof Node;
function elLabel(v) {
  if (v.nodeType !== 1) return "#texte";
  const cls = typeof v.className === "string" && v.className.trim() ? " class=\"" + v.className.trim() + "\"" : "";
  const id = v.id ? " id=\"" + v.id + "\"" : "";
  return "<" + v.tagName.toLowerCase() + id + cls + ">";
}
function viewClone(v, d = 0) {
  if (v === null || typeof v !== "object") return v;
  if (v instanceof ElSnap) return v;
  if (isEl(v)) return new ElSnap(elLabel(v));
  if (typeof Event !== "undefined" && v instanceof Event) return new ElSnap("Event " + v.type);
  if (d > 4) return new ElSnap("…");
  if (Array.isArray(v)) return v.map(x => viewClone(x, d + 1));
  const proto = Object.getPrototypeOf(v);
  if (proto === Object.prototype || proto === null) { const o = {}; for (const k of Object.keys(v)) o[k] = viewClone(v[k], d + 1); return o; }
  return new ElSnap(Object.prototype.toString.call(v).slice(8, -1));
}
function fmt(v, top, d = 0) {
  if (typeof v === "string") return top ? v : JSON.stringify(v);
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "function") return "ƒ " + (v.name || "anonyme") + "()";
  if (v instanceof ElSnap) return v.label;
  if (isEl(v)) return elLabel(v);
  if (typeof Event !== "undefined" && v instanceof Event) return "Event " + v.type;
  if (Array.isArray(v)) return d > 2 ? "[…]" : "[" + v.map(x => fmt(x, false, d + 1)).join(", ") + "]";
  if (typeof v === "object") { if (d > 2) return "{…}"; const e = Object.entries(v); return e.length ? "{ " + e.map(([k, x]) => k + ": " + fmt(x, false, d + 1)).join(", ") + " }" : "{}"; }
  return String(v);
}
function fmtHTML(v, top, d = 0) {
  const s = (c, t) => `<span class="${c}">${esc(t)}</span>`;
  if (typeof v === "string") return s("v-str", top ? v : JSON.stringify(v));
  if (v === null || v === undefined) return s("v-null", String(v));
  if (typeof v === "number") return s("v-num", String(v));
  if (typeof v === "boolean") return s("v-bool", String(v));
  if (typeof v === "function") return s("v-fn", "ƒ " + (v.name || "anonyme") + "()");
  if (v instanceof ElSnap || isEl(v) || (typeof Event !== "undefined" && v instanceof Event)) return s("v-el", fmt(v, false));
  if (Array.isArray(v)) return d > 2 ? s("v-punc", "[…]") : s("v-punc", "[") + v.map(x => fmtHTML(x, false, d + 1)).join(s("v-punc", ", ")) + s("v-punc", "]");
  if (typeof v === "object") { if (d > 2) return s("v-punc", "{…}"); const e = Object.entries(v); return e.length ? s("v-punc", "{ ") + e.map(([k, x]) => esc(k) + s("v-punc", ": ") + fmtHTML(x, false, d + 1)).join(s("v-punc", ", ")) + s("v-punc", " }") : s("v-punc", "{}"); }
  return esc(String(v));
}
function typeInfo(v) {
  if (typeof v === "string") return ["string · texte", "var(--t-str)"];
  if (typeof v === "number") return [Number.isNaN(v) ? "number · NaN" : "number · nombre", "var(--t-num)"];
  if (typeof v === "boolean") return ["boolean · vrai/faux", "var(--t-bool)"];
  if (typeof v === "function") return ["function · fonction", "var(--t-fn)"];
  if (v === null) return ["null · rien", "var(--t-null)"];
  const label = v instanceof ElSnap ? v.label : null;
  if (isEl(v) || (label && label.startsWith("<"))) return ["élément HTML", "var(--t-el)"];
  if ((label && label.startsWith("Event")) || (typeof Event !== "undefined" && v instanceof Event)) return ["event · événement", "var(--t-el)"];
  if (Array.isArray(v)) return ["array · tableau", "var(--t-arr)"];
  return ["object · objet", "var(--t-obj)"];
}
function snapArgs(v) { return v && typeof v === "object" ? viewClone(v) : v; }

/* =====================================================================
   PAS À PAS : instrumentation du code avec acorn
   ===================================================================== */
const RESERVED = new Set(["console", "document", "alert", "__s", "__t", "__g", "__end", "window"]);
const NA = { na: true };
class LoopError extends Error { constructor() { super("Boucle infinie : le code tourne sans s’arrêter"); this.name = "LoopError"; } }
class StopTrace extends Error { constructor() { super("trop d’étapes"); this.name = "StopTrace"; } }
const LOOP = { n: 0, pending: false };
function guard() {
  if (!LOOP.pending) { LOOP.pending = true; setTimeout(() => { LOOP.n = 0; LOOP.pending = false; }, 0); }
  if (++LOOP.n > 400000) throw new LoopError();
}
const short = s => { s = s.replace(/\s+/g, " ").trim(); return s.length > 48 ? s.slice(0, 46) + "…" : s; };

function describe(n, src) {
  const s = x => src.slice(x.start, x.end);
  if (n.type === "VariableDeclaration") {
    const d = n.declarations[0]; const nm = d.id.type === "Identifier" ? d.id.name : s(d.id);
    if (!d.init) return "On crée la variable `" + nm + "`, encore vide (undefined).";
    const init = d.init;
    if (/Function/.test(init.type)) return "On crée la fonction `" + nm + "` (fléchée). Elle est rangée, mais ne s’exécute pas encore.";
    if (init.type === "CallExpression") {
      const c = s(init.callee);
      if (/querySelector/.test(c)) return "On cherche " + short(init.arguments[0] ? s(init.arguments[0]) : "un élément") + " dans la page ; l’élément trouvé est rangé dans `" + nm + "`.";
      if (/createElement$/.test(c)) return "On fabrique un élément " + short(init.arguments[0] ? s(init.arguments[0]) : "") + " (pas encore sur la page), rangé dans `" + nm + "`.";
      if (/\.filter$/.test(c)) return "`filter` fabrique un nouveau tableau avec les éléments qui passent le test ; il est rangé dans `" + nm + "`.";
      return "On appelle `" + short(c) + "(…)`. Ce qu’elle renvoie sera rangé dans `" + nm + "`.";
    }
    return "On crée " + n.kind + " `" + nm + "` et on y range `" + short(s(init)) + "`.";
  }
  if (n.type === "FunctionDeclaration") return "Déclaration de la fonction `" + n.id.name + "` : elle est rangée en mémoire. Rien ne s’exécute tant qu’on ne l’appelle pas.";
  if (n.type === "ReturnStatement") return n.argument ? "`return` : la fonction renvoie `" + short(s(n.argument)) + "` et s’arrête. JavaScript revient à l’endroit de l’appel." : "`return` : la fonction s’arrête.";
  if (/^(For|While|DoWhile)/.test(n.type)) return "Début d’une boucle.";
  if (n.type === "ExpressionStatement") {
    const e = n.expression;
    if (e.type === "AssignmentExpression") return "`" + short(s(e.left)) + "` reçoit une nouvelle valeur : `" + short(s(e.right)) + "`.";
    if (e.type === "UpdateExpression") return "`" + s(e.argument) + "` " + (e.operator === "++" ? "augmente" : "diminue") + " de 1.";
    if (e.type === "CallExpression") {
      const c = s(e.callee);
      if (c === "console.log") return "Affichage dans la console de `" + short(e.arguments.map(s).join(", ")) + "`.";
      if (/\.push$/.test(c)) return "On ajoute un élément à la fin de `" + c.replace(/\.push$/, "") + "`.";
      if (/\.forEach$/.test(c)) return "Boucle : la fonction va être lancée une fois pour chaque élément de `" + c.replace(/\.forEach$/, "") + "`.";
      if (/\.addEventListener$/.test(c)) return "On branche un écouteur d’événement " + (e.arguments[0] ? s(e.arguments[0]) : "") + ". La fonction ne s’exécute **pas maintenant** : elle attend l’événement.";
      if (/\.preventDefault$/.test(c)) return "On empêche le navigateur de faire son action par défaut (ici : recharger la page).";
      if (/classList\.add$/.test(c)) return "On ajoute une classe à l’élément : le CSS va changer son apparence.";
      if (/classList\.remove$/.test(c)) return "On retire une classe à l’élément.";
      if (/classList\.toggle$/.test(c)) return "Interrupteur : on ajoute la classe si elle est absente, on l’enlève si elle est là.";
      if (/\.appendChild$/.test(c)) return "On accroche l’élément dans la page : à partir de maintenant, il est visible.";
      return "Appel de `" + short(c) + "(…)`.";
    }
  }
  return "";
}
function instrument(code) {
  if (!window.acorn) return null;
  let ast;
  try { ast = window.acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", locations: true }); } catch (e) { return null; }
  const names = new Set(), stmts = [], ifs = [];
  const walk = (node, parent, key) => {
    if (!node || typeof node.type !== "string") return;
    if (node.type === "VariableDeclarator" && node.id.type === "Identifier") names.add(node.id.name);
    if (node.type === "FunctionDeclaration" && node.id) names.add(node.id.name);
    if (/Function/.test(node.type)) node.params.forEach(p => { if (p.type === "Identifier") names.add(p.name); });
    if (parent && (parent.type === "Program" || parent.type === "BlockStatement") && key === "body" && node.type !== "IfStatement" && node.type !== "EmptyStatement") stmts.push(node);
    if (node.type === "IfStatement") ifs.push(node);
    for (const k of Object.keys(node)) {
      if (k === "loc") continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach(c => walk(c, node, k));
      else if (v && typeof v.type === "string") walk(v, node, k);
    }
  };
  walk(ast, null, null);
  return { names: [...names].filter(n => !RESERVED.has(n)), stmts, ifs };
}
function declaredNames(src) {
  const clean = src.replace(/\/\/[^\n]*/g, "").replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, "\"\"");
  const out = []; const re = /\b(?:let|const|var|function)\s+([A-Za-z_$][\w$]*)/g; let m;
  while ((m = re.exec(clean))) if (!out.includes(m[1]) && !RESERVED.has(m[1])) out.push(m[1]);
  return out;
}
function makeDoc(stage) {
  return {
    querySelector: s => stage.querySelector(s),
    querySelectorAll: s => stage.querySelectorAll(s),
    getElementById: id => stage.querySelector("#" + CSS.escape(id)),
    createElement: t => document.createElement(t),
    createTextNode: t => document.createTextNode(t),
    body: stage
  };
}
function cleanVars(raw, snap) {
  const out = {};
  for (const k of Object.keys(raw || {})) {
    const v = raw[k];
    if (v === NA || v === undefined) continue;
    if (k in window && v === window[k]) continue;
    out[k] = snap ? viewClone(v) : v;
  }
  return out;
}

function pageSnap(stage) {
  const clone = stage.cloneNode(true);
  const src = stage.querySelectorAll("input, textarea"), dst = clone.querySelectorAll("input, textarea");
  src.forEach((el, k) => { if (el.tagName === "TEXTAREA") dst[k].textContent = el.value; else dst[k].setAttribute("value", el.value); });
  return clone.innerHTML;
}
/* exécute le code d’une mission. opt : { live, trace, simulate } */
function execute(L, code, scen, stage, opt) {
  opt = opt || {};
  const logs = [];
  const add = kind => (...args) => {
    const entry = { kind, args: args.map(snapArgs), text: args.map(a => fmt(a, true)).join(" "), html: args.map(a => fmtHTML(a, true)).join(" ") };
    logs.push(entry);
    if (opt.live && liveRun && liveRun.logs === logs && liveRun.ready) appendLog(entry, true);
  };
  const con = { log: add("log"), info: add("log"), warn: add("warn"), error: add("error"), table: add("log") };
  const prelude = (scen && scen.prelude) || L.prelude || "";
  const preludeLines = prelude.split("\n").length;
  const preNames = declaredNames(prelude);
  const ins = instrument(code);
  const meta = [];
  const hasStage = L.stage != null;
  const trace = { steps: opt.trace ? [] : null, on: !!opt.trace, truncated: false };
  let names, body;
  const capsFor = list => "()=>({" + list.map(n => JSON.stringify(n) + ":__g(()=>" + n + ")").join(",") + "})";
  if (ins) {
    names = [...new Set([...preNames, ...ins.names])];
    const caps = capsFor(names);
    const edits = [];
    ins.stmts.forEach(n => { const id = meta.length; meta.push({ line: n.loc.start.line, desc: describe(n, code), kind: n.type }); edits.push({ pos: n.start, text: "__s(" + id + "," + caps + ");" }); });
    ins.ifs.forEach(n => { const id = meta.length; meta.push({ line: n.loc.start.line, desc: "Test : `" + short(code.slice(n.test.start, n.test.end)) + "`", kind: "if", altIf: !!(n.alternate && n.alternate.type === "IfStatement"), alt: !!n.alternate }); edits.push({ pos: n.test.start, text: "__t(" + id + "," + caps + ",(" }); edits.push({ pos: n.test.end, text: "))" }); });
    edits.sort((a, b) => b.pos - a.pos);
    let out = code;
    for (const e of edits) out = out.slice(0, e.pos) + e.text + out.slice(e.pos);
    body = "\"use strict\";\n" + prelude + "\n" + out + "\n;__end(" + caps + ");";
  } else {
    names = [...new Set([...preNames, ...declaredNames(code)])];
    body = "\"use strict\";\n" + prelude + "\n" + code + "\n;__end(" + capsFor(names) + ");";
  }
  const snapVars = cap => cleanVars(cap(), true);
  const record = (id, cap, extra) => {
    guard();
    if (trace.steps && trace.on) {
      if (trace.steps.length >= MAX_STEPS) { trace.truncated = true; trace.on = false; throw new StopTrace(); }
      trace.steps.push(Object.assign({ id, line: meta[id].line, vars: snapVars(cap), logs: logs.length, page: hasStage ? pageSnap(stage) : null }, extra || {}));
    }
  };
  const __s = (id, cap) => record(id, cap);
  const __t = (id, cap, v) => { record(id, cap, { result: !!v }); return v; };
  const __g = f => { try { return f(); } catch (e) { return NA; } };
  let endRaw = {};
  const __end = cap => { endRaw = cap(); };
  let error = null;
  try {
    const fn = new Function("console", "document", "alert", "__s", "__t", "__g", "__end", body);
    fn(con, makeDoc(stage), m => con.log("[alerte] " + m), __s, __t, __g, __end);
  } catch (e) { if (!(e instanceof StopTrace)) error = e; }
  if (trace.steps) {
    const last = trace.steps[trace.steps.length - 1];
    if (!error && opt.simulate && L.simulate && !trace.truncated) {
      trace.steps.push({ marker: L.simulateLabel || "Événement simulé", vars: last ? last.vars : {}, logs: logs.length, page: hasStage ? pageSnap(stage) : null });
      const was = silent; silent = true;
      try { L.simulate(stage); } catch (e) { /* les erreurs des écouteurs passent par window.onerror */ }
      silent = was;
    }
    trace.on = false;
    trace.steps.push({ end: true, vars: cleanVars(endRaw, true), logs: logs.length, page: hasStage ? pageSnap(stage) : null, error: error ? true : false });
  }
  return { logs, vars: cleanVars(endRaw, false), error, stage, scenario: scen, preludeNames: preNames, preludeLines, steps: trace.steps, truncated: trace.truncated, meta, code };
}

/* ---------- erreurs expliquées ---------- */
const ERRORS = [
  [/^Boucle infinie/, () => "Ton code tourne sans jamais s’arrêter (une boucle infinie). Le jeu l’a arrêté pour ne pas bloquer la page. Vérifie la condition de ta boucle."],
  [/^(.+) is not defined$/, m => "JavaScript ne connaît pas `" + m[1] + "`. Trois causes possibles : une faute de frappe (les majuscules comptent), une variable pas encore créée avec `let` ou `const`, ou du texte oublié sans guillemets."],
  [/Assignment to constant variable/, () => "Tu essaies de changer une variable créée avec `const`. Si sa valeur doit changer, crée-la avec `let`."],
  [/Identifier '(.+)' has already been declared/, m => "`" + m[1] + "` existe déjà. On écrit `let` ou `const` une seule fois ; ensuite on utilise juste le nom. Attention : une variable déjà écrite par le jeu ne se recrée pas."],
  [/Cannot access '(.+)' before initialization/, m => "Tu utilises `" + m[1] + "` avant la ligne qui la crée. JavaScript lit de haut en bas : déplace la création plus haut."],
  [/Cannot (?:read|set) properties of null \(\w+ '(.+)'\)/, m => "Tu utilises `." + m[1] + "` sur quelque chose qui vaut `null` (rien). Le plus souvent, `querySelector` n’a pas trouvé l’élément : vérifie le sélecteur (un point pour une classe, # pour un id) et compare avec le HTML."],
  [/Cannot (?:read|set) properties of undefined \(\w+ '(.+)'\)/, m => "Tu utilises `." + m[1] + "` sur une valeur `undefined`. Vérifie le nom de la variable, l’index du tableau (on commence à 0) ou le paramètre de la fonction."],
  [/^(.+) is not a function$/, m => "`" + m[1] + "` n’est pas une fonction. Vérifie l’orthographe (`querySelector`, `addEventListener`, `forEach`…) ou retire les parenthèses si c’est une propriété comme `length`."],
  [/is not a valid selector/, () => "Le sélecteur n’est pas valide. Il doit ressembler à du CSS : `.classe`, `#id` ou une balise comme `h2`."],
  [/missing \) after argument list/, () => "Il manque une parenthèse fermante `)`, ou un `+` / une virgule entre deux morceaux."],
  [/Invalid or unexpected token/, () => "Un caractère pose problème. Souvent : un texte dont le guillemet n’est pas refermé, ou des guillemets typographiques « » ou “ ” au lieu de `\"`."],
  [/Unexpected end of input/, () => "Le code s’arrête trop tôt : il manque sûrement une accolade `}` ou une parenthèse `)` de fermeture."],
  [/Unexpected token '(.+)'/, m => "JavaScript ne s’attendait pas à `" + m[1] + "` ici. Regarde juste avant : parenthèse, virgule, accolade ou guillemet manquant ou en trop."],
  [/Unexpected identifier/, () => "Un mot est mal placé. Il manque souvent un `+`, une virgule, un point ou des guillemets juste avant."],
  [/Unexpected string/, () => "Un texte est mal placé : il manque souvent un `+` ou une virgule juste avant."],
  [/Unexpected number/, () => "Un nombre est mal placé : il manque souvent un opérateur ou une virgule juste avant."],
  [/Unexpected token/, () => "Il y a un symbole inattendu. Vérifie les parenthèses, accolades, virgules et guillemets."]
];
function contextHint(err, line, code) {
  const msg = String(err && err.message || err);
  const lines = String(code || "").split("\n");
  if (/Unexpected token '\{'|Unexpected identifier|Unexpected string/.test(msg) && line > 1) {
    let k = line - 2; while (k >= 0 && !lines[k].trim()) k--;
    const prev = k >= 0 ? lines[k].replace(/\/\/.*$/, "").trim() : "";
    const cur = (lines[line - 1] || "").trim();
    if (/[}\]"]$/.test(prev) && /^[{"\w]/.test(cur)) return "Il manque sûrement une **virgule à la fin de la ligne " + (k + 1) + "**. Dans un tableau, on sépare chaque élément du suivant par une virgule : `{ … },` puis `{ … }`. Seul le dernier n’en a pas besoin.";
  }
  if (/Unexpected token ','/.test(msg) && /=\s*\{\s*\[/.test(code)) return "Tu as mis des accolades `{ }` autour de ton tableau. Un tableau s’écrit seulement avec des crochets : `const liste = [ … ];`. Les accolades sont pour les objets, à l’intérieur.";
  const m = msg.match(/properties of undefined/) && String(code).match(/(\w+)\[\s*\1\.length\s*\]/);
  if (m) return "`" + m[0] + "` n’existe pas : avec " + "`length`" + " éléments, les index vont de 0 à `length - 1`. Le dernier élément, c’est `" + m[1] + "[" + m[1] + ".length - 1]`.";
  if (/properties of null/.test(msg)) { const q = String(code).match(/querySelector(?:All)?\(\s*["']([a-z][\w-]*)["']\s*\)/); if (q && !/^(h[1-6]|p|ul|li|main|form|input|button|section|nav|header|footer|article|span|div|a|textarea|label|aside|small)$/.test(q[1])) return "`querySelector(\"" + q[1] + "\")` cherche une balise `<" + q[1] + ">`, qui n’existe pas. Pour une **classe**, il faut un point : `querySelector(\"." + q[1] + "\")`. Pour un **id**, un dièse : `\"#" + q[1] + "\"`.";
  }
  return null;
}
function explain(err, line, code) {
  const h = code ? contextHint(err, line, code) : null; if (h) return h;
  const msg = String(err && err.message || err);
  for (const [re, fn] of ERRORS) { const m = msg.match(re); if (m) return fn(m); }
  return "JavaScript s’est arrêté sur une erreur. Lis le message d’origine ci-dessous : il dit souvent quel mot pose problème.";
}
function errorLine(err, code, preludeLines) {
  if (err instanceof SyntaxError) {
    if (window.acorn) { try { window.acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" }); } catch (e) { if (e.loc) return e.loc.line; } }
    return null;
  }
  const m = String(err && err.stack || "").match(/<anonymous>:(\d+):\d+/);
  if (m) { const n = +m[1] - 3 - preludeLines; if (n >= 1 && n <= code.split("\n").length) return n; }
  return null;
}
window.addEventListener("error", ev => {
  if (!ev.error) return;
  if (silent) { silentErrors.push(ev.error); ev.preventDefault(); return; }
  if (liveRun && liveRun.ready) {
    ev.preventDefault();
    const box = $("#console-out");
    if (box) { box.appendChild(errorBox(ev.error, null, "pendant un événement")); setBadges(true); setMood("oops"); }
  }
});
/* un formulaire de la page de test ne doit jamais recharger le jeu */
document.addEventListener("submit", ev => {
  if (!ev.target.closest || !ev.target.closest(".stage")) return;
  if (!ev.defaultPrevented) { ev.preventDefault(); toast("Sans `event.preventDefault()`, la page se serait rechargée et tout aurait été effacé !"); }
});

/* =====================================================================
   BIP
   ===================================================================== */
function bipSVG(mood) {
  let eyes, mouth;
  if (mood === "happy") { eyes = `<path class="lid" d="M66 88 q12 -16 24 0"/><path class="lid" d="M110 88 q12 -16 24 0"/>`; mouth = `<path class="mouth" d="M84 102 q16 16 32 0"/>`; }
  else if (mood === "oops") { eyes = `<path class="x" d="M70 74 l16 16 M86 74 l-16 16"/><path class="x" d="M114 74 l16 16 M130 74 l-16 16"/>`; mouth = `<path class="mouth" d="M88 112 q12 -9 24 0"/>`; }
  else if (mood === "think") { eyes = `<circle class="eye" cx="78" cy="78" r="10"/><circle class="glint" cx="82" cy="74" r="3"/><circle class="eye" cx="122" cy="78" r="10"/><circle class="glint" cx="126" cy="74" r="3"/>`; mouth = `<path class="mouth" d="M90 108 h20"/>`; }
  else { eyes = `<circle class="eye" cx="78" cy="82" r="11"/><circle class="glint" cx="82" cy="78" r="3.5"/><circle class="eye" cx="122" cy="82" r="11"/><circle class="glint" cx="126" cy="78" r="3.5"/>`; mouth = `<path class="mouth" d="M88 104 q12 9 24 0"/>`; }
  return `<svg class="bip" viewBox="0 0 200 232" aria-hidden="true">
    <g class="part"><line x1="100" y1="42" x2="100" y2="18" stroke-width="5" stroke-linecap="round"/><circle class="tip" cx="100" cy="14" r="8"/></g>
    <g class="part"><rect x="34" y="142" width="22" height="50" rx="11"/><rect x="144" y="142" width="22" height="50" rx="11"/></g>
    <g class="part wheels"><circle cx="76" cy="212" r="15"/><circle cx="124" cy="212" r="15"/><circle class="hub" cx="76" cy="212" r="5"/><circle class="hub" cx="124" cy="212" r="5"/></g>
    <rect class="neck" x="88" y="124" width="24" height="14"/>
    <rect class="body painted" x="58" y="134" width="84" height="66" rx="16"/>
    <g class="part screen"><rect x="74" y="146" width="52" height="30" rx="7"/><text x="100" y="166" text-anchor="middle">&lt;/&gt;</text></g>
    <path class="heart" d="M100 194 c-7 -5 -11 -8 -11 -12 a5.5 5.5 0 0 1 11 -2 a5.5 5.5 0 0 1 11 2 c0 4 -4 7 -11 12z"/>
    <rect class="head" x="36" y="40" width="128" height="88" rx="30"/>
    ${eyes}${mouth}
    <ellipse class="cheek" cx="58" cy="100" rx="8" ry="5"/><ellipse class="cheek" cx="142" cy="100" rx="8" ry="5"/>
  </svg>`;
}
function setMood(m) { const s = $("#says-bip"); if (s) s.innerHTML = bipSVG(m); }
function toast(msg) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.innerHTML = md(msg); t.hidden = false;
  clearTimeout(t._h); t._h = setTimeout(() => { t.hidden = true; }, 3800);
}

/* =====================================================================
   NAVIGATION
   ===================================================================== */
function setView(name) {
  ["map", "level", "notebook", "project"].forEach(v => { $("#view-" + v).hidden = v !== name; });
  refreshProjectNav();
  if (name !== "project") $("#view-project").innerHTML = "";
  const cur = { "nav-map": name === "map", "nav-notebook": name === "notebook", "nav-sandbox": name === "level" && !!(current && current.sandbox), "nav-project": name === "project" };
  Object.entries(cur).forEach(([id, on]) => { const b = $("#" + id); if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  if (name !== "level") liveRun = null;
  window.scrollTo(0, 0);
}
function setHash(h) { if (location.hash !== "#" + h) history.replaceState(null, "", "#" + h); }
function route() {
  const h = location.hash.slice(1);
  if (h === "carnet") return showNotebook();
  if (h === "projet") return showProject();
  if (h === SANDBOX.id) return openLevel(SANDBOX.id);
  if (h.startsWith("mission-")) { const id = h.slice(8); const i = levelIndex(id); if (i >= 0 && isUnlocked(i)) return openLevel(id); }
  showMap();
}
function updateStats() {
  $("#stat-stars").textContent = totalStars();
  $("#stat-max").textContent = LEVELS.length * 3;
  $("#stat-done").textContent = LEVELS.filter(l => isDone(l.id)).length;
  $("#stat-total").textContent = LEVELS.length;
  $("#brand-bip").innerHTML = bipSVG();
  refreshProjectNav();
}

/* =====================================================================
   CARTE DES CLIENTS
   ===================================================================== */
function showMap() {
  current = null; setHash("carte");
  const nb = LEVELS.filter(l => isDone(l.id)).length;
  const pct = Math.round(nb / LEVELS.length * 100);
  const nxt = nextLevel();
  const delivered = CHAPTERS.filter(c => !c.formation && chapterDone(c.n)).length;
  const nbClients = CHAPTERS.filter(c => !c.formation).length;
  $("#view-map").innerHTML = `
  <section class="hero">
    <div>
      <p class="kicker">JavaScript · ${LEVELS.length} missions · ${nbClients} clients · 2 formations</p>
      <h1>Bip <span>Agence</span></h1>
      <p class="lead">Tu entres en stage dans l’agence de Bip. Neuf clients, de la boulangerie au réseau social, attendent leur site, et deux formations internes t’apprennent à lire les accolades et à trouver le chemin vers une donnée. Ici, on ne recopie pas : on <strong>observe</strong> le code s’exécuter, on <strong>prédit</strong>, on <strong>explique</strong>. À la fin, tu sais pourquoi chaque ligne est là.</p>
      <div class="hero-actions">
        ${nxt ? `<button class="btn btn-primary" type="button" data-open="${nxt.id}">${nb ? "Continuer" : "Commencer le stage"} : mission ${levelIndex(nxt.id) + 1}</button>` : projectOpen() ? `<button class="btn btn-primary" type="button" id="hero-project">${proj() ? "Mon projet bonus" : "Stage validé ! Projet bonus"}</button>` : ""}
        ${!nxt ? `<button class="btn" type="button" data-open="${SANDBOX.id}">Bac à sable</button>` : ""}
      </div>
      <div class="progress">
        <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progression"><span style="width: ${pct}%"></span></div>
        <p>${nb} / ${LEVELS.length} missions · ${totalStars()} ★ sur ${LEVELS.length * 3} · ${delivered} / ${nbClients} clients livrés</p>
      </div>
    </div>
    <div class="hero-bip"><div class="bob">${bipSVG(nb === LEVELS.length ? "happy" : null)}</div><p class="kicker" style="margin:0">Bip · ton maître de stage</p></div>
  </section>
  ${projectBlockHTML()}
  <div class="section-title"><h2>Huit façons d’apprendre</h2><p>Chaque client mélange ces missions, dans cet ordre : d’abord comprendre, puis s’entraîner, puis prouver.</p></div>
  <section class="ways" aria-label="Les types de missions" style="margin-bottom:40px">
    <div class="way-group">
      <div class="way-head"><b>1</b><div><h3>Comprendre</h3><p>Voir comment ça marche avant d’écrire.</p></div></div>
      <article class="way">
        <div class="way-top"><span class="type-chip">Schémas</span><h4>Le dessin avant le code</h4></div>
        <div class="way-demo demo-flow"><span>données</span><i>→</i><span>afficher()</span><i>→</i><span>page</span></div>
        <p>Chaque mission a son schéma : ce qui entre, ce qui se passe, ce qui sort.</p>
      </article>
      <article class="way">
        <div class="way-top"><span class="type-chip type-observe">Observer</span><h4>Le code au ralenti</h4></div>
        <div class="way-demo demo-code"><code><em>▶</em> let total = 12;</code><code class="mem">total <b>12</b></code></div>
        <p>Le code s’exécute ligne par ligne, tu vois la mémoire changer, puis tu réponds.</p>
      </article>
      <article class="way">
        <div class="way-top"><span class="type-chip type-path">Chemin</span><h4>Trouver une donnée</h4></div>
        <div class="way-demo demo-path"><span>projets</span><i>›</i><span>[1]</span><i>›</i><span>.titre</span></div>
        <p>Les données sont dessinées en boîtes : tu écris le chemin pour récupérer, modifier ou supprimer.</p>
      </article>
    </div>
    <div class="way-group">
      <div class="way-head"><b>2</b><div><h3>S’entraîner</h3><p>Faire, avec un filet.</p></div></div>
      <article class="way">
        <div class="way-top"><span class="type-chip type-predict">Prédire</span><h4>Deviner avant de lancer</h4></div>
        <div class="way-demo demo-code"><code>console.log(2 + "2");</code><code class="ask">› <span>?</span></code></div>
        <p>Tu annonces ce que la console va afficher, puis tu vérifies.</p>
      </article>
      <article class="way">
        <div class="way-top"><span class="type-chip type-fill">Compléter</span><h4>Juste l’essentiel</h4></div>
        <div class="way-demo demo-code"><code>liste.<span class="hole">______</span>(p => …);</code></div>
        <p>Le code est là, sauf les cases importantes : tu tapes seulement ce qui compte.</p>
      </article>
      <article class="way">
        <div class="way-top"><span class="type-chip type-fix">Réparer</span><h4>Le client est mécontent</h4></div>
        <div class="way-demo demo-code"><code class="bad">{ titre: "Lune" }</code><code class="err">Ligne 4 : il manque une virgule</code></div>
        <p>Un code cassé : tu lis l’erreur, tu trouves la ligne, tu corriges.</p>
      </article>
    </div>
    <div class="way-group">
      <div class="way-head"><b>3</b><div><h3>Prouver</h3><p>Montrer que tu sais, pour de vrai.</p></div></div>
      <article class="way">
        <div class="way-top"><span class="type-chip type-real">Mission client</span><h4>La vraie commande</h4></div>
        <div class="way-demo demo-tests"><span>✓ tes données</span><span>✓ 2 éléments</span><span>✓ liste vide</span></div>
        <p>Tu codes seul, et le jeu teste ton code avec d’autres données : impossible de tricher.</p>
      </article>
      <article class="way">
        <div class="way-top"><span class="type-chip">Pourquoi ?</span><h4>Expliquer son code</h4></div>
        <div class="way-demo demo-quiz"><p>Pourquoi <code>length - 1</code> ?</p><span>On compte à partir de 0</span></div>
        <p>Chaque code finit par une question : la mission est validée seulement si tu sais expliquer.</p>
      </article>
      <article class="way way-rule">
        <div class="way-top"><span class="type-chip">Règle de l’agence</span><h4>Taper soi-même</h4></div>
        <div class="way-demo demo-keys"><kbd>Ctrl</kbd> + <kbd>V</kbd><s>coller</s></div>
        <p>Le copier-coller est désactivé dans l’éditeur : on tape le code, c’est comme ça qu’on le retient.</p>
      </article>
    </div>
  </section>
  <div class="section-title"><h2>Les clients et les formations</h2><p>Chaque client = une notion et un vrai type de site. Les formations reprennent ce qui bloque le plus.</p></div>
  <section class="chapters">
    ${CHAPTERS.map(c => `
      <article class="chap ${chapterDone(c.n) ? "done" : ""} ${c.formation ? "formation" : ""}">
        <div class="chap-top"><span>${chLabel(c.n)}</span><span class="chap-piece ${chapterDone(c.n) ? "got" : ""}">${chapterDone(c.n) ? "✓ Livré" : ""}</span></div>
        <h3>${esc(c.client)}</h3>
        <p class="client-kind">${esc(c.kind)}</p>
        <div class="chips">${c.notions.map(n => `<code>${esc(n)}</code>`).join("")}</div>
        <ol class="nodes">
          ${LEVELS.map((l, i) => ({ l, i })).filter(o => o.l.ch === c.n).map(({ l, i }) => {
            const p = store.progress[l.id]; const open = isUnlocked(i);
            const cls = p ? "done" : (nxt && nxt.id === l.id ? "next" : "");
            return `<li><button class="node ${cls}" type="button" data-open="${l.id}" ${open ? "" : "disabled"} aria-label="Mission ${i + 1} : ${esc(l.title)}${open ? "" : " (verrouillée)"}">
              <span class="node-num">${i + 1}</span>
              <span class="node-title">${esc(l.title)}<small><span class="type-dot">${TYPES[l.type].label}</span> · ${esc(l.notion)}</small></span>
              <span class="node-stars">${p ? starsHTML(p.stars) : (open ? "" : "🔒")}</span>
            </button></li>`;
          }).join("")}
        </ol>
      </article>`).join("")}
  </section>`;
  setView("map"); updateStats();
}

/* =====================================================================
   MISSION
   ===================================================================== */
function openLevel(id) {
  const L = id === SANDBOX.id ? SANDBOX : LEVELS.find(l => l.id === id);
  if (!L) return showMap();
  current = L;
  $("#view-project").innerHTML = "";
  session = { hints: 0, attempts: 0, checkWrong: 0, teacherUsed: false, results: null, answers: {}, checkAnswers: {}, predictTries: 0, errLine: null, stepLine: null, stepRun: null };
  setHash(L.sandbox ? SANDBOX.id : "mission-" + L.id);
  const i = levelIndex(L.id);
  const ch = CHAPTERS.find(c => c.n === L.ch);
  const prev = i > 0 ? LEVELS[i - 1] : null, next = i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
  const p = store.progress[L.id];
  const head = `
  <div class="level-head">
    <button class="btn btn-small btn-ghost" type="button" data-go="map">← Clients</button>
    <div class="level-title">
      <span class="where">${L.sandbox ? "Mode libre" : `${chLabel(L.ch)} · ${esc(ch.client)} · Mission ${i + 1} / ${LEVELS.length}`}</span>
      <h2>${L.sandbox ? "" : `<span class="type-chip type-${L.type}">${TYPES[L.type].label}</span> `}${esc(L.title)} ${p ? `<span class="node-stars" style="font-size:1.1rem">${starsHTML(p.stars)}</span>` : ""}</h2>
    </div>
    ${L.sandbox ? "" : `<div class="level-nav">
      <button class="btn btn-small" type="button" ${prev ? `data-open="${prev.id}"` : "disabled"} aria-label="Mission précédente">◀</button>
      <button class="btn btn-small" type="button" ${next && isUnlocked(i + 1) ? `data-open="${next.id}"` : "disabled"} aria-label="Mission suivante">▶</button>
    </div>`}
  </div>`;
  $("#view-level").innerHTML = head + `<div class="level-grid"><div class="brief">${briefHTML(L)}</div><div class="workbench">${benchHTML(L)}</div></div>`;
  setView("level"); updateStats();
  liveRun = null;
  setupLevel(L);
}

function briefHTML(L) {
  const says = `<div class="says"><div id="says-bip">${bipSVG()}</div><p class="bubble">${md(L.bip)}</p></div>`;
  if (L.sandbox) return says + `<section class="card mission"><p class="card-kicker">Idées d’essais</p><ul class="steps">
      <li>Lance ton code avec <strong>Pas à pas</strong> et regarde la mémoire changer à chaque ligne.</li>
      <li>Fais une erreur exprès (oublie un guillemet) et lis l’explication.</li>
      <li>Change le texte de <code>.titre</code> ou ajoute des <code>li</code> dans <code>.liste</code> (onglet Page).</li>
      <li>Recopie (en tapant !) un exemple du <strong>Carnet</strong> et modifie-le.</li></ul></section>`;
  const T = TYPES[L.type];
  const defaults = {
    path: typeof PATH_STEPS !== "undefined" ? PATH_STEPS : [],
    observe: ["Clique sur **Suivant** pour exécuter le code une ligne à la fois.", "Lis l’explication de chaque ligne et regarde la **Mémoire** et la **Console** changer.", "Réponds aux questions sous le pas à pas. Tu peux revenir en arrière autant que tu veux."],
    predict: ["Regarde le schéma, puis lis le code **sans le lancer**.", "Écris ce que la console va afficher, ligne par ligne.", "Vérifie. En cas d’erreur, le pas à pas te montrera pourquoi."]
  };
  const steps = L.steps || defaults[L.type] || [];
  const ch = CHAPTERS.find(c => c.n === L.ch);
  const schema = L.diagrams && L.diagrams.length ? `<section class="card schema"><p class="card-kicker">Le schéma · comment ça marche</p>${L.diagrams.map(diagramHTML).join("")}</section>` : "";
  const where = L.where ? `<section class="card where"><p class="card-kicker">Dans la vraie vie · ${ch.formation ? "où on s’en sert" : esc(ch.client)}</p>
      <div class="where-grid"><div>${ch.mock}</div>
      <div><p>${md(L.where.text)}</p></div>
      ${L.where.tags && L.where.tags.length ? `<ul class="tags">${L.where.tags.map(([ui, code]) => `<li><span class="ui">${esc(ui)}</span><span class="arrow">←</span><code>${esc(code)}</code></li>`).join("")}</ul>` : ""}</div>
      <div class="why-box"><p class="mini-label">Pourquoi ça existe ?</p><p>${md(L.why)}</p></div></section>` : "";
  const lesson = L.lesson ? `<section class="card lesson"><p class="card-kicker">La leçon · ${esc(L.notion)}</p><p>${md(L.lesson.what)}</p><pre class="code-block">${highlight(L.lesson.code)}</pre><dl class="pieces">${L.lesson.pieces.map(([k, d]) => `<div><dt><code>${esc(k)}</code></dt><dd>${md(d)}</dd></div>`).join("")}</dl><div class="trap"><p class="mini-label">Piège à éviter</p><p>${md(L.lesson.trap)}</p></div></section>` : "";
  const help = isCodeType(L) ? `<section class="card help" id="help" hidden><p class="card-kicker">Indices</p><ol class="hint-list" id="hint-list"></ol><div id="solution-box" hidden></div></section>` : "";
  return says + `<section class="card mission"><p class="card-kicker">Ta mission · ${T.verb}</p><ol class="steps">${steps.map(s => `<li>${md(s)}</li>`).join("")}</ol>${isCodeType(L) ? `<p class="rule"><b>Agence</b> Pas de copier-coller : tape ton code. Pour valider, tu devras aussi expliquer pourquoi il marche.</p>` : ""}</section>` + schema + where + lesson + help;
}

function editorHTML(readonly) {
  return `<p class="editor-tip">Astuce : une <code>{</code> et sa <code>}</code> ont la même couleur. Clique juste à côté d’une accolade ou d’une parenthèse : sa partenaire s’allume. En rouge : une accolade sans partenaire.</p><div class="editor"><div class="gutter" id="gutter" aria-hidden="true"></div><div class="code-wrap"><pre class="hl" id="hl" aria-hidden="true"></pre><textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" ${readonly ? "readonly" : ""} aria-label="${readonly ? "Code à lire" : "Éditeur de code JavaScript"}"></textarea></div></div>`;
}
function preludeHTML(L) {
  if (!L.prelude) return "";
  return `<div class="prelude"><div class="prelude-head"><span>Déjà écrit par le jeu (lecture seule)</span><span>${L.scenarios && L.scenarios.some(s => s.hidden) ? "Le jeu testera aussi ton code avec d’autres valeurs" : "Tu peux utiliser ces variables"}</span></div><pre>${highlight(L.prelude)}</pre></div>`;
}
function tabsHTML(list) {
  const names = { goals: "Objectifs", console: "Console", memory: "Mémoire", page: "Page", apercu: "Aperçu du site", step: "Pas à pas", result: "Résultat" };
  return `<div class="tabs" role="tablist">${list.map(t => `<button class="tab" role="tab" id="tab-${t}" data-tab="${t}">${names[t]}${t === "goals" ? ` <span class="badge" id="badge-goals"></span>` : ""}${t === "console" ? ` <span class="badge" id="badge-console" hidden></span>` : ""}</button>`).join("")}</div>`;
}
function panelsHTML(list) {
  const P = {
    goals: `<ul class="goals" id="goals"></ul><p class="goals-note" id="goals-note"></p>`,
    console: `<div class="console" id="console-out"><p class="empty">Clique sur <strong>Lancer</strong> pour exécuter ton code. Ce que tu affiches avec <code>console.log</code> apparaîtra ici.</p></div>`,
    memory: `<div class="memory" id="memory-out"><p class="memory-note">Après avoir lancé ton code, tu verras ici chaque variable : son nom, sa valeur et son type.</p></div>`,
    page: `<div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span>ma-page.html</span></div><div class="stage" id="stage"></div></div><p class="page-note">C’est la page que ton code manipule avec <code>document</code>. Elle est remise à zéro à chaque lancement. Tu peux cliquer et taper dedans.</p>`,
    apercu: `<div id="apercu-out"><p class="empty">Lance ton code : le site du client utilisera tes variables.</p></div>`,
    step: `<div id="stepper"><p class="empty">Clique sur <strong>Pas à pas</strong> pour voir ton code s’exécuter ligne par ligne.</p></div>`,
    result: `<div id="result-out"></div>`
  };
  return list.map(t => `<div class="panel" role="tabpanel" id="panel-${t}">${P[t]}</div>`).join("");
}
function benchHTML(L) {
  const hasStage = L.stage != null;
  if (L.type === "path") return pathBenchHTML(L);
  if (L.type === "observe") {
    return `${editorHTML(true)}
      <div class="results"><div class="panel" id="panel-step" style="max-height:none"><div id="stepper"></div></div></div>
      <section class="card mission"><p class="card-kicker">Questions · tu peux revenir dans le pas à pas pour vérifier</p>${questionsHTML(L.questions, "q")}<div class="quiz-foot"><button class="btn btn-primary" type="button" id="q-check">Vérifier mes réponses</button><span id="q-msg" aria-live="polite"></span>${store.teacher ? `<button class="btn btn-small btn-ghost" type="button" id="teacher-answers">Réponses (formateur)</button>` : ""}</div></section>`;
  }
  if (L.type === "predict") {
    return `${editorHTML(true)}
      <section class="card mission" id="predict-card"><p class="card-kicker">Ta prédiction</p><p id="predict-intro"></p><div class="pred-list" id="pred-list"></div>
      <div class="quiz-foot"><button class="btn btn-primary" type="button" id="predict-check">Vérifier ma prédiction</button><span id="predict-msg" aria-live="polite"></span>${store.teacher ? `<button class="btn btn-small btn-ghost" type="button" id="teacher-answers">Réponses (formateur)</button>` : ""}</div></section>
      <div class="results" id="predict-results" hidden>${tabsHTML(hasStage ? ["step", "page"] : ["step"])}${panelsHTML(hasStage ? ["step", "page"] : ["step"])}</div>`;
  }
  const tabs = [];
  if (!L.sandbox) tabs.push("goals");
  tabs.push("console", "memory");
  if (hasStage) tabs.push("page");
  if (L.render) tabs.push("apercu");
  tabs.push("step");
  const code = L.type === "fill" ? `<div class="card" style="padding:12px"><p class="card-kicker">Code à compléter · tape dans les cases jaunes</p><div id="fill-box"></div></div>` : editorHTML(false);
  return `${preludeHTML(L)}${code}
    <div class="actions">
      <button class="btn btn-primary" type="button" id="run">▶ Lancer</button>
      <button class="btn btn-yellow" type="button" id="trace">Pas à pas</button>
      ${L.sandbox ? "" : `<button class="btn" type="button" id="hint">Indice (${L.hints.length})</button>`}
      <button class="btn btn-ghost" type="button" id="reset">Recommencer</button>
      ${store.teacher && !L.sandbox ? `<button class="btn btn-ghost" type="button" id="teacher-solution">Solution (formateur)</button>` : ""}
      <span class="kbd">Ctrl + Entrée pour lancer</span>
    </div>
    <div id="check-slot"></div>
    <div class="results">${tabsHTML(tabs)}${panelsHTML(tabs)}</div>`;
}

function selectTab(name) {
  document.querySelectorAll("#view-level .tab, #view-project .tab").forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
  document.querySelectorAll("#view-level .results .panel, #view-project .results .panel").forEach(p => { if (p.parentElement.querySelector(".tabs")) p.hidden = p.id !== "panel-" + name; });
}

function setupLevel(L) {
  if (L.type === "path") return setupPath(L);
  if (L.type === "observe" || L.type === "predict") {
    const ta = $("#code"); ta.value = L.code; bindEditor(ta, true);
  }
  if (L.type === "observe") {
    bindQuestions(L.questions, "q");
    const run = traceRun(L, L.code);
    renderStepper(run, L);
    $("#q-check").addEventListener("click", () => checkObserve(L));
    return;
  }
  if (L.type === "predict") {
    const st = document.createElement("div"); st.innerHTML = L.stage || "";
    const run = execute(L, L.code, null, st, {});
    session.expected = run.logs.map(l => l.text);
    $("#predict-intro").innerHTML = `La console va afficher <strong>${session.expected.length} lignes</strong>. Écris-les dans l’ordre, exactement comme elles s’afficheront (pas besoin des guillemets).`;
    $("#pred-list").innerHTML = session.expected.map((_, i) => `<div class="pred" id="pred-${i}"><label for="pred-in-${i}">Ligne ${i + 1}</label><input id="pred-in-${i}" type="text" autocomplete="off" spellcheck="false"><div class="pred-res" id="pred-res-${i}" hidden></div></div>`).join("");
    $("#predict-check").addEventListener("click", () => checkPredict(L));
    return;
  }
  if (L.type === "fill") renderFill(L);
  else { const ta = $("#code"); ta.value = store.drafts[L.id] != null ? store.drafts[L.id] : (L.starter || ""); bindEditor(ta, false); }
  if (L.stage != null) $("#stage").innerHTML = L.stage;
  if (L.goals) renderGoals(null);
  selectTab(L.sandbox ? "console" : "goals");
}

/* ---------- éditeur ---------- */
function bindEditor(ta, readonly) {
  const hl = $("#hl"), gutter = $("#gutter");
  const paint = () => {
    const lines = ta.value.split("\n").length;
    const err = session.errLine, cur = session.stepLine;
    let match = null;
    if (document.activeElement === ta) {
      const br = bracketInfo(ta.value), p = ta.selectionStart;
      const at = br.has(p) ? p : br.has(p - 1) ? p - 1 : -1;
      if (at >= 0 && br.get(at).partner !== undefined) match = new Set([at, br.get(at).partner]);
    }
    const H = ta._lang === "html" ? hlHTML : ta._lang === "css" ? hlCSS : (v => highlight(v, match));
    const showMarks = !ta._lang || ta._lang === "js";
    hl.innerHTML = `<div class="hl-inner">${cur && showMarks ? `<div class="stepbar" style="top:${(cur - 1) * 22}px"></div>` : ""}${err && showMarks ? `<div class="errbar" style="top:${(err - 1) * 22}px"></div>` : ""}${H(ta.value)}\n</div>`;
    let g = ""; for (let n = 1; n <= Math.max(lines, 1); n++) g += `<div class="${n === err ? "err" : n === cur ? "cur" : ""}">${n}</div>`;
    gutter.innerHTML = g; sync();
  };
  const sync = () => { const inner = hl.firstElementChild; if (inner) inner.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`; gutter.scrollTop = ta.scrollTop; };
  const insert = t => { if (!document.execCommand || !document.execCommand("insertText", false, t)) { ta.setRangeText(t, ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); } };
  ta.addEventListener("scroll", sync);
  ["keyup", "click", "focus", "blur"].forEach(ev => ta.addEventListener(ev, () => paint()));
  if (!readonly) {
    ta.addEventListener("input", () => { session.errLine = null; session.stepLine = null; paint(); if (ta._onChange) ta._onChange(ta.value); else if (current) { store.drafts[current.id] = ta.value; save(); } });
    ta.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode(); return; }
      if (e.key === "Tab" && !e.shiftKey && !e.altKey) { e.preventDefault(); insert("  "); return; }
      if (e.key === "Enter" && !e.shiftKey) { const line = ta.value.slice(0, ta.selectionStart).split("\n").pop(); let ind = line.match(/^\s*/)[0]; if (/[{(\[]\s*$/.test(line)) ind += "  "; e.preventDefault(); insert("\n" + ind); }
    });
    blockPaste(ta);
  }
  ta._paint = paint;
  paint();
}
function blockPaste(el) {
  const no = e => { if (store.teacher || (current && current.sandbox) || (el._lang && el._lang !== "js")) return; e.preventDefault(); toast("Le collage est désactivé : tape le code toi-même. C’est en tapant qu’on retient !"); };
  el.addEventListener("paste", no); el.addEventListener("drop", no);
}
function scrollToLine(n) { const ta = $("#code"); if (!ta || !n) return; const target = (n - 1) * 22 - ta.clientHeight / 2 + 22; ta.scrollTop = Math.max(0, target); }

/* ---------- code à trous ---------- */
function fillParts(L) { return L.template.split(/\{\{(.*?)\}\}/); }
function renderFill(L) {
  const parts = fillParts(L); const saved = store.drafts[L.id] || [];
  let html = "";
  parts.forEach((p, i) => {
    if (i % 2 === 0) html += highlight(p);
    else { const k = (i - 1) / 2; html += `<input class="blank" data-k="${k}" style="width:${Math.max(p.length, 3) + 3}ch" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Case ${k + 1}" value="${esc(saved[k] || "")}">`; }
  });
  $("#fill-box").innerHTML = `<pre class="code-block fill-code">${html}</pre>`;
  document.querySelectorAll(".blank").forEach(b => {
    blockPaste(b);
    b.addEventListener("input", () => { const vals = [...document.querySelectorAll(".blank")].map(x => x.value); store.drafts[L.id] = vals; save(); });
    b.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode(); } else if (e.key === "Enter") { e.preventDefault(); const all = [...document.querySelectorAll(".blank")]; const nx = all[all.indexOf(b) + 1]; if (nx) nx.focus(); else runCode(); } });
  });
}
function getCode(L) {
  if (L.type !== "fill") return $("#code").value;
  const parts = fillParts(L); const vals = [...document.querySelectorAll(".blank")].map(b => b.value);
  return parts.map((p, i) => i % 2 === 0 ? p : (vals[(i - 1) / 2] || "")).join("");
}
function fillSolution(L) { return fillParts(L).map((p, i) => p).join(""); }

/* ---------- lancer ---------- */
function runCode() {
  const L = current; if (!L || !isCodeType(L) && !L.sandbox) return;
  const code = getCode(L);
  const hasStage = L.stage != null;
  const stage = hasStage ? $("#stage") : document.createElement("div");
  stage.innerHTML = L.stage || "";
  const scen0 = L.scenarios ? L.scenarios[0] : null;
  session.stepLine = null;
  let results = null, main;
  if (L.goals) {
    silent = true; silentErrors.length = 0;
    const runs = (L.scenarios || [null]).map(s => { const st = document.createElement("div"); st.innerHTML = L.stage || ""; return execute(L, code, s, st, {}); });
    silent = false; liveRun = null;
    main = execute(L, code, scen0, stage, { live: true });
    const c = { runs, code, L, main };
    silent = true;
    results = L.goals.map(g => { let r; try { r = g.test(c); } catch (e) { r = false; } return { ok: r === true, detail: typeof r === "string" ? r : null }; });
    silent = false;
  } else { liveRun = null; main = execute(L, code, scen0, stage, { live: true }); }
  showRun(main, code);
  session.results = results;
  if (L.goals) renderGoals(results);
  if (L.render) renderApercu(L, main);
  $("#check-slot").innerHTML = "";
  if (main.error) { selectTab("console"); setMood("oops"); }
  else if (results && results.every(r => r.ok)) { setMood("happy"); showCheck(L); }
  else if (results) { selectTab("goals"); setMood("think"); }
  else { selectTab("console"); setMood(null); }
}
function showRun(run, code) {
  liveRun = run;
  session.errLine = run.error ? errorLine(run.error, code, run.preludeLines) : null;
  if ($("#code") && $("#code")._paint) $("#code")._paint();
  const box = $("#console-out"); box.innerHTML = "";
  run.logs.forEach(e => appendLog(e, false));
  if (run.error) box.appendChild(errorBox(run.error, session.errLine, null, run.code));
  if (!run.logs.length && !run.error) box.innerHTML = `<p class="empty">Ton code s’est exécuté sans erreur, mais n’a rien affiché. Pour voir une valeur, utilise <code>console.log()</code>.</p>`;
  run.ready = true;
  setBadges(!!run.error);
  const mem = $("#memory-out");
  if (run.error) mem.innerHTML = `<p class="memory-note">Le code s’est arrêté sur une erreur avant la fin : corrige-la (onglet Console) et relance. Le <strong>Pas à pas</strong> peut montrer la mémoire jusqu’à l’erreur.</p>`;
  else mem.innerHTML = memoryHTML(run.vars, run.preludeNames) || `<p class="memory-note">Aucune variable pour l’instant. Crée-en une avec <code>let</code> ou <code>const</code> et relance !</p>`;
}
function appendLog(entry, live) {
  const box = $("#console-out"); if (!box) return;
  const empty = box.querySelector(".empty"); if (empty) empty.remove();
  const d = document.createElement("div"); d.className = "log" + (live ? " live" : "");
  d.innerHTML = `<span class="log-arrow">›</span><span>${entry.html}</span>`;
  box.appendChild(d);
  if (live) setBadges(false);
}
function errorBox(err, line, when, code) {
  const d = document.createElement("div"); d.className = "err-box";
  d.innerHTML = `<p class="err-title">${line ? "Erreur à la ligne " + line : "Erreur" + (when ? " " + when : "")}</p><p>${md(explain(err, line, code))}</p><p class="err-raw">Message d’origine : <code>${esc((err.name || "Error") + ": " + err.message)}</code></p>`;
  return d;
}
function setBadges(err) {
  const b = $("#badge-console"); if (!b || !liveRun) return;
  const n = liveRun.logs.length; b.hidden = !n && !err; b.textContent = err ? "!" : n; b.className = "badge" + (err ? " red" : "");
}
function renderGoals(results) {
  const L = current; if (!L.goals) return;
  $("#goals").innerHTML = L.goals.map((g, i) => {
    const r = results && results[i]; const st = !r ? "todo" : r.ok ? "ok" : "ko";
    return `<li class="goal ${st}"><span class="goal-icon" aria-hidden="true">${st === "ok" ? "✓" : st === "ko" ? "✗" : "○"}</span><span><span>${md(g.label)}</span>${r && r.detail ? `<span class="goal-detail">${md(r.detail)}</span>` : ""}</span></li>`;
  }).join("");
  const okN = results ? results.filter(r => r.ok).length : 0;
  const b = $("#badge-goals"); b.textContent = okN + " / " + L.goals.length; b.className = "badge" + (results && okN === L.goals.length ? " green" : "");
  $("#goals-note").innerHTML = !results ? "Lance ton code : le jeu vérifie chaque objectif. Bloqué ? Essaie le <strong>Pas à pas</strong> avant de demander un indice." : (L.scenarios && L.scenarios.some(s => s.hidden) ? "Les tests cachés lancent ton code avec d’autres valeurs que celles affichées." : "");
}
function renderApercu(L, run) {
  const out = $("#apercu-out"); let html = null;
  if (!run.error) { try { html = L.render(run); } catch (e) { html = null; } }
  out.innerHTML = html ? html + `<p class="page-note">Le site du client affiche tes variables. (Comment le site écrit dans la page ? Tu le découvriras avec le client Pixa.)</p>` : `<p class="empty">Pas encore d’aperçu : il manque des variables, ou le code a une erreur.</p>`;
}

/* ---------- mémoire ---------- */
function memoryHTML(vars, preludeNames, changed, fresh) {
  const names = Object.keys(vars).filter(n => vars[n] !== undefined);
  if (!names.length) return "";
  names.sort((a, b) => (preludeNames.includes(b) ? 1 : 0) - (preludeNames.includes(a) ? 1 : 0));
  return names.map(n => {
    const v = vars[n]; const [label, color] = typeInfo(v);
    let val, wide = false;
    if (Array.isArray(v)) {
      const objs = v.some(x => x && typeof x === "object" && !(x instanceof ElSnap));
      wide = objs || v.length > 4;
      val = v.length ? (objs ? `<div class="rows">${v.slice(0, 12).map((x, i) => `<div class="row"><span class="key">[${i}]</span><span>${fmtHTML(x, false)}</span></div>`).join("")}</div>`
        : `<div class="cells">${v.slice(0, 16).map((x, i) => `<div class="cell"><span class="idx">${i}</span><span class="cv">${fmtHTML(x, false)}</span></div>`).join("")}</div>`) : `<span class="v-punc">[] (tableau vide)</span>`;
      val += `<div style="margin-top:6px;color:var(--ink-soft);font-size:12px">length : ${v.length}</div>`;
    } else if (v && typeof v === "object" && !(v instanceof ElSnap) && !isEl(v) && !(typeof Event !== "undefined" && v instanceof Event)) {
      val = `<div class="rows">${Object.entries(v).map(([k, x]) => `<div class="row"><span class="key">${esc(k)}</span><span>${fmtHTML(x, false)}</span></div>`).join("") || `<span class="v-punc">{}</span>`}</div>`;
    } else if (typeof v === "function") {
      const src = String(v).split("\n")[0]; val = `<span class="v-fn">${esc(src.length > 60 ? src.slice(0, 60) + "…" : src)}</span>`;
    } else val = fmtHTML(v, false);
    const isNew = fresh && fresh.has(n), isCh = changed && changed.has(n);
    return `<div class="mem ${wide ? "wide" : ""} ${isNew || isCh ? "changed" : ""}"><div class="mem-head"><span class="mem-name">${esc(n)}</span><span class="mem-type" style="background:${color}">${label}</span>${isNew ? `<span class="mem-new">nouvelle</span>` : isCh ? `<span class="mem-new">vient de changer</span>` : ""}${preludeNames.includes(n) ? `<span class="mem-given">écrite par le jeu</span>` : ""}</div><div class="mem-val">${val}</div></div>`;
  }).join("");
}

/* =====================================================================
   PAS À PAS
   ===================================================================== */
function traceRun(L, code) {
  const st = document.createElement("div"); st.innerHTML = L.stage || "";
  silent = true;
  const run = execute(L, code, L.scenarios ? L.scenarios[0] : null, st, { trace: true, simulate: true });
  silent = false;
  return run;
}
function startTrace() {
  const L = current; const code = getCode(L);
  const run = traceRun(L, code);
  session.stepRun = run;
  selectTab("step");
  renderStepper(run, L);
}
function renderStepper(run, L) {
  const box = $("#stepper");
  if (!run.steps) { box.innerHTML = `<p class="empty">Le pas à pas a besoin de la bibliothèque acorn, qui n’a pas pu se charger. Vérifie la connexion internet.</p>`; return; }
  if (!run.meta.length && run.error) { box.innerHTML = ""; box.appendChild(errorBox(run.error, errorLine(run.error, run.code, run.preludeLines), null, run.code)); box.insertAdjacentHTML("afterbegin", `<p class="empty">Le code contient une erreur d’écriture : JavaScript ne peut même pas commencer. Corrige-la d’abord.</p>`); return; }
  const steps = run.steps, lines = run.code.split("\n");
  let i = 0;
  const draw = () => {
    const s = steps[i], prev = steps[i - 1];
    let head;
    if (s.marker) head = `<div class="step-now marker"><span class="lbl">Événement</span>${md(s.marker)}</div>`;
    else if (s.end) head = `<div class="step-now end"><span class="lbl">Fin</span>${run.error ? "Le code s’est arrêté sur une erreur (voir ci-dessous)." : "Le programme est terminé. Voici l’état final."}</div>`;
    else head = `<div class="step-now"><span class="lbl">▶ Prochaine ligne : ${s.line}</span><span>${highlight(lines[s.line - 1].trim())}</span></div>`;
    let auto = "";
    if (!s.marker && !s.end) {
      const m = run.meta[s.id]; auto = m.desc;
      if (m.kind === "if") auto += s.result ? " → **true** : JavaScript entre dans le bloc du if." : " → **false** : " + (m.altIf ? "JavaScript passe au test suivant (else if)." : m.alt ? "JavaScript passe au bloc else." : "JavaScript saute le bloc.");
    }
    const note = !s.marker && !s.end && L.notes && L.notes[s.line] ? L.notes[s.line] : "";
    const changed = new Set(), fresh = new Set();
    if (prev) for (const k of Object.keys(s.vars)) { if (!(k in prev.vars)) fresh.add(k); else if (fmt(prev.vars[k], false) !== fmt(s.vars[k], false)) changed.add(k); }
    let effect = "";
    if (prev && !prev.marker && prev.line) {
      const what = [...fresh].map(k => "`" + k + "` apparaît").concat([...changed].map(k => "`" + k + "` change")).concat(s.logs > prev.logs ? ["la console affiche quelque chose"] : []);
      effect = `<p class="step-auto">Effet de la ligne ${prev.line} : ${what.length ? md(what.join(", ")) : "rien de visible dans la mémoire ni la console."}</p>`;
    }
    const logs = run.logs.slice(0, s.logs).map((e, k) => `<div class="log ${prev && k >= prev.logs ? "live" : ""}"><span class="log-arrow">›</span><span>${e.html}</span></div>`).join("") || `<p class="empty" style="margin:0">Rien pour l’instant.</p>`;
    box.innerHTML = `<div class="stepper" tabindex="-1">
      <div class="step-bar">
        <button class="btn btn-small btn-ghost" type="button" data-st="first" ${i === 0 ? "disabled" : ""} aria-label="Début">⏮</button>
        <button class="btn btn-small" type="button" data-st="prev" ${i === 0 ? "disabled" : ""}>◀ Précédent</button>
        <span class="count">Étape ${i + 1} / ${steps.length}</span>
        <button class="btn btn-small btn-primary" type="button" data-st="next" ${i === steps.length - 1 ? "disabled" : ""}>Suivant ▶</button>
        <button class="btn btn-small btn-ghost" type="button" data-st="last" ${i === steps.length - 1 ? "disabled" : ""} aria-label="Fin">⏭</button>
      </div>
      ${head}
      <div class="step-desc">${auto ? `<p>${md(auto)}</p>` : ""}${note ? `<p class="step-note">${md(note)}</p>` : ""}${effect}</div>
      ${run.truncated && s.end ? `<p class="step-auto">Le pas à pas s’arrête après ${MAX_STEPS} étapes.</p>` : ""}
      <div class="step-grid">
        <div><p class="mini-label">Mémoire à ce moment</p><div class="memory">${memoryHTML(s.vars, run.preludeNames, changed, fresh) || `<p class="memory-note">Vide : aucune variable n’existe encore.</p>`}</div></div>
        <div><p class="mini-label">Console</p><div class="step-console">${logs}</div>${s.page != null ? `<p class="mini-label">Page</p><div class="page-snap"><div class="stage">${s.page}</div></div>` : ""}</div>
      </div>
    </div>`;
    if (s.end && run.error) box.querySelector(".stepper").appendChild(errorBox(run.error, errorLine(run.error, run.code, run.preludeLines), null, run.code));
    session.stepLine = s.line || null;
    const ta = $("#code"); if (ta && ta._paint && (L.type !== "fill")) { ta._paint(); scrollToLine(s.line); }
  };
  box.onclick = e => {
    const b = e.target.closest("[data-st]"); if (!b) return;
    const a = b.dataset.st;
    i = a === "first" ? 0 : a === "last" ? steps.length - 1 : a === "next" ? Math.min(steps.length - 1, i + 1) : Math.max(0, i - 1);
    draw();
    const nb = box.querySelector(`[data-st="${a}"]`); if (nb && !nb.disabled) nb.focus(); else box.querySelector(".stepper").focus();
  };
  box.onkeydown = e => { if (e.key === "ArrowRight") { i = Math.min(steps.length - 1, i + 1); draw(); e.preventDefault(); } else if (e.key === "ArrowLeft") { i = Math.max(0, i - 1); draw(); e.preventDefault(); } };
  draw();
}

/* =====================================================================
   QUESTIONS (observer, pourquoi ?)
   ===================================================================== */
function questionsHTML(qs, prefix) {
  return `<div class="questions">${qs.map((q, qi) => `
    <fieldset class="q" id="${prefix}-${qi}">
      <legend>Question ${qi + 1} / ${qs.length}</legend>
      <p class="q-text">${md(q.q)}</p>
      <div class="opts" role="radiogroup" aria-label="Question ${qi + 1}">${q.opts.map((o, oi) => `<button type="button" class="opt" role="radio" aria-checked="false" data-p="${prefix}" data-q="${qi}" data-o="${oi}">${md(o)}</button>`).join("")}</div>
      <p class="q-why" hidden></p>
    </fieldset>`).join("")}</div>`;
}
function bindQuestions(qs, prefix) {
  const store_ = prefix === "q" ? session.answers : session.checkAnswers;
  document.querySelectorAll(`.opt[data-p="${prefix}"]`).forEach(b => b.addEventListener("click", () => {
    const qi = +b.dataset.q; store_[qi] = +b.dataset.o;
    document.querySelectorAll(`.opt[data-p="${prefix}"][data-q="${qi}"]`).forEach(o => { o.setAttribute("aria-checked", String(o === b)); o.classList.remove("right", "wrong"); });
  }));
}
function gradeQuestions(qs, prefix, answers) {
  if (Object.keys(answers).length < qs.length) return null;
  let good = 0;
  qs.forEach((q, qi) => {
    const ok = answers[qi] === q.a; if (ok) good++;
    document.querySelectorAll(`.opt[data-p="${prefix}"][data-q="${qi}"]`).forEach(o => { o.classList.remove("right", "wrong"); if (+o.dataset.o === answers[qi]) o.classList.add(ok ? "right" : "wrong"); });
    const why = $(`#${prefix}-${qi} .q-why`); why.hidden = false;
    why.innerHTML = ok ? "<strong>Juste.</strong> " + md(q.why) : "<strong>Pas encore.</strong> Relis le code (ou le pas à pas) et réessaie.";
  });
  return good;
}
function checkObserve(L) {
  const good = gradeQuestions(L.questions, "q", session.answers);
  const msg = $("#q-msg");
  if (good === null) { msg.textContent = "Réponds d’abord à toutes les questions."; return; }
  session.attempts++;
  if (good === L.questions.length) { msg.textContent = "Tout est juste !"; setMood("happy"); setTimeout(() => success(L), 400); }
  else { msg.textContent = `${good} / ${L.questions.length}. Utilise le pas à pas pour vérifier, puis corrige.`; setMood("think"); }
}
function showCheck(L) {
  if (!L.check) { setTimeout(() => success(L), 300); return; }
  session.checkAnswers = {};
  $("#check-slot").innerHTML = `<section class="card check-card" id="check-card"><p class="card-kicker">Ça marche ! Dernière étape</p><h3>Explique pourquoi ton code marche</h3>${questionsHTML(L.check, "c")}<div class="quiz-foot"><button class="btn btn-primary" type="button" id="c-check">Valider</button><span id="c-msg" aria-live="polite"></span></div></section>`;
  bindQuestions(L.check, "c");
  $("#c-check").addEventListener("click", () => {
    const good = gradeQuestions(L.check, "c", session.checkAnswers); const msg = $("#c-msg");
    if (good === null) { msg.textContent = "Réponds à toutes les questions."; return; }
    if (good === L.check.length) { msg.textContent = "Parfait !"; setTimeout(() => success(L), 400); }
    else { session.checkWrong++; msg.textContent = "Ton code marche, mais une explication n’est pas juste. Relis ton code et réessaie."; }
  });
  $("#check-card").scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ---------- prédiction ---------- */
function predNorm(s) { return String(s).trim().replace(/^["'`«]\s*|\s*["'`»]$/g, "").replace(/\s+/g, " ").toLowerCase(); }
function checkPredict(L) {
  const ins = session.expected.map((_, i) => $("#pred-in-" + i).value);
  if (ins.some(v => v.trim() === "")) { $("#predict-msg").textContent = "Remplis toutes les lignes, même si tu n’es pas sûr."; return; }
  session.predictTries++;
  let good = 0;
  session.expected.forEach((exp, i) => {
    const ok = predNorm(ins[i]) === predNorm(exp); if (ok) good++;
    const row = $("#pred-" + i); row.className = "pred " + (ok ? "ok" : "ko");
    const res = $("#pred-res-" + i); res.hidden = false;
    res.innerHTML = ok ? `<span>✓ ${md(L.explain[i] || "")}</span>` : `<span>✗ Pas encore. ${session.predictTries >= 2 ? `La console affiche <span class="real">${esc(exp)}</span>. ${md(L.explain[i] || "")}` : "Utilise le pas à pas pour comprendre, puis corrige ta réponse."}</span>`;
  });
  const results = $("#predict-results"); results.hidden = false;
  const run = traceRun(L, L.code);
  if (L.stage != null) { const st = $("#stage"); st.innerHTML = L.stage; execute(L, L.code, null, st, {}); }
  selectTab("step"); renderStepper(run, L);
  const msg = $("#predict-msg");
  if (good === session.expected.length) { msg.textContent = "Prédiction parfaite !"; setMood("happy"); setTimeout(() => success(L), 600); }
  else { msg.textContent = `${good} / ${session.expected.length} lignes justes. Regarde le pas à pas, puis corrige et revérifie.`; setMood("think"); }
}

/* ---------- indices, solution formateur ---------- */
function showHint() {
  const L = current; if (session.hints >= L.hints.length) return;
  session.hints++;
  $("#help").hidden = false;
  $("#hint-list").innerHTML = L.hints.slice(0, session.hints).map(h => `<li>${md(h)}</li>`).join("");
  const left = L.hints.length - session.hints;
  const b = $("#hint"); b.textContent = left ? `Indice (${left})` : "Plus d’indice"; b.disabled = !left;
  $("#help").scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function teacherSolution() {
  const L = current; session.teacherUsed = true;
  if (L.type === "fill") { const parts = fillParts(L); document.querySelectorAll(".blank").forEach((b, k) => { b.value = parts[k * 2 + 1]; b.dispatchEvent(new Event("input")); }); return; }
  $("#help").hidden = false;
  $("#solution-box").hidden = false;
  $("#solution-box").innerHTML = `<p class="mini-label">Solution (formateur)</p><pre class="code-block">${highlight(L.solution)}</pre><button class="btn btn-small" type="button" id="copy-solution">Mettre dans l’éditeur</button>`;
  $("#solution-box").scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function teacherAnswers() {
  const L = current; session.teacherUsed = true;
  if (L.type === "observe") L.questions.forEach((q, qi) => { const b = $(`.opt[data-p="q"][data-q="${qi}"][data-o="${q.a}"]`); if (b) b.click(); });
  if (L.type === "predict") session.expected.forEach((e, i) => { $("#pred-in-" + i).value = e; });
}

/* =====================================================================
   RÉUSSITE
   ===================================================================== */
function success(L) {
  if (L.sandbox) return;
  let stars;
  if (L.type === "observe") stars = session.attempts <= 1 ? 3 : session.attempts === 2 ? 2 : 1;
  else if (L.type === "predict") stars = session.predictTries <= 1 ? 3 : session.predictTries === 2 ? 2 : 1;
  else if (L.type === "path") stars = session.mistakes === 0 ? 3 : session.mistakes <= 2 ? 2 : 1;
  else stars = Math.max(1, 3 - (session.hints > 0 ? 1 : 0) - (session.checkWrong > 0 ? 1 : 0));
  if (session.teacherUsed) stars = 1;
  const before = store.progress[L.id];
  const chBefore = chapterDone(L.ch);
  const allBefore = allMissionsDone();
  store.progress[L.id] = { stars: Math.max(before ? before.stars : 0, stars) };
  save(); updateStats();
  const delivered = !chBefore && chapterDone(L.ch);
  const all = LEVELS.every(l => isDone(l.id));
  const i = levelIndex(L.id), next = LEVELS[i + 1], ch = CHAPTERS.find(c => c.n === L.ch);
  refreshProjectNav();
  $("#dialog").innerHTML = `
    <div class="dialog-top">${bipSVG("happy")}<div><p class="card-kicker">Mission ${i + 1} réussie</p><h2 id="modal-title">${all ? "Stage validé !" : "Bien joué !"}</h2><div class="big-stars" aria-label="${stars} étoiles sur 3">${starsHTML(stars)}</div></div></div>
    ${delivered ? `<p class="new-piece">Projet livré au client ${esc(ch.client)} ! ${ch.n < 9 ? "Un nouveau client t’attend." : ""}</p>` : ""}
    ${all && !allBefore && !proj() ? `<div class="new-piece bonus-piece"><p><strong>Bonus débloqué : le projet portfolio.</strong> Tu as fait toutes les missions. Si tu veux, mets en application ce que tu as vu : trois clients de l’agence attendent un site, une appli ou une boutique, et tu codes tout le JavaScript.</p><button class="btn btn-small" type="button" id="modal-proj">Voir le projet bonus</button></div>` : ""}
    <div><p class="mini-label">Ce que tu as compris</p><p>${md(L.debrief)}</p></div>
    ${stars < 3 ? `<p style="color:var(--ink-soft);font-size:.92rem">${isCodeType(L) ? "3 étoiles : sans indice, et toutes les explications justes du premier coup." : "3 étoiles : tout juste du premier coup."} Tu peux rejouer la mission plus tard.</p>` : ""}
    <div class="dialog-actions">
      <button class="btn btn-ghost" type="button" id="modal-stay">Rester ici</button>
      ${next && !all ? `<button class="btn btn-primary" type="button" id="modal-next">Mission suivante →</button>` : `<button class="btn btn-primary" type="button" id="modal-map">Retour aux clients</button>`}
    </div>`;
  $("#modal").hidden = false;
  const close = () => { $("#modal").hidden = true; };
  $("#modal-stay").addEventListener("click", close);
  if ($("#modal-proj")) $("#modal-proj").addEventListener("click", () => { close(); showProject(); });
  if ($("#modal-next")) { $("#modal-next").addEventListener("click", () => { close(); openLevel(next.id); }); $("#modal-next").focus(); }
  if ($("#modal-map")) { $("#modal-map").addEventListener("click", () => { close(); showMap(); }); $("#modal-map").focus(); }
  confetti(delivered || all ? 160 : 70);
}
function confetti(n) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = $("#confetti"); cv.hidden = false;
  const ctx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
  const colors = ["#FFC93C", "#FF6B4A", "#3D7BF7", "#138A5B", "#1B2440"];
  const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * 6 }));
  const t0 = performance.now();
  const tick = t => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .45; p.a += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (t - t0 < 1800) requestAnimationFrame(tick); else { ctx.clearRect(0, 0, cv.width, cv.height); cv.hidden = true; }
  };
  requestAnimationFrame(tick);
}

/* =====================================================================
   CARNET
   ===================================================================== */
function showNotebook() {
  current = null; setHash("carnet");
  const items = LEVELS.map((l, i) => ({ l, i })).filter(o => o.l.lesson);
  $("#view-notebook").innerHTML = `
    <div class="section-title"><div><p class="kicker">Antisèche</p><h2>Mon carnet</h2></div><p>Les schémas de toutes les notions, puis chaque notion débloquée : comment ça s’écrit, où on la voit, pourquoi elle existe.</p></div>
    <details class="card schema-gallery" open><summary><span class="card-kicker">Tous les schémas (${DIAGRAM_ORDER.length})</span></summary><div class="schema-grid">${DIAGRAM_ORDER.map(diagramHTML).join("")}</div></details>
    <div class="notebook">${items.map(({ l, i }) => {
      if (!isUnlocked(i)) return `<div class="note locked"><p class="card-kicker">Mission ${i + 1}</p><h3>${esc(l.notion)}</h3><p>À débloquer en jouant.</p></div>`;
      const ch = CHAPTERS.find(c => c.n === l.ch);
      return `<div class="note"><p class="card-kicker">Mission ${i + 1} · ${esc(ch.client)}</p><h3>${esc(l.notion)}</h3><p>${md(l.lesson.what)}</p>${(l.diagrams || []).slice(0, 1).map(diagramHTML).join("")}<pre class="code-block">${highlight(l.lesson.code)}</pre><dl class="pieces">${l.lesson.pieces.map(([k, d]) => `<div><dt><code>${esc(k)}</code></dt><dd>${md(d)}</dd></div>`).join("")}</dl><div class="why-box"><p class="mini-label">Où on le voit</p><p>${md(l.where.text)}</p></div><div class="trap"><p class="mini-label">Piège</p><p>${md(l.lesson.trap)}</p></div></div>`;
    }).join("")}</div>
    <section class="prof">
      <p class="card-kicker">Options</p>
      ${store.teacher ? `<p><strong>Mode formateur actif</strong> : toutes les missions sont ouvertes, les solutions et réponses sont visibles, le collage est autorisé.</p><div><button class="btn btn-small" type="button" id="teacher-off">Quitter le mode formateur</button></div>`
        : `<label for="teacher-code" style="display:grid;gap:6px">Code formateur<span style="display:flex;gap:8px;flex-wrap:wrap"><input id="teacher-code" class="teacher-input" type="password" autocomplete="off"><button class="btn btn-small" type="button" id="teacher-on">Activer</button></span></label><p id="teacher-msg" style="font-size:.9rem;color:var(--ink-soft)">Le mode formateur ouvre toutes les missions et affiche les solutions.</p>`}
      <div><button class="btn btn-small btn-ghost" type="button" id="reset-all">Effacer ma progression</button></div>
      <p style="font-size:.9rem;color:var(--ink-soft)">La progression est enregistrée dans ce navigateur uniquement.</p>
    </section>`;
  setView("notebook");
  if ($("#teacher-on")) $("#teacher-on").addEventListener("click", () => { if ($("#teacher-code").value.trim().toLowerCase() === TEACHER_CODE) { store.teacher = true; save(); showNotebook(); toast("Mode formateur activé."); } else $("#teacher-msg").textContent = "Code incorrect."; });
  if ($("#teacher-off")) $("#teacher-off").addEventListener("click", () => { store.teacher = false; save(); showNotebook(); });
  $("#reset-all").addEventListener("click", e => twoStep(e.currentTarget, "Sûr ? Clique encore", () => { store = { progress: {}, drafts: {}, teacher: store.teacher }; save(); updateStats(); showNotebook(); }));
  updateStats();
}
function twoStep(btn, ask, action) {
  if (btn.classList.contains("confirming")) { btn.classList.remove("confirming"); btn.textContent = btn.dataset.label; action(); return; }
  btn.dataset.label = btn.textContent; btn.textContent = ask; btn.classList.add("confirming");
  setTimeout(() => { if (btn.classList.contains("confirming")) { btn.classList.remove("confirming"); btn.textContent = btn.dataset.label; } }, 4000);
}

/* =====================================================================
   MISSIONS « CHEMIN » : les données en boîtes, le trajet du chemin
   ===================================================================== */
const clone = v => JSON.parse(JSON.stringify(v));
const sameKeys = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function toJS(v, ind) {
  ind = ind || 0;
  const pad = "  ".repeat(ind + 1), end = "  ".repeat(ind);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    const inner = v.map(x => toJS(x, ind + 1)); const one = "[" + inner.join(", ") + "]";
    if (one.length < 60 && !v.some(x => x && typeof x === "object")) return one;
    if (one.length < 70 && v.every(x => x && typeof x === "object" && !Object.values(x).some(y => y && typeof y === "object"))) return one;
    return "[\n" + inner.map(x => pad + x).join(",\n") + "\n" + end + "]";
  }
  if (v && typeof v === "object") {
    const e = Object.entries(v); const inner = e.map(([k, x]) => k + ": " + toJS(x, ind + 1)); const one = "{ " + inner.join(", ") + " }";
    if (one.length < 64 && !e.some(([, x]) => x && typeof x === "object")) return one;
    return "{\n" + inner.map(x => pad + x).join(",\n") + "\n" + end + "}";
  }
  return JSON.stringify(v);
}
function pathStr(root, keys) { return root + keys.map(k => typeof k === "number" ? "[" + k + "]" : "." + k).join(""); }
function matchClose(s, start) {
  let d = 0;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (c === "\"" || c === "'") { const q = c; i++; while (i < s.length && s[i] !== q) i++; continue; }
    if (c === "[" || c === "(") d++;
    else if (c === "]" || c === ")") { d--; if (d === 0) return i; }
  }
  return -1;
}
function parsePath(src) {
  src = src.trim();
  const m = src.match(/^[A-Za-z_$][\w$]*/);
  if (!m) return { error: "Un chemin commence par le nom de la variable, par exemple `boutique`." };
  const segs = [{ t: "root", name: m[0], code: m[0] }];
  let rest = src.slice(m[0].length);
  while (rest.trim().length) {
    rest = rest.replace(/^\s+/, "");
    let mm;
    if ((mm = rest.match(/^\.\s*([A-Za-z_$][\w$]*)/))) { segs.push({ t: "prop", key: mm[1], code: "." + mm[1] }); rest = rest.slice(mm[0].length); continue; }
    if (rest[0] === "[") {
      const e = matchClose(rest, 0);
      if (e < 0) return { error: "Il manque un `]` pour fermer le crochet." };
      const inner = rest.slice(1, e).trim(); const q = inner.match(/^["']([^"']*)["']$/);
      segs.push(q ? { t: "prop", key: q[1], code: rest.slice(0, e + 1) } : { t: "index", expr: inner, code: rest.slice(0, e + 1) });
      rest = rest.slice(e + 1); continue;
    }
    if (rest[0] === "(") return { error: "Ici on écrit un chemin : enlève les parenthèses `( )`." };
    if (rest[0] === "=") return { error: "Pour **lire** une donnée, pas besoin de `=`. Le `=` sert à modifier." };
    return { error: "Je ne comprends pas « " + rest + " ». Un chemin s’écrit avec des points (`.nom`) et des crochets (`[0]`)." };
  }
  return { segs };
}
function evalIndex(expr, ctx) {
  if (/^\d+$/.test(expr)) return { value: +expr };
  if (/^-\s*\d+$/.test(expr)) return { error: "Pas de numéro négatif en JavaScript (`[-1]` ne marche pas). Pour le dernier : `[tableau.length - 1]`." };
  const m = expr.match(/^(.+?)\.length\s*(?:([-+])\s*(\d+))?$/);
  if (m) {
    const r = walkPath(m[1], ctx);
    if (r.error) return { error: r.error };
    if (!Array.isArray(r.value)) return { error: "`" + m[1] + "` n’est pas un tableau : il n’a pas de length utilisable ici." };
    let v = r.value.length; if (m[2]) v = m[2] === "-" ? v - +m[3] : v + +m[3];
    return { value: v, usesLength: true };
  }
  return { error: "Entre crochets : un numéro (0, 1, 2…) ou un calcul avec length, comme `[liste.length - 1]`." };
}
function describeValue(v) {
  if (Array.isArray(v)) return "un **tableau** de " + v.length + " élément" + (v.length > 1 ? "s" : "") + (v.length ? " (cases 0 à " + (v.length - 1) + ")" : "") + " → la suite s’écrit avec `[numéro]`";
  if (v && typeof v === "object") return "un **objet** (étiquettes : " + Object.keys(v).map(k => "`" + k + "`").join(", ") + ") → la suite s’écrit avec `.etiquette`";
  return "la valeur `" + fmt(v, false) + "`";
}
function walkPath(src, ctx) {
  const p = parsePath(src); if (p.error) return p;
  const segs = p.segs, trail = [];
  if (segs[0].name !== ctx.root) return { error: "`" + segs[0].name + "` n’existe pas. La variable s’appelle `" + ctx.root + "`.", trail };
  let cur = ctx.data, keys = [], usesLength = false;
  trail.push({ code: segs[0].code, keys: [], value: cur });
  const here = () => trail.map(t => t.code).join("");
  for (let i = 1; i < segs.length; i++) {
    const s = segs[i];
    if (cur === undefined || cur === null || typeof cur !== "object") return { error: "Impossible d’aller plus loin que `" + here() + "` : c’est déjà " + describeValue(cur) + ".", trail };
    if (s.t === "prop") {
      if (Array.isArray(cur)) {
        if (s.key === "length") { keys = [...keys, "length"]; cur = cur.length; trail.push({ code: s.code, keys, value: cur }); continue; }
        return { error: "`" + here() + "` est un **tableau** : choisis d’abord une case avec `[numéro]` avant `" + s.code + "`.", trail };
      }
      if (!(s.key in cur)) return { error: "L’étiquette `" + s.key + "` n’existe pas dans `" + here() + "`. Étiquettes disponibles : " + Object.keys(cur).map(k => "`" + k + "`").join(", ") + ". (Les majuscules comptent.)", trail };
      keys = [...keys, s.key]; cur = cur[s.key];
    } else {
      const ix = evalIndex(s.expr, ctx);
      if (ix.error) return { error: ix.error, trail };
      if (ix.usesLength) usesLength = true;
      if (!Array.isArray(cur)) return { error: "`" + here() + "` est un **objet** : on l’ouvre avec `.etiquette`, pas avec `[" + s.expr + "]`.", trail };
      if (ix.value < 0 || ix.value >= cur.length) return { error: "La case `[" + ix.value + "]` n’existe pas : ce tableau a " + cur.length + " élément" + (cur.length > 1 ? "s" : "") + ", numérotés de 0 à " + (cur.length - 1) + ". Le dernier, c’est `[" + (cur.length - 1) + "]`, c’est-à-dire `[length - 1]`.", trail };
      keys = [...keys, ix.value]; cur = cur[ix.value];
    }
    trail.push({ code: s.code, keys, value: cur });
  }
  return { value: cur, keys, trail, usesLength };
}
function findAssign(s) {
  let q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === "\"" || c === "'") { q = c; continue; }
    if (c === "=" && s[i + 1] !== "=" && !"=!<>".includes(s[i - 1] || "")) return i;
  }
  return -1;
}
function splitTop(s) {
  const out = []; let d = 0, q = null, cur = "";
  for (const c of s) {
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === "\"" || c === "'") { q = c; cur += c; continue; }
    if ("[({".includes(c)) d++; if ("])}".includes(c)) d--;
    if (c === "," && d === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function parseLiteral(src) {
  const s = src.trim();
  if (s === "") return { error: "Il manque la valeur." };
  try { return { value: JSON.parse(s) }; } catch (e) { /* on essaie la syntaxe JS */ }
  try {
    const j = s.replace(/'([^'\\]*)'/g, (m, a) => JSON.stringify(a)).replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, "$1\"$2\":");
    return { value: JSON.parse(j) };
  } catch (e) {
    if (/^[A-Za-zÀ-ÿ]/.test(s) && !/^(true|false|null)$/.test(s)) return { error: "`" + s + "` sans guillemets : JavaScript croit que c’est une variable. Un texte s’écrit entre guillemets : `\"" + s + "\"`." };
    return { error: "Valeur incomprise. Écris un texte entre guillemets, un nombre, `true`/`false`, ou un objet `{ nom: \"…\", prix: 2 }`." };
  }
}
function parseCommand(src) {
  const s = src.trim().replace(/;\s*$/, "");
  let m;
  if ((m = s.match(/^delete\s+([\s\S]+)$/))) return { kind: "delete", path: m[1] };
  if ((m = s.match(/^([\s\S]+?)\.push\s*\(([\s\S]*)\)$/))) return { kind: "push", path: m[1], arg: m[2] };
  if ((m = s.match(/^([\s\S]+?)\.splice\s*\(([\s\S]*)\)$/))) return { kind: "splice", path: m[1], args: splitTop(m[2]) };
  const eq = findAssign(s);
  if (eq >= 0) return { kind: "set", path: s.slice(0, eq).trim(), arg: s.slice(eq + 1).trim() };
  return { kind: "get", path: s };
}
const MODE_HELP = {
  get: "Ici on veut **lire** : écris seulement le chemin, sans `=`, sans `push`.",
  set: "Ici on veut **modifier** : écris le chemin, puis `= nouvelle valeur`.",
  push: "Ici on veut **ajouter** dans un tableau : `chemin_du_tableau.push(valeur)`.",
  splice: "Ici on veut **supprimer une case** d’un tableau : `chemin_du_tableau.splice(index, 1)`.",
  delete: "Ici on veut **supprimer une étiquette** d’un objet : `delete chemin`."
};
function expectedAnswer(L, task) {
  const ws = session.pathData, root = L.root;
  const getAt = keys => keys.reduce((v, k) => v[k], ws);
  if (task.mode === "get") {
    if (task.requireLength) { const parent = task.target.slice(0, -1); const ps = pathStr(root, parent); return ps + "[" + ps + ".length - 1]"; }
    return pathStr(root, task.target);
  }
  if (task.mode === "set") return pathStr(root, task.target) + " = " + toJS(task.value);
  if (task.mode === "push") return pathStr(root, task.target) + ".push(" + toJS(task.value) + ")";
  if (task.mode === "splice") { const ps = pathStr(root, task.target); const idx = task.index === "last" ? ps + ".length - 1" : task.index; return ps + ".splice(" + idx + ", 1)"; }
  if (task.mode === "delete") return "delete " + pathStr(root, task.target);
  return "";
}
function taskTargetKeys(task) {
  if (task.mode === "splice") { const arr = task.target.reduce((v, k) => v[k], session.pathData); return [...task.target, task.index === "last" ? arr.length - 1 : task.index]; }
  return task.target;
}

function pathBenchHTML(L) {
  return `<section class="card mission path-card" id="path-card">
      <p class="card-kicker" id="path-count"></p>
      <p class="q-text" id="path-q"></p>
      <label for="path-in" class="mini-label">Ton chemin</label>
      <div class="path-row"><input id="path-in" class="path-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="${esc(L.root)}…"><button class="btn btn-primary" type="button" id="path-go">Suivre le chemin</button></div>
      <div id="path-feedback" aria-live="polite"></div>
      ${store.teacher ? `<div class="quiz-foot"><button class="btn btn-small btn-ghost" type="button" id="teacher-path">Réponse (formateur)</button></div>` : ""}
    </section>
    <section class="card"><p class="card-kicker">Les données de <code>${esc(L.root)}</code> · <span class="lg lg-target">cible</span> <span class="lg lg-on">ton trajet</span></p><div class="tree" id="tree"></div>
      <details class="data-code"><summary>Voir les mêmes données écrites en code</summary><pre class="code-block" id="data-code"></pre><p class="page-note"><code>{ }</code> = un objet (on continue avec un point), <code>[ ]</code> = un tableau (on continue avec un crochet).</p></details></section>
    <section class="card"><p class="card-kicker">Les tâches</p><ol class="task-list" id="task-list"></ol></section>`;
}
function treeHTML(v, keys) {
  const k = esc(JSON.stringify(keys));
  if (Array.isArray(v)) {
    return `<div class="tn tn-arr"><div class="tn-head"><span class="tn-kind">[ ] tableau</span><span class="tn-len" data-k="${esc(JSON.stringify([...keys, "length"]))}">length : ${v.length}</span></div><div class="tn-body">${v.map((x, i) => `<div class="tn-row" data-k="${esc(JSON.stringify([...keys, i]))}"><span class="tn-idx">[${i}]</span>${treeHTML(x, [...keys, i])}</div>`).join("") || `<span class="tn-empty">vide</span>`}</div></div>`;
  }
  if (v && typeof v === "object") {
    return `<div class="tn tn-obj"><div class="tn-head"><span class="tn-kind">{ } objet</span></div><div class="tn-body">${Object.entries(v).map(([kk, x]) => `<div class="tn-row" data-k="${esc(JSON.stringify([...keys, kk]))}"><span class="tn-key">.${esc(kk)}</span>${treeHTML(x, [...keys, kk])}</div>`).join("")}</div></div>`;
  }
  return `<span class="tn-val">${fmtHTML(v, false)}</span>`;
}
function nodeEl(keys) { const want = JSON.stringify(keys); return [...document.querySelectorAll("#tree [data-k]")].find(e => e.getAttribute("data-k") === want) || null; }
function renderTree(L) {
  $("#tree").innerHTML = `<div class="tn-row tn-root" data-k="[]"><span class="tn-key tn-rootname">${esc(L.root)}</span>${treeHTML(session.pathData, [])}</div>`;
  $("#data-code").innerHTML = highlight("const " + L.root + " = " + toJS(session.pathData) + ";");
  const task = L.tasks[session.taskIndex];
  if (task) { const el = nodeEl(taskTargetKeys(task)); if (el) el.classList.add(task.mode === "splice" || task.mode === "delete" ? "tn-target-del" : "tn-target"); }
}
function renderTasks(L) {
  $("#task-list").innerHTML = L.tasks.map((t, i) => `<li class="${i < session.taskIndex ? "done" : i === session.taskIndex ? "cur" : ""}"><span class="type-dot">${{ get: "Lire", set: "Modifier", push: "Ajouter", splice: "Supprimer", delete: "Supprimer" }[t.mode]}</span> ${md(t.q)}${i < session.taskIndex && session.answersLog[i] ? `<br><code>${esc(session.answersLog[i])}</code>` : ""}</li>`).join("");
  const t = L.tasks[session.taskIndex];
  if (!t) { $("#path-count").textContent = "Toutes les tâches sont faites"; $("#path-q").innerHTML = "Bravo !"; $("#path-in").disabled = true; $("#path-go").disabled = true; return; }
  $("#path-count").textContent = `Tâche ${session.taskIndex + 1} / ${L.tasks.length} · ${{ get: "Lire", set: "Modifier", push: "Ajouter", splice: "Supprimer", delete: "Supprimer" }[t.mode]}`;
  $("#path-q").innerHTML = md(t.q);
}
function setupPath(L) {
  session.pathData = clone(L.data); session.taskIndex = 0; session.mistakes = 0; session.answersLog = [];
  renderTree(L); renderTasks(L);
  const inp = $("#path-in");
  blockPaste(inp);
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); runPath(L); } });
  $("#path-go").addEventListener("click", () => runPath(L));
  if ($("#teacher-path")) $("#teacher-path").addEventListener("click", () => { session.teacherUsed = true; inp.value = expectedAnswer(L, L.tasks[session.taskIndex]); inp.focus(); });
}
function animateTrail(trail, finalCls) {
  document.querySelectorAll("#tree .tn-on, #tree .tn-hit, #tree .tn-err").forEach(e => e.classList.remove("tn-on", "tn-hit", "tn-err"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  trail.forEach((t, i) => {
    const go = () => { const el = nodeEl(t.keys); if (!el) return; el.classList.add("tn-on"); if (i === trail.length - 1) { el.classList.add(finalCls); el.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); } };
    if (reduce) go(); else setTimeout(go, i * 380);
  });
}
function trailHTML(trail) {
  return `<ol class="trail">${trail.map((t, i) => `<li><code>${esc(i === 0 ? t.code : t.code)}</code> → ${md(describeValue(t.value))}</li>`).join("")}</ol>`;
}
function runPath(L) {
  const task = L.tasks[session.taskIndex]; if (!task) return;
  const input = $("#path-in").value; const fb = $("#path-feedback");
  if (!input.trim()) { fb.innerHTML = `<p class="pf pf-ko">Écris d’abord un chemin, en commençant par <code>${esc(L.root)}</code>.</p>`; return; }
  const ctx = { root: L.root, data: session.pathData };
  const cmd = parseCommand(input);
  const fail = (msg, trail) => { session.mistakes++; setMood("think"); if (trail && trail.length) animateTrail(trail, "tn-err"); fb.innerHTML = (trail && trail.length ? `<p class="mini-label">Ton trajet</p>${trailHTML(trail)}` : "") + `<p class="pf pf-ko">${md(msg)}</p>`; };
  if (cmd.kind !== task.mode) return fail(MODE_HELP[task.mode]);
  let r, ok = false, apply = null;
  if (task.mode === "get") {
    r = walkPath(cmd.path, ctx); if (r.error) return fail(r.error, r.trail);
    if (!sameKeys(r.keys, task.target)) { session.mistakes++; setMood("think"); animateTrail(r.trail, "tn-err"); fb.innerHTML = `<p class="mini-label">Ton trajet</p>${trailHTML(r.trail)}<p class="pf pf-ko">Ton chemin marche, mais il arrive sur la case en orange, pas sur la cible verte. Compare les deux et ajuste.</p>`; return; }
    if (task.requireLength && !r.usesLength) return fail("C’est la bonne case, mais tu as écrit son numéro à la main. Utilise `length - 1` entre les crochets, pour que le chemin vise toujours le dernier même si le tableau grandit.", r.trail);
    ok = true;
  } else if (task.mode === "set" || task.mode === "delete") {
    const p = parsePath(cmd.path); if (p.error) return fail(p.error);
    const last = p.segs[p.segs.length - 1];
    if (p.segs.length < 2) return fail("Il faut un chemin jusqu’à une étiquette ou une case, pas la variable entière.");
    const parentSrc = p.segs.slice(0, -1).map(x => x.code).join("");
    const pr = walkPath(parentSrc, ctx); if (pr.error) return fail(pr.error, pr.trail);
    const parent = pr.value; let key;
    if (last.t === "prop") { if (Array.isArray(parent)) return fail("`" + parentSrc + "` est un **tableau** : on vise une case avec `[numéro]`.", pr.trail); key = last.key; }
    else { const ix = evalIndex(last.expr, ctx); if (ix.error) return fail(ix.error, pr.trail); if (!Array.isArray(parent)) return fail("`" + parentSrc + "` est un **objet** : on vise une étiquette avec `.nom`.", pr.trail); if (ix.value >= parent.length) return fail("La case `[" + ix.value + "]` n’existe pas : les cases vont de 0 à " + (parent.length - 1) + ".", pr.trail); key = ix.value; }
    const keys = [...pr.keys, key];
    const trail = [...pr.trail, { code: last.code, keys, value: parent[key] }];
    if (task.mode === "delete") {
      if (!(key in parent)) return fail("L’étiquette `" + key + "` n’existe pas : rien à supprimer.", pr.trail);
      if (!sameKeys(keys, task.target)) return fail("Ce chemin vise une autre donnée que celle encadrée en rouge.", trail);
      r = { trail }; ok = true; apply = () => { delete parent[key]; };
    } else {
      if (!sameKeys(keys, task.target)) { if (!(key in parent)) return fail("L’étiquette `" + key + "` n’existe pas ici : ce chemin la **créerait**. Vérifie l’orthographe, ou le chemin vers la cible verte.", pr.trail); return fail("Ce chemin modifierait la case en orange, pas la cible verte.", trail); }
      const lit = parseLiteral(cmd.arg); if (lit.error) return fail(lit.error);
      if (JSON.stringify(lit.value) !== JSON.stringify(task.value)) return fail("Bon chemin ! Mais la valeur n’est pas celle demandée : " + "`" + toJS(task.value) + "`" + (typeof task.value === "string" && typeof lit.value !== "string" ? " (un texte : avec des guillemets)." : "."), trail);
      r = { trail }; ok = true; apply = () => { parent[key] = lit.value; };
    }
  } else if (task.mode === "push") {
    r = walkPath(cmd.path, ctx); if (r.error) return fail(r.error, r.trail);
    if (!Array.isArray(r.value)) return fail("`push` s’utilise sur un **tableau**. Ici, `" + cmd.path.trim() + "` est " + describeValue(r.value) + ".", r.trail);
    if (!sameKeys(r.keys, task.target)) return fail("Ce n’est pas le bon tableau : vise celui encadré en vert.", r.trail);
    const lit = parseLiteral(cmd.arg); if (lit.error) return fail(lit.error, r.trail);
    if (JSON.stringify(lit.value) !== JSON.stringify(task.value)) return fail("Bon tableau ! Mais la valeur ajoutée doit être `" + toJS(task.value) + "`.", r.trail);
    ok = true; const arr = r.value; apply = () => { arr.push(lit.value); };
  } else if (task.mode === "splice") {
    r = walkPath(cmd.path, ctx); if (r.error) return fail(r.error, r.trail);
    if (!Array.isArray(r.value)) return fail("`splice` s’utilise sur un **tableau**. Ici, `" + cmd.path.trim() + "` est " + describeValue(r.value) + ".", r.trail);
    if (!sameKeys(r.keys, task.target)) return fail("Ce n’est pas le bon tableau : la case à supprimer (en rouge) est dans un autre tableau.", r.trail);
    if (cmd.args.length !== 2) return fail("`splice` a besoin de deux nombres : `splice(index, 1)`. Le premier dit **où**, le second **combien** enlever.", r.trail);
    if (cmd.args[1] !== "1") return fail("Le 2e nombre de `splice` dit combien d’éléments enlever : ici, `1`.", r.trail);
    const ix = evalIndex(cmd.args[0], ctx); if (ix.error) return fail(ix.error, r.trail);
    const want = task.index === "last" ? r.value.length - 1 : task.index;
    if (ix.value !== want) return fail("La case `[" + ix.value + "]` contient " + (ix.value < r.value.length ? "`" + fmt(r.value[ix.value], false) + "`" : "rien") + ". Celle à supprimer (en rouge) est en `[" + want + "]`.", r.trail);
    if (task.requireLength && !ix.usesLength) return fail("C’est la bonne case, mais écris-la avec `length - 1` : ce code doit marcher même si la liste change de taille.", r.trail);
    ok = true; const arr = r.value; apply = () => { arr.splice(want, 1); };
  }
  if (!ok) return;
  animateTrail(r.trail, "tn-hit");
  const after = () => {
    if (apply) apply();
    session.answersLog[session.taskIndex] = input.trim();
    session.taskIndex++;
    setMood("happy");
    fb.innerHTML = `<p class="mini-label">Ton trajet</p>${trailHTML(r.trail)}<p class="pf pf-ok"><strong>Juste !</strong> ${md(task.explain || "")}</p>`;
    $("#path-in").value = "";
    renderTree(L); renderTasks(L);
    if (apply) { const el = nodeEl(task.mode === "push" ? [...task.target, "length"] : task.target); if (el) el.classList.add("tn-new"); }
    if (session.taskIndex >= L.tasks.length) setTimeout(() => success(L), 900);
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(after, reduce ? 0 : Math.min(r.trail.length * 380 + 250, 2400));
}

/* =====================================================================
   ESPACE « MON PROJET » (bonus, ouvert quand toutes les missions sont faites)
   ===================================================================== */
const STEP_CACHE = {};
const projSteps = type => STEP_CACHE[type] || (STEP_CACHE[type] = projectSteps(type));
function migrateProject() {
  const p = store.projet; if (!p || p.v === 2 || !PROJECT_TYPES[p.type]) return;
  const P = PROJECT_TYPES[p.type];
  p.files.html = P.html; p.files.css = P.css; p.v = 2;
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* sans sauvegarde */ }
}
migrateProject();
const proj = () => store.projet || null;
const allMissionsDone = () => LEVELS.every(l => isDone(l.id));
const projectOpen = () => !!(store.teacher || allMissionsDone() || proj());
function refreshProjectNav() { const b = $("#nav-project"); if (b) b.hidden = !projectOpen(); }
const stepDone = n => !!(proj() && proj().steps && proj().steps[n]);
const allStepsDone = () => !!proj() && projSteps(proj().type).every(s => stepDone(s.n));
function stepUnlocked(n) {
  const p = proj(); if (!p) return false;
  if (store.teacher) return true;
  if (n === 8) return allStepsDone();
  return n === 1 || stepDone(n - 1);
}
function nextStepNumber() {
  const p = proj(); if (!p) return 1;
  const s = projSteps(p.type).find(x => !stepDone(x.n));
  return s ? s.n : 8;
}
function missionLabel(id) { const i = levelIndex(id); const l = LEVELS[i]; return l ? "mission " + (i + 1) + " « " + l.title + " » (" + chLabel(l.ch) + " · " + CHAPTERS.find(c => c.n === l.ch).client + ")" : id; }
const PROJECT_LEVEL = () => ({ id: "projet", type: "project", stage: proj().files.html, prelude: "" });

/* ---------- coloration HTML / CSS ---------- */
function hlHTML(src) {
  const re = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][\w-]*)|("[^"]*")|(\s[a-zA-Z-]+(?==))|(\/?>)/g;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) { out += esc(src.slice(last, m.index)); const cls = m[1] ? "c" : m[2] ? "k" : m[3] ? "s" : m[4] ? "p" : "k"; out += `<span class="t-${cls}">${esc(m[0])}</span>`; last = re.lastIndex; }
  return out + esc(src.slice(last));
}
function hlCSS(src) {
  const re = /(\/\*[\s\S]*?\*\/)|("[^"]*")|(--[\w-]+)|(#[0-9a-fA-F]{3,8}\b)|([a-z-]+)(?=\s*:[^:])|(\b\d+(?:\.\d+)?(?:px|rem|em|%|s|fr|vh)?\b)|([.#][\w-]+)|(@[\w-]+)|([{}])/g;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) { out += esc(src.slice(last, m.index)); const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "p" : m[4] ? "n" : m[5] ? "p" : m[6] ? "n" : m[7] ? "f" : m[8] ? "k" : "b0"; out += `<span class="t-${cls}">${esc(m[0])}</span>`; last = re.lastIndex; }
  return out + esc(src.slice(last));
}

/* ---------- choix du projet ---------- */
function showProject(n) {
  if (!projectOpen()) { toast("Le projet bonus s’ouvre quand tu as terminé les " + LEVELS.length + " missions."); return showMap(); }
  current = { id: "projet", type: "project" };
  setHash("projet");
  $("#view-level").innerHTML = "";
  const p = proj();
  if (!p) return showProjectChoice();
  openStep(n || nextStepNumber());
}
function clientBriefHTML(P, open) {
  const keys = Object.keys(P.content[0]);
  return `<details class="pbrief" ${open ? "open" : ""}><summary><span class="mini-label">Brief client</span> <b>${esc(P.label)}</b> · ${esc(P.brandSlogan)}</summary>
    <p>${esc(P.client)}</p>
    <dl class="pbrief-facts"><div><dt>Nom</dt><dd><code>${esc(P.brand)}</code></dd></div><div><dt>Slogan</dt><dd><code>${esc(P.brandSlogan)}</code></dd></div><div><dt>Catégories</dt><dd>${P.categories.map(c => `<code>${esc(c)}</code>`).join(" ")}</dd></div></dl>
    <p class="mini-label">Les contenus envoyés par le client</p>
    <div class="pbrief-scroll"><table class="pbrief-table"><thead><tr>${keys.map(k => `<th>${esc(k)}</th>`).join("")}</tr></thead><tbody>${P.content.map(it => `<tr>${keys.map(k => `<td>${esc(typeof it[k] === "boolean" ? (it[k] ? "true (fait)" : "false") : String(it[k]))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <p class="page-note">À toi de transformer ce tableau en tableau d’objets JavaScript, en tapant le code toi-même.</p></details>`;
}
function showProjectChoice() {
  $("#view-project").innerHTML = `
    <div class="level-head"><button class="btn btn-small btn-ghost" type="button" data-go="map">← Clients</button><div class="level-title"><span class="where">Bonus · projet portfolio</span><h2>Choisis ton projet</h2></div></div>
    <div class="says" style="max-width:820px;margin-bottom:20px"><div>${bipSVG()}</div><p class="bubble">Trois clients de l’agence attendent leur projet. Le <strong>HTML</strong> et le <strong>CSS</strong> sont déjà faits par l’équipe design : toi, tu codes <strong>tout le JavaScript</strong>, étape par étape, avec chaque notion vue dans les missions. À la fin : un projet qui marche vraiment, à mettre dans ton portfolio, et une fiche qui explique ce que tu as codé. Essaie les démos ci-dessous : c’est le résultat final.</p></div>
    <div class="proj-choices">${Object.entries(PROJECT_TYPES).map(([k, P]) => `
      <article class="chap proj-choice">
        <div class="demo-wrap"><div class="demo-bar"><span class="mini-label">Démo · le résultat final</span><span>clique, filtre, teste</span></div><div class="demo-host" data-demo="${k}"></div></div>
        <p class="client-kind">${esc(P.kind)}</p>
        <h3>${esc(P.label)}</h3>
        <p><strong>${esc(P.brandSlogan)}.</strong> ${esc(P.client)}</p>
        <div><p class="mini-label">Ce que ton JavaScript va faire</p><ul class="proj-list">${P.features.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>
        <button class="btn btn-primary" type="button" data-choose="${k}">Je prends ${esc(P.label)}</button>
      </article>`).join("")}</div>
    <p class="rule" style="margin-top:20px"><b>Bon à savoir</b> Dans le jeu, le HTML et le CSS sont en lecture seule : lis-les pour trouver les classes et les id dont ton JS a besoin. À la fin, dans VS Code, tu pourras changer les couleurs pour ton portfolio. Tu peux changer de projet plus tard, mais tu repartiras de zéro.</p>`;
  setView("project");
  document.querySelectorAll("[data-demo]").forEach(mountDemo);
}
function mountDemo(host) {
  const P = PROJECT_TYPES[host.dataset.demo];
  const root = host.shadowRoot || host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>:host{display:block}.proj-page{background:#fff}.app{min-height:0!important}${P.css}</style><div class="proj-page">${P.html}</div>`;
  guardShadow(root);
  const page = root.querySelector(".proj-page");
  const L = { id: "demo-" + host.dataset.demo, type: "project", stage: P.html, prelude: "" };
  silent = true; try { execute(L, solutionAt(P.js, 7, "js"), null, page, {}); } catch (e) { /* démo */ } silent = false;
}
function guardShadow(root) {
  if (root._guard) return; root._guard = true;
  root.addEventListener("submit", ev => { if (!ev.defaultPrevented) { ev.preventDefault(); toast("Sans `event.preventDefault()`, la page se serait rechargée et tout aurait été effacé !"); } });
  root.addEventListener("click", ev => {
    const a = ev.target.closest && ev.target.closest("a[href]"); if (!a) return;
    ev.preventDefault();
    const h = a.getAttribute("href");
    if (h.startsWith("#") && h.length > 1) { const t = root.getElementById(h.slice(1)); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else toast("Les liens ne s’ouvrent pas dans l’aperçu.");
  });
}
function chooseProject(type) {
  const P = PROJECT_TYPES[type];
  store.projet = { v: 2, type, files: { html: P.html, css: P.css, js: "// ===== Étape 1 : les données =====\n// Écris ici nomProjet, slogan et le tableau " + P.data + ",\n// avec les contenus du brief client (à gauche).\n\n" }, steps: {}, checklist: {}, learned: "", name: "" };
  save(); updateStats();
  toast("C’est parti : " + P.label + " !");
  showProject(1);
}

/* ---------- une étape ---------- */
function openStep(n) {
  const p = proj(); const P = PROJECT_TYPES[p.type]; const steps = projSteps(p.type);
  current = { id: "projet", type: "project" };
  session = { hints: 0, checkWrong: 0, teacherUsed: false, errLine: null, stepLine: null, projStep: n, file: (session && session.file) || "js", checkAnswers: {} };
  setHash("projet");
  $("#view-level").innerHTML = "";
  const step = steps[n - 1];
  const chips = steps.map(s => `<button type="button" class="pstep ${stepDone(s.n) ? "done" : ""} ${s.n === n ? "cur" : ""}" data-step="${s.n}" ${stepUnlocked(s.n) || stepDone(s.n) ? "" : "disabled"} title="${esc(s.title)}">${stepDone(s.n) ? "✓" : s.n}<span>${esc(s.title)}</span></button>`).join("") + `<button type="button" class="pstep ${n === 8 ? "cur" : ""} ${allStepsDone() ? "done" : ""}" data-step="8" ${stepUnlocked(8) ? "" : "disabled"}>★<span>Finaliser</span></button>`;
  const head = `<div class="level-head"><button class="btn btn-small btn-ghost" type="button" data-go="map">← Clients</button><div class="level-title"><span class="where">Projet bonus · ${esc(P.label)}</span><h2>${esc(p.name || "Mon projet")}</h2></div><button class="btn btn-small btn-ghost" type="button" id="proj-change">Changer de projet</button></div><nav class="psteps" aria-label="Étapes du projet">${chips}</nav>`;
  if (n === 8) { $("#view-project").innerHTML = head + finalHTML(); setView("project"); bindFinal(); return; }
  const locked = !stepUnlocked(n) && !stepDone(n);
  const brief = `
    <div class="says"><div id="says-bip">${bipSVG()}</div><p class="bubble">${md(step.intro)}</p></div>
    <section class="card mission"><p class="card-kicker">Étape ${n} / 7 · ${esc(step.notion)}</p><h3>${esc(step.title)}</h3><ol class="steps">${step.instructions.map(s => `<li>${md(s)}</li>`).join("")}</ol>
      <p class="rule"><b>Agence</b> Le HTML et le CSS sont fournis : tu ne touches qu’à script.js, sans copier-coller. Pour valider l’étape, tu devras expliquer ton code avec tes mots : ce texte ira dans ta fiche portfolio.</p></section>
    <section class="card">${clientBriefHTML(P, n === 1)}</section>
    ${step.diagrams ? `<section class="card schema"><p class="card-kicker">Le schéma · comment ça marche</p>${step.diagrams.map(diagramHTML).join("")}</section>` : ""}
    ${step.lesson ? `<section class="card lesson"><p class="card-kicker">Nouveau</p><p>${md(step.lesson.what)}</p><pre class="code-block">${highlight(step.lesson.code)}</pre><dl class="pieces">${step.lesson.pieces.map(([k, d]) => `<div><dt><code>${esc(k)}</code></dt><dd>${md(d)}</dd></div>`).join("")}</dl><div class="trap"><p class="mini-label">Piège à éviter</p><p>${md(step.lesson.trap)}</p></div></section>` : ""}
    <section class="card help" id="help" hidden><p class="card-kicker">Indices</p><ol class="hint-list" id="hint-list"></ol><div id="solution-box" hidden></div></section>`;
  const bench = locked
    ? `<section class="card mission lockcard"><p class="card-kicker">Étape verrouillée</p><h3>Pas encore…</h3><p>Valide d’abord l’étape ${n - 1} : chaque étape s’appuie sur la précédente.</p><div><button class="btn btn-primary" type="button" data-step="${n - 1}">Aller à l’étape ${n - 1}</button></div></section>${previewOnlyHTML()}`
    : `<div class="filetabs" role="tablist">${["html", "css", "js"].map(f => `<button class="filetab" role="tab" type="button" data-file="${f}" aria-selected="${session.file === f}">${{ html: "index.html <small>lecture</small>", css: "style.css <small>lecture</small>", js: "script.js <small>ton code</small>" }[f]}</button>`).join("")}</div>
      <div id="editor-slot"></div>
      <div class="actions">
        <button class="btn btn-primary" type="button" id="prun">▶ Lancer</button>
        <button class="btn btn-yellow" type="button" id="ptrace">Pas à pas</button>
        <button class="btn" type="button" id="phint">Indice (${step.hints.length})</button>
        ${store.teacher ? `<button class="btn btn-ghost" type="button" id="psolution">Solution (formateur)</button>` : ""}
        <span class="kbd">Ctrl + Entrée pour lancer</span>
      </div>
      <div id="check-slot"></div>
      <div class="results">${tabsHTML(["goals", "apercu", "console", "memory", "step"])}${panelsHTML(["goals", "apercu", "console", "memory", "step"])}</div>`;
  $("#view-project").innerHTML = head + `<div class="level-grid"><div class="brief">${brief}</div><div class="workbench">${bench}</div></div>`;
  setView("project");
  if (locked) { runProject(true); return; }
  ensureStepHeader(n, step);
  $("#panel-apercu").innerHTML = previewInnerHTML();
  mountEditor(session.file);
  renderStepGoals(null, step);
  runProject(true);
  selectTab("apercu");
}
function ensureStepHeader(n, step) {
  const p = proj();
  if (!new RegExp("// ===== Étape " + n + "\\b").test(p.files.js)) { p.files.js = p.files.js.replace(/\s*$/, "") + "\n\n// ===== Étape " + n + " : " + step.title.toLowerCase() + " =====\n\n"; save(); }
}
function previewInnerHTML() {
  return `<div class="device-bar"><span class="mini-label">Aperçu</span><button type="button" class="btn btn-small ${session.device !== "desktop" ? "on" : ""}" data-device="mobile">Mobile</button><button type="button" class="btn btn-small ${session.device === "desktop" ? "on" : ""}" data-device="desktop">Ordinateur</button></div><div class="proj-frame ${session.device === "desktop" ? "desktop" : "mobile"}"><div id="proj-host"></div></div><p class="page-note">Ton site, tel qu’il s’affichera. Tu peux cliquer et taper dedans.</p>`;
}
function previewOnlyHTML() { return `<div class="results"><div class="panel" id="panel-apercu" style="max-height:none">${previewInnerHTML()}</div><div id="console-out" hidden></div><div id="memory-out" hidden></div></div>`; }
function mountPreview() {
  const host = $("#proj-host"); if (!host) return document.createElement("div");
  const root = host.shadowRoot || host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>:host{display:block}.proj-page{min-height:100%;background:#fff}.app{min-height:0!important}${proj().files.css}</style><div class="proj-page">${proj().files.html}</div>`;
  guardShadow(root);
  fitPreview();
  return root.querySelector(".proj-page");
}
function fitPreview() {
  const fr = $(".proj-frame"), host = $("#proj-host"); if (!fr || !host) return;
  host.style.zoom = "";
  if (fr.classList.contains("desktop")) {
    const z = Math.min(1, (fr.clientWidth - 6) / 1100);
    host.style.width = "1100px"; host.style.transformOrigin = "0 0"; host.style.transform = "scale(" + z + ")";
    host.style.marginBottom = -(host.offsetHeight * (1 - z)) + "px";
  } else { host.style.width = ""; host.style.transform = ""; host.style.marginBottom = ""; }
}
window.addEventListener("resize", () => fitPreview());
function mountEditor(file) {
  session.file = file;
  const ro = file !== "js";
  document.querySelectorAll(".filetab").forEach(t => t.setAttribute("aria-selected", String(t.dataset.file === file)));
  $("#editor-slot").innerHTML = ro ? editorHTML(true).replace(/<p class="editor-tip">[\s\S]*?<\/p>/, `<p class="editor-tip">${file === "html" ? "<b>index.html · fourni par l’agence, lecture seule.</b> Cherche ici les classes (<code>.grille</code>, <code>.filtre</code>…) et les id (<code>#nom</code>…) que ton JavaScript va attraper avec <code>querySelector</code>." : "<b>style.css · fourni par l’agence, lecture seule.</b> Repère les classes que ton JS ajoute ou enlève (<code>.sombre</code>, <code>.aime</code>, <code>.fait</code>…) : c’est ici qu’elles prennent leur look."}</p>`) : editorHTML(false);
  const ta = $("#code"); ta._lang = file; ta.value = proj().files[file];
  if (!ro) ta._onChange = v => { proj().files[file] = v; save(); };
  bindEditor(ta, ro);
}

/* ---------- lancer le projet ---------- */
function runProject(quiet) {
  const p = proj(); if (!p) return;
  const n = session.projStep; const steps = projSteps(p.type); const step = steps[n - 1];
  const L = PROJECT_LEVEL(); const code = p.files.js;
  const page = mountPreview();
  silent = true; silentErrors.length = 0;
  const st = document.createElement("div"); st.innerHTML = p.files.html;
  const runs = [execute(L, code, null, st, {})];
  silent = false; liveRun = null;
  const main = execute(L, code, null, page, { live: true });
  if (typeof V(runs[0], "nomProjet") === "string" && V(runs[0], "nomProjet").trim() && p.name !== V(runs[0], "nomProjet")) { p.name = V(runs[0], "nomProjet"); save(); const h = $("#view-project .level-title h2"); if (h) h.textContent = p.name; }
  if (!$("#goals")) return;
  if (main.error && session.file !== "js") mountEditor("js");
  showRun(main, code);
  const c = { runs, code, L, main, P: PROJECT_TYPES[p.type] };
  silent = true;
  const res = g => { let r; try { r = g.test(c); } catch (e) { r = false; } return { ok: r === true, detail: typeof r === "string" ? r : null }; };
  const results = step.goals.map(res);
  if (n > 1) {
    let reg = true;
    for (const s of steps.slice(0, n - 1)) { for (const g of s.goals) { const r = res(g); if (!r.ok) { reg = "L’étape " + s.n + " ne marche plus : « " + g.label.replace(/`/g, "") + " »" + (r.detail ? " · " + r.detail : "") + "."; break; } } if (reg !== true) break; }
    results.push({ ok: reg === true, detail: reg === true ? null : reg });
  }
  silent = false;
  session.results = results;
  if (main.error) {
    renderStepGoals(null, step);
    const ln = errorLine(main.error, code, main.preludeLines);
    $("#goals").insertAdjacentHTML("afterbegin", `<li class="goal ko"><span class="goal-icon" aria-hidden="true">!</span><span><span>Ton code s’arrête ${ln ? "à la ligne " + ln : "sur une erreur"}.</span><span class="goal-detail">Tout ce qui est après n’a pas été lu. Corrige d’abord cette erreur (onglet Console), relance, et les objectifs seront vérifiés.</span></span></li>`);
  } else renderStepGoals(results, step);
  $("#check-slot").innerHTML = "";
  if (quiet) return;
  if (main.error) { selectTab("console"); setMood("oops"); }
  else if (results.every(r => r.ok)) { setMood("happy"); showStepCheck(step); }
  else { selectTab("goals"); setMood("think"); }
}
function renderStepGoals(results, step) {
  const goals = step.goals.map(g => g.label).concat(session.projStep > 1 ? ["Les étapes précédentes marchent toujours"] : []);
  $("#goals").innerHTML = goals.map((label, i) => { const r = results && results[i]; const st = !r ? "todo" : r.ok ? "ok" : "ko"; return `<li class="goal ${st}"><span class="goal-icon" aria-hidden="true">${st === "ok" ? "✓" : st === "ko" ? "✗" : "○"}</span><span><span>${md(label)}</span>${r && r.detail ? `<span class="goal-detail">${md(r.detail)}</span>` : ""}</span></li>`; }).join("");
  const okN = results ? results.filter(r => r.ok).length : 0;
  const b = $("#badge-goals"); b.textContent = okN + " / " + goals.length; b.className = "badge" + (results && okN === goals.length ? " green" : "");
  $("#goals-note").innerHTML = "Le jeu teste ton projet avec **tes** données. Clique sur **Lancer** après chaque modification.".replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function showStepCheck(step) {
  session.checkAnswers = {};
  const prev = (proj().steps[step.n] || {}).explain || "";
  $("#check-slot").innerHTML = `<section class="card check-card" id="check-card"><p class="card-kicker">Ça marche ! Dernière étape</p><h3>Explique ton code</h3>${questionsHTML(step.check, "c")}
    <label class="explain-label" for="explain">${md(step.explain)} <small>(au moins 2 phrases : ce texte ira dans ta fiche portfolio)</small></label>
    <textarea id="explain" class="explain" rows="4" placeholder="Avec tes mots, comme si tu l’expliquais à quelqu’un qui ne code pas.">${esc(prev)}</textarea>
    <div class="quiz-foot"><button class="btn btn-primary" type="button" id="c-step">Valider l’étape</button><span id="c-msg" aria-live="polite"></span></div></section>`;
  bindQuestions(step.check, "c");
  $("#c-step").addEventListener("click", () => {
    const good = gradeQuestions(step.check, "c", session.checkAnswers); const msg = $("#c-msg");
    if (good === null) { msg.textContent = "Réponds à toutes les questions."; return; }
    if (good !== step.check.length) { session.checkWrong++; msg.textContent = "Une réponse n’est pas juste : relis ton code et réessaie."; return; }
    const ex = $("#explain").value.trim();
    if (ex.length < 60 || ex.split(/[.!?]/).filter(x => x.trim().length > 3).length < 2) { msg.textContent = "Écris au moins 2 vraies phrases pour expliquer ton code."; $("#explain").focus(); return; }
    validateStep(step, ex);
  });
  $("#check-card").scrollIntoView({ block: "center", behavior: "smooth" });
}
function validateStep(step, explainText) {
  const p = proj();
  let stars = Math.max(1, 3 - (session.hints > 0 ? 1 : 0) - (session.checkWrong > 0 ? 1 : 0)); if (session.teacherUsed) stars = 1;
  const before = p.steps[step.n];
  p.steps[step.n] = { stars: Math.max(before ? before.stars : 0, stars), explain: explainText };
  save(); updateStats();
  const steps = projSteps(p.type); const next = steps[step.n];
  const nextOpen = next ? stepUnlocked(next.n) : allStepsDone();
  $("#dialog").innerHTML = `
    <div class="dialog-top">${bipSVG("happy")}<div><p class="card-kicker">Projet · étape ${step.n} validée</p><h2 id="modal-title">${esc(step.title)} ✓</h2><div class="big-stars">${starsHTML(stars)}</div></div></div>
    <div><p class="mini-label">Dans ta fiche portfolio</p><p class="quote">${esc(explainText)}</p></div>
    ${next ? `<p class="new-piece">Étape ${next.n} disponible : ${esc(next.title)}</p>` : `<p class="new-piece">Les 7 étapes sont faites ! Place à la finalisation : export et fiche portfolio.</p>`}
    <div class="dialog-actions"><button class="btn btn-ghost" type="button" id="modal-stay">Rester ici</button>
      ${next ? `<button class="btn btn-primary" type="button" id="modal-go" data-step="${next.n}">Étape suivante →</button>` : `<button class="btn btn-primary" type="button" id="modal-go" data-step="8">Finaliser mon projet →</button>`}</div>`;
  $("#modal").hidden = false;
  $("#modal-stay").addEventListener("click", () => { $("#modal").hidden = true; });
  $("#modal-go").addEventListener("click", () => { $("#modal").hidden = true; });
  $("#modal-go").focus();
  confetti(step.n === 7 ? 160 : 80);
}

/* ---------- finaliser : checklist, fiche portfolio, export ---------- */
const CHECKLIST = ["J’ai mis les 6 contenus du brief client dans mes données", "Mon script.js est commenté : un commentaire au-dessus de chaque partie", "J’ai vérifié l’aperçu en mobile ET en ordinateur", "J’ai testé chaque bouton et le formulaire", "J’ai relu les textes (fautes, majuscules)", "J’ai ouvert le projet dans VS Code avec Live Server, sans erreur dans la console (F12)", "J’ai mis le projet en ligne et noté le lien", "Bonus : dans VS Code, j’ai changé les couleurs (style.css, partie 1) pour en faire mon projet"];
function exportFiles() {
  const p = proj();
  const html = `<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${esc(p.name || "Mon projet")}</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link href="${PROJECT_TYPES[p.type].fonts}" rel="stylesheet">\n  <link rel="stylesheet" href="style.css">\n  <script src="script.js" defer><\/script>\n</head>\n<body>\n${p.files.html.split("\n").map(l => "  " + l).join("\n")}\n</body>\n</html>\n`;
  return { "index.html": html, "style.css": p.files.css, "script.js": p.files.js };
}
function ficheData() {
  const p = proj(); const P = PROJECT_TYPES[p.type]; const steps = projSteps(p.type);
  const st = document.createElement("div"); st.innerHTML = p.files.html;
  silent = true; const r = execute(PROJECT_LEVEL(), p.files.js, null, st, {}); silent = false;
  const data = V(r, P.data);
  return { p, P, steps, name: V(r, "nomProjet") || p.name || "Mon projet", slogan: V(r, "slogan") || "", count: Array.isArray(data) ? data.length : 0 };
}
function ficheHTML() {
  const f = ficheData();
  return `<article class="fiche">
    <p class="mini-label">${esc(f.P.kind)} · client fictif</p><h3>${esc(f.name)}</h3><p class="fiche-slogan">${esc(f.slogan)}</p>
    <p><strong>Le projet :</strong> ${esc(f.P.pitch)}</p>
    <p class="mini-label">Ce que fait mon projet</p><ul class="proj-list">${f.P.features.map(x => `<li>${esc(x)}</li>`).join("")}<li>${f.count} contenus, gérés depuis un tableau d’objets</li></ul>
    <p class="mini-label">Ma part du travail</p><p>Projet d’agence pour un client fictif. HTML et CSS fournis par l’équipe design ; <strong>tout le JavaScript écrit par moi</strong>.</p>
    <p class="mini-label">Technologies</p><div class="chips"><code>JavaScript</code>${f.steps.map(s => `<code>${esc(s.notion)}</code>`).join("")}</div>
    <p class="mini-label">Comment je l’ai codé, étape par étape</p>
    ${f.steps.map(s => `<div class="fiche-step"><b>${s.n}. ${esc(s.title)}</b><p>${esc((f.p.steps[s.n] || {}).explain || "(pas encore expliqué)")}</p></div>`).join("")}
    ${f.p.learned ? `<p class="mini-label">Ce que j’ai appris</p><p>${esc(f.p.learned)}</p>` : ""}
  </article>`;
}
function ficheText() {
  const f = ficheData();
  return [f.name, f.slogan, "", "Projet : " + f.P.kind + " pour " + f.P.label + " (client fictif)", f.P.pitch, "", "Ma part : HTML et CSS fournis par l’équipe design, tout le JavaScript écrit par moi.", "", "Ce que fait mon projet :", ...f.P.features.map(x => "- " + x), "- " + f.count + " contenus, gérés depuis un tableau d’objets", "", "Notions JavaScript : " + f.steps.map(s => s.notion).join(" ; "), "", "Comment je l’ai codé :", ...f.steps.map(s => s.n + ". " + s.title + " : " + ((f.p.steps[s.n] || {}).explain || "")), ...(f.p.learned ? ["", "Ce que j’ai appris : " + f.p.learned] : [])].join("\n");
}
function finalHTML() {
  const p = proj(); const files = exportFiles();
  return `<div class="level-grid"><div class="brief">
    <div class="says"><div id="says-bip">${bipSVG("happy")}</div><p class="bubble">Ton projet est construit. Dernière ligne droite : on le peaufine, on le sort du jeu pour l’ouvrir dans VS Code, on le met en ligne, et on prépare sa fiche pour ton portfolio.</p></div>
    <section class="card mission"><p class="card-kicker">Avant de publier</p><ul class="checklist">${CHECKLIST.map((c, i) => `<li><label><input type="checkbox" data-check="${i}" ${p.checklist && p.checklist[i] ? "checked" : ""}> ${esc(c)}</label></li>`).join("")}</ul></section>
    <section class="card"><p class="card-kicker">Ce que j’ai appris</p><label for="learned" class="explain-label">En quelques phrases : ce que tu sais faire maintenant, ce qui t’a posé problème, comment tu l’as résolu.</label><textarea id="learned" class="explain" rows="5">${esc(p.learned || "")}</textarea></section>
    <section class="card"><p class="card-kicker">Sortir le projet du jeu</p><ol class="steps">
      <li>Sur ton ordinateur, crée un dossier à ton nom de projet.</li>
      <li>Dans VS Code, crée <code>index.html</code>, <code>style.css</code> et <code>script.js</code> dans ce dossier.</li>
      <li>Copie chaque fichier depuis la colonne de droite et colle-le dans le bon fichier.</li>
      <li>Ouvre <code>index.html</code> avec Live Server. Ouvre la console (F12) : aucune ligne rouge ne doit apparaître.</li>
      <li>Mets le dossier en ligne avec la solution vue en cours (glisser-déposer), puis ajoute le lien et la fiche à ton portfolio.</li></ol></section>
  </div><div class="workbench">
    <section class="card"><p class="card-kicker">Ma fiche portfolio</p>${ficheHTML()}<div class="quiz-foot"><button class="btn btn-primary" type="button" id="copy-fiche">Copier le texte de la fiche</button></div></section>
    <section class="card"><p class="card-kicker">Mes fichiers</p>${Object.entries(files).map(([name, content]) => `<details class="export"><summary><b>${name}</b> <span>${content.split("\n").length} lignes</span></summary><pre class="code-block">${name.endsWith(".js") ? highlight(content) : name.endsWith(".css") ? hlCSS(content) : hlHTML(content)}</pre></details><div class="quiz-foot"><button class="btn btn-small" type="button" data-copy-file="${name}">Copier ${name}</button></div>`).join("")}</section>
    <div class="results"><div class="panel" id="panel-apercu" style="max-height:none">${previewInnerHTML()}</div><div id="console-out" hidden></div><div id="memory-out" hidden></div></div>
  </div></div>`;
}
function bindFinal() {
  const p = proj();
  document.querySelectorAll("[data-check]").forEach(cb => cb.addEventListener("change", () => { p.checklist = p.checklist || {}; p.checklist[cb.dataset.check] = cb.checked; save(); }));
  $("#learned").addEventListener("input", e => { p.learned = e.target.value; save(); });
  $("#learned").addEventListener("change", () => { const w = $(".fiche"); if (w) w.outerHTML = ficheHTML(); });
  session.projStep = 8;
  runProject(true);
}
async function copyText(text, label) {
  try { await navigator.clipboard.writeText(text); toast(label + " copié !"); }
  catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (x) { ok = false; } ta.remove(); toast(ok ? label + " copié !" : "La copie automatique est bloquée ici : ouvre le fichier et sélectionne le texte à la main."); }
}

/* ---------- événements du projet ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.choose) { chooseProject(t.dataset.choose); return; }
  if (t.dataset.step && !t.disabled) { showProject(+t.dataset.step); return; }
  if (t.dataset.file) { mountEditor(t.dataset.file); return; }
  if (t.dataset.device) { session.device = t.dataset.device; const fr = $(".proj-frame"); if (fr) fr.className = "proj-frame " + t.dataset.device; document.querySelectorAll("[data-device]").forEach(b => b.classList.toggle("on", b === t)); fitPreview(); return; }
  if (t.dataset.copyFile) { copyText(exportFiles()[t.dataset.copyFile], t.dataset.copyFile); return; }
  switch (t.id) {
    case "prun": runProject(false); break;
    case "ptrace": { const run = traceRun(PROJECT_LEVEL(), proj().files.js); selectTab("step"); if (session.file !== "js") mountEditor("js"); renderStepper(run, {}); break; }
    case "phint": { const step = projSteps(proj().type)[session.projStep - 1]; if (session.hints >= step.hints.length) break; session.hints++; $("#help").hidden = false; $("#hint-list").innerHTML = step.hints.slice(0, session.hints).map(h => `<li>${md(h)}</li>`).join(""); const left = step.hints.length - session.hints; t.textContent = left ? `Indice (${left})` : "Plus d’indice"; t.disabled = !left; $("#help").scrollIntoView({ block: "nearest", behavior: "smooth" }); break; }
    case "psolution": { const P = PROJECT_TYPES[proj().type], n = session.projStep; session.teacherUsed = true; $("#help").hidden = false; $("#solution-box").hidden = false; $("#solution-box").innerHTML = `<p class="mini-label">Solution complète jusqu’à l’étape ${n} (formateur)</p><pre class="code-block">${highlight(solutionAt(P.js, n, "js"))}</pre><button class="btn btn-small" type="button" id="psol-apply">Remplacer mes fichiers par la solution</button>`; break; }
    case "psol-apply": { const P = PROJECT_TYPES[proj().type], n = session.projStep; proj().files.js = solutionAt(P.js, n, "js"); proj().files.html = P.html; proj().files.css = P.css; save(); mountEditor(session.file); runProject(true); toast("Solution chargée."); break; }
    case "copy-fiche": copyText(ficheText(), "La fiche"); break;
    case "proj-change": twoStep(t, "Tout recommencer ? Clique encore", () => { store.projet = null; save(); showProject(); }); break;
  }
});
document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && current && current.id === "projet" && document.activeElement && document.activeElement.id === "code") { e.preventDefault(); e.stopPropagation(); runProject(false); } }, true);

/* ---------- bloc « projet » sur la carte ---------- */
function projectBlockHTML() {
  const p = proj();
  if (!projectOpen()) return "";
  if (!p) return `<section class="proj-block"><div><p class="kicker">Bonus · projet portfolio</p><h2>Mets en application ce que tu as vu</h2><p>Tu as terminé toutes les missions. Si tu veux un projet de plus dans ton portfolio, trois clients de l’agence attendent : le HTML et le CSS sont prêts, tu codes tout le JavaScript, en 7 étapes.</p></div>
    <div class="proj-mini">${Object.values(PROJECT_TYPES).map(P => `<div><b>${esc(P.label)}</b><small>${esc(P.kind)} · ${esc(P.short)}</small></div>`).join("")}</div>
    <div><button class="btn btn-primary" type="button" id="map-project">Choisir mon projet</button></div></section>`;
  const P = PROJECT_TYPES[p.type]; const steps = projSteps(p.type); const n = nextStepNumber();
  const nextS = steps[n - 1];
  const status = n === 8 ? "Les 7 étapes sont faites : finalise et exporte ton projet !" : `Étape ${n} : <strong>${esc(nextS.title)}</strong>`;
  return `<section class="proj-block"><div><p class="kicker">Projet bonus · ${esc(P.label)}</p><h2>${esc(p.name || "Mon projet")}</h2><p>${status}</p></div>
    <div class="psteps psteps-mini">${steps.map(s => `<span class="pstep ${stepDone(s.n) ? "done" : ""} ${s.n === n ? "cur" : ""}">${stepDone(s.n) ? "✓" : s.n}<span>${esc(s.title)}</span></span>`).join("")}</div>
    <div><button class="btn btn-primary" type="button" id="map-project">Ouvrir mon projet</button></div></section>`;
}

/* =====================================================================
   ÉVÉNEMENTS GLOBAUX ET DÉMARRAGE
   ===================================================================== */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.open) { openLevel(t.dataset.open); return; }
  if (t.dataset.go === "map") { showMap(); return; }
  if (t.dataset.tab) { selectTab(t.dataset.tab); return; }
  switch (t.id) {
    case "run": runCode(); break;
    case "hero-choose": case "hero-project": case "map-project": showProject(); break;
    case "trace": startTrace(); break;
    case "hint": showHint(); break;
    case "teacher-solution": teacherSolution(); break;
    case "teacher-answers": teacherAnswers(); break;
    case "copy-solution": { const ta = $("#code"); ta.value = current.solution; ta.dispatchEvent(new Event("input")); break; }
    case "reset": twoStep(t, "Sûr ? Clique encore", () => { delete store.drafts[current.id]; save(); if (current.type === "fill") renderFill(current); else { const ta = $("#code"); ta.value = current.starter || ""; session.errLine = null; session.stepLine = null; ta._paint(); } }); break;
  }
});
$("#brand").addEventListener("click", showMap);
$("#nav-map").addEventListener("click", showMap);
$("#nav-notebook").addEventListener("click", showNotebook);
$("#nav-sandbox").addEventListener("click", () => openLevel(SANDBOX.id));
$("#nav-project").addEventListener("click", () => showProject());
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) $("#modal").hidden = true; });
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") $("#modal").hidden = true; });
window.addEventListener("hashchange", route);

if (window.claude && window.claude.hot) window.claude.hot.snapshot(() => ({ hash: location.hash }));
const start = data => { if (data && data.hash && !location.hash) history.replaceState(null, "", data.hash); route(); };
window.claude && window.claude.hot && window.claude.hot.ready ? window.claude.hot.ready(start) : start((window.claude && window.claude.hot && window.claude.hot.data) || {});
