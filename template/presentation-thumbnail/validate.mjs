import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const TIERS = [
  { max: 18, size: 56, ys: [318, 392, 466] },
  { max: 23, size: 44, ys: [332, 392, 452] },
  { max: 28, size: 36, ys: [342, 392, 442] },
];

export function validateThumbnail(svg, file) {
  const guide = fs.readFileSync(new URL("./design-guide.html", import.meta.url), "utf8");
  const template = guide.match(/<script type="text\/plain" id="template">([\s\S]*?)<\/script>/)[1].trim();
  const digits = JSON.parse(guide.match(/<script type="application\/json" id="digits">([\s\S]*?)<\/script>/)[1]);
  const errors = [];
  const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  const names = [];
  const pattern = template
    .replace(/\{\{(COHORT|PRESENTATION|KEYWORDS|ICON|DIGITS)\}\}/g, (_, key) => {
      names.push(key);
      return `@@${key}@@`;
    })
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/(>)?\s+/g, (_, gt) => (gt ? ">\\s*" : "\\s+"))
    .replace(/(\\s[*+])?@@(KEYWORDS|ICON|DIGITS)@@(\\s[*+])?/g, "\\s*([\\s\\S]*?)\\s*")
    .replace(/@@(COHORT|PRESENTATION)@@/g, "(\\d{2})");
  const match = svg.match(new RegExp(`^${pattern}$`));
  const found = {};
  if (match) {
    names.forEach((name, i) => {
      found[name] = match[i + 1];
    });
  } else {
    const norm = (s) => s.replace(/\s+/g, " ");
    const segments = template.split(/\{\{(?:COHORT|PRESENTATION|KEYWORDS|ICON|DIGITS)\}\}/).map(norm).filter(Boolean);
    const missing = segments.find((seg) => !norm(svg).includes(seg));
    errors.push(`템플릿과 다르다${missing ? `: "${missing.slice(0, 70)}…" 부분이 없다` : ""}`);
  }

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
        if (!/^[\x20-\x7E]+$/.test(l.text)) errors.push(`키워드 ${i + 1}줄에는 ASCII 문자만 쓴다`);
        if (l.text !== l.text.toUpperCase()) errors.push(`키워드 ${i + 1}줄은 대문자여야 한다: ${l.text}`);
        if (tier && (l.size !== tier.size || l.y !== tier.ys[i])) {
          errors.push(`키워드 ${i + 1}줄은 크기 ${tier.size}, y ${tier.ys[i]} 이어야 한다 (현재 ${l.size}, ${l.y})`);
        }
      });
    }
  }

  let session;
  if (found.DIGITS !== undefined) {
    const rectPattern = /<rect x="(\d+)" y="(\d+)" width="12" height="12"\s*\/>/g;
    const leftover = found.DIGITS.replace(rectPattern, "").trim();
    if (leftover) errors.push(`세션 번호 그룹에 12 × 12 rect 외의 내용이 있다: "${leftover.slice(0, 60)}"`);
    const blocks = [0, 1].map(() => Array.from({ length: 8 }, () => Array(6).fill(".")));
    for (const [, x, y] of found.DIGITS.matchAll(rectPattern)) {
      const k = Math.floor((Number(x) - 84) / 84);
      const c = (Number(x) - 84 - 84 * k) / 12;
      const r = (Number(y) - 570) / 12;
      if (k < 0 || k > 1 || !Number.isInteger(c) || !Number.isInteger(r) || c > 5 || r < 0 || r > 7) {
        errors.push(`세션 번호 칸 밖 rect: x=${x} y=${y}`);
        continue;
      }
      if (blocks[k][r][c] === "#") errors.push(`세션 번호 중복 rect: x=${x} y=${y}`);
      blocks[k][r][c] = "#";
    }
    const read = blocks.map((block) => Object.keys(digits).find((d) => digits[d].join("") === block.map((row) => row.join("")).join("")));
    if (read.includes(undefined)) errors.push("세션 번호가 05절의 숫자 모양과 다르다");
    else session = read.join("");
  }

  const abs = path.resolve(file);
  const location = abs.match(/cohort-(\d{2})[\\/]activities[\\/]session-(\d{2})-presentation-(\d{2})[\\/]img[\\/][^\\/]+$/);
  if (location) {
    const expected = { COHORT: location[1], PRESENTATION: location[3] };
    for (const [key, value] of Object.entries(expected)) {
      if (found[key] && found[key] !== value) errors.push(`${key} 번호가 폴더 이름과 다르다: ${found[key]} ≠ ${value}`);
    }
    if (session && session !== location[2]) errors.push(`세션 번호가 폴더 이름과 다르다: ${session} ≠ ${location[2]}`);
    const indexMd = path.join(path.dirname(abs), "..", "index.md");
    if (!fs.existsSync(indexMd)) errors.push("발표 폴더에 index.md가 없다");
    else {
      const frontmatter = fs.readFileSync(indexMd, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const meta = (frontmatter ? parseYaml(frontmatter[1]) : null) ?? {};
      if (meta.type !== "presentation") errors.push("index.md의 type은 presentation이어야 한다");
      if (meta.session !== Number(location[2]) || meta.presentation !== Number(location[3])) errors.push("index.md의 session · presentation이 폴더 이름과 다르다");
      if (meta.thumbnail !== "img/thumbnail.svg") errors.push("index.md frontmatter에 thumbnail: img/thumbnail.svg 가 없다");
      const keywords = Array.isArray(meta.keywords) ? meta.keywords.map((k) => String(k).toUpperCase()) : [];
      if (keywords.length !== 3) errors.push("index.md의 keywords는 세 개여야 한다");
      if (lines.length === 3 && keywords.length === 3 && lines.map((l) => l.text).join("|") !== keywords.join("|")) {
        errors.push(`키워드가 index.md와 다르다: ${lines.map((l) => l.text).join(" / ")} ≠ ${keywords.join(" / ")}`);
      }
    }
  }

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
    const span = (marks) => (marks.length ? Math.max(...marks) - Math.min(...marks) + 1 : 0);
    const rows = span(grid.flatMap((row, r) => (row.includes("#") ? [r] : [])));
    const cols = span(grid[0].flatMap((_, c) => (grid.some((row) => row[c] === "#") ? [c] : [])));
    if (filled === 0) errors.push("아이콘이 비어 있다");
    else if (rows < 8 || cols < 8) errors.push(`아이콘이 너무 작다: ${rows}행 × ${cols}열 (8 × 8 이상)`);
    else if (Math.max(rows, cols) < 12) errors.push(`아이콘의 긴 쪽이 12칸보다 짧다: ${rows}행 × ${cols}열`);
  }

  const bytes = Buffer.byteLength(svg);
  if (bytes > 30_000) errors.push(`파일이 30 KB를 넘는다: ${bytes} bytes`);

  return { errors, grid, lines, session, filled, bytes, location };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) {
    console.error("사용법: node template/presentation-thumbnail/validate.mjs <thumbnail.svg>");
    process.exit(2);
  }
  const result = validateThumbnail(fs.readFileSync(file, "utf8").trim(), file);
  console.log(result.grid.map((row) => row.join("")).join("\n"));
  if (result.lines.length) console.log(`\n${result.lines.map((line) => line.text).join(" / ")}`);
  if (result.session) console.log(`SESSION ${result.session}`);
  if (!result.location) console.log("(발표 폴더 밖이라 번호 · 키워드는 index.md와 대조하지 않았다)");
  if (result.errors.length) {
    console.error(`\n${result.errors.map((error) => `✗ ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`\n✓ ${file} · 아이콘 ${result.filled}칸 · ${result.bytes} bytes`);
}
