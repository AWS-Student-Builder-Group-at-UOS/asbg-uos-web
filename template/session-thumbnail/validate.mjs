// 세션 썸네일 검증. design-guide.html의 템플릿과 대조하고 번호 · 키워드 · 아이콘 격자를 확인한다.
// 사용: node template/session-thumbnail/validate.mjs <thumbnail.svg>
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const TIERS = [
  { max: 18, size: 56, ys: [318, 392, 466] },
  { max: 23, size: 44, ys: [332, 392, 452] },
  { max: 28, size: 36, ys: [342, 392, 442] },
];

const file = process.argv[2];
if (!file) {
  console.error("사용법: node template/session-thumbnail/validate.mjs <thumbnail.svg>");
  process.exit(2);
}

const guide = fs.readFileSync(new URL("./design-guide.html", import.meta.url), "utf8");
const template = guide.match(/<script type="text\/plain" id="template">([\s\S]*?)<\/script>/)[1].trim();
const svg = fs.readFileSync(file, "utf8").trim();
const errors = [];
const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// 1. 템플릿과 대조한다. 공백 차이만 허용하고, 자리표시자는 나온 순서대로 캡처한다.
const names = [];
const pattern = template
  .replace(/\{\{(COHORT|SESSION|PRESENTATION|KEYWORDS|ICON)\}\}/g, (_, key) => {
    names.push(key);
    return `@@${key}@@`;
  })
  .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  .replace(/(>)?\s+/g, (_, gt) => (gt ? ">\\s*" : "\\s+"))
  .replace(/(\\s[*+])?@@(KEYWORDS|ICON)@@(\\s[*+])?/g, "\\s*([\\s\\S]*?)\\s*")
  .replace(/@@(COHORT|SESSION|PRESENTATION)@@/g, "(\\d{2})");
const match = svg.match(new RegExp(`^${pattern}$`));
const found = {};
if (match) {
  names.forEach((name, i) => {
    found[name] = match[i + 1];
  });
} else {
  const norm = (s) => s.replace(/\s+/g, " ");
  const segments = template.split(/\{\{(?:COHORT|SESSION|PRESENTATION|KEYWORDS|ICON)\}\}/).map(norm).filter(Boolean);
  const missing = segments.find((seg) => !norm(svg).includes(seg));
  errors.push(`템플릿과 다르다${missing ? `: "${missing.slice(0, 70)}…" 부분이 없다` : ""}`);
}

// 2. 키워드 3줄을 확인한다.
const lines = [];
if (found.KEYWORDS !== undefined) {
  const linePattern = /<text x="84" y="(\d+)" font-size="(\d+)">([^<]+)<\/text>/g;
  const leftover = found.KEYWORDS.replace(linePattern, "").trim();
  if (leftover) errors.push(`키워드 그룹에 text 3줄 외의 내용이 있다: "${leftover.slice(0, 60)}"`);
  for (const [, y, size, text] of found.KEYWORDS.matchAll(linePattern)) {
    lines.push({ y: Number(y), size: Number(size), text: unescape(text) });
  }
  if (lines.length !== 3) errors.push(`키워드는 3줄이어야 한다 (현재 ${lines.length}줄)`);
  else {
    const longest = Math.max(...lines.map((l) => l.text.length));
    const tier = TIERS.find((t) => longest <= t.max);
    if (!tier) errors.push(`키워드가 너무 길다 (${longest}자, 최대 28자). index.md의 키워드를 줄인다`);
    lines.forEach((l, i) => {
      if (l.text !== l.text.toUpperCase()) errors.push(`키워드 ${i + 1}줄은 대문자여야 한다: ${l.text}`);
      if (tier && (l.size !== tier.size || l.y !== tier.ys[i])) {
        errors.push(`키워드 ${i + 1}줄은 크기 ${tier.size}, y ${tier.ys[i]} 이어야 한다 (현재 ${l.size}, ${l.y})`);
      }
    });
  }
}

// 3. 발표 폴더 안에 있으면 번호와 키워드를 폴더 이름 · index.md와 대조한다.
const abs = path.resolve(file);
const location = abs.match(/cohort-(\d{2})[\\/]session-(\d{2})[\\/]presentation-(\d{2})[\\/]img[\\/][^\\/]+$/);
if (location) {
  const expected = { COHORT: location[1], SESSION: location[2], PRESENTATION: location[3] };
  for (const [key, value] of Object.entries(expected)) {
    if (found[key] && found[key] !== value) errors.push(`${key} 번호가 폴더 이름과 다르다: ${found[key]} ≠ ${value}`);
  }
  const indexMd = path.join(path.dirname(abs), "..", "index.md");
  if (!fs.existsSync(indexMd)) errors.push("발표 폴더에 index.md가 없다");
  else {
    const frontmatter = fs.readFileSync(indexMd, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const meta = frontmatter ? parseYaml(frontmatter[1]) : {};
    if (meta.thumbnail !== "img/thumbnail.svg") errors.push("index.md frontmatter에 thumbnail: img/thumbnail.svg 가 없다");
    const keywords = Array.isArray(meta.keywords) ? meta.keywords.map((k) => String(k).toUpperCase()) : [];
    if (lines.length === 3 && keywords.length === 3 && lines.map((l) => l.text).join("|") !== keywords.join("|")) {
      errors.push(`키워드가 index.md와 다르다: ${lines.map((l) => l.text).join(" / ")} ≠ ${keywords.join(" / ")}`);
    }
  }
}

// 4. 아이콘 rect를 확인한다.
const grid = Array.from({ length: 16 }, () => Array(16).fill("."));
let filled = 0;
if (found.ICON !== undefined) {
  const rectPattern = /<rect x="(\d+)" y="(\d+)" width="16" height="16"\s*\/>/g;
  const leftover = found.ICON.replace(rectPattern, "").trim();
  if (leftover) errors.push(`아이콘 그룹에 16 × 16 rect 외의 내용이 있다: "${leftover.slice(0, 60)}"`);
  for (const [, x, y] of found.ICON.matchAll(rectPattern)) {
    const c = (Number(x) - 800) / 16;
    const r = (Number(y) - 257) / 16;
    if (!Number.isInteger(c) || !Number.isInteger(r) || c < 0 || c > 15 || r < 0 || r > 15) {
      errors.push(`격자 밖 rect: x=${x} y=${y}`);
      continue;
    }
    if (grid[r][c] === "#") errors.push(`중복 rect: ${r}행 ${c}열`);
    grid[r][c] = "#";
    filled++;
  }
  const rows = grid.filter((row) => row.includes("#")).length;
  const cols = grid[0].map((_, c) => grid.some((row) => row[c] === "#")).filter(Boolean).length;
  if (filled === 0) errors.push("아이콘이 비어 있다");
  else if (rows < 8 || cols < 8) errors.push(`아이콘이 너무 작다: ${rows}행 × ${cols}열 (8 × 8 이상)`);
}

// 5. 파일 크기를 확인한다.
const bytes = Buffer.byteLength(svg);
if (bytes > 30_000) errors.push(`파일이 30 KB를 넘는다: ${bytes} bytes`);

console.log(grid.map((row) => row.join("")).join("\n"));
if (lines.length) console.log(`\n${lines.map((l) => l.text).join(" / ")}`);
if (!location) console.log("(발표 폴더 밖이라 번호 · 키워드는 index.md와 대조하지 않았다)");
if (errors.length) {
  console.error(`\n${errors.map((e) => `✗ ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n✓ ${file} · 아이콘 ${filled}칸 · ${bytes} bytes`);
