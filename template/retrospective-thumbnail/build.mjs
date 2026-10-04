import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { validateThumbnail } from "./validate.mjs";

const folder = process.argv[2];
const iconFile = process.argv[3];
if (!folder) {
  console.error("사용법: node template/retrospective-thumbnail/build.mjs <활동 폴더> [아이콘 격자.txt]");
  process.exit(2);
}

const activity = path.resolve(folder);
const location = activity.match(/(?:^|[\\/])cohort-(\d{2})[\\/]activities[\\/][^\\/]+$/);
if (!location) throw new Error("cohort-NN/activities/{slug} 폴더를 지정한다");
const source = fs.readFileSync(path.join(activity, "index.md"), "utf8");
const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
const meta = (frontmatter ? parseYaml(frontmatter[1]) : null) ?? {};
const keywords = Array.isArray(meta.keywords) ? meta.keywords.map((keyword) => String(keyword).toUpperCase()) : [];
if (keywords.length !== 3 || keywords.some((keyword) => !/^[\x20-\x7E]{1,28}$/.test(keyword))) {
  throw new Error("keywords에는 1~28자의 영어 키워드 세 개가 필요하다");
}

const guide = fs.readFileSync(new URL("./design-guide.html", import.meta.url), "utf8");
const template = guide.match(/<script type="text\/plain" id="template">([\s\S]*?)<\/script>/)[1].trim();
const glyphs = JSON.parse(guide.match(/<script type="application\/json" id="glyphs">([\s\S]*?)<\/script>/)[1]);
const rows = iconFile ? fs.readFileSync(iconFile, "utf8").trim().split(/\r?\n/) : glyphs.notebook;
if (rows.length !== 16 || rows.some((row) => !/^[.#]{16}$/.test(row))) {
  throw new Error("아이콘은 .과 #으로 이루어진 16행 × 16열 격자여야 한다");
}

const tiers = [
  { max: 18, size: 56, ys: [318, 392, 466] },
  { max: 23, size: 44, ys: [332, 392, 452] },
  { max: 28, size: 36, ys: [342, 392, 442] },
];
const tier = tiers.find(({ max }) => Math.max(...keywords.map((keyword) => keyword.length)) <= max);
const escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const svg = template
  .replace("{{COHORT}}", location[1])
  .replace("{{CONTEXT}}", meta.session === undefined ? "" : ` · SESSION ${String(meta.session).padStart(2, "0")}`)
  .replace("{{KEYWORDS}}", keywords.map((keyword, i) => `<text x="84" y="${tier.ys[i]}" font-size="${tier.size}">${escape(keyword)}</text>`).join("\n"))
  .replace("{{ICON}}", rows.flatMap((row, r) => [...row].flatMap((cell, c) => cell === "#" ? [`<rect x="${800 + c * 16}" y="${257 + r * 16}" width="16" height="16"/>`] : [])).join("\n"));
const output = path.join(activity, "img", "thumbnail.svg");
const result = validateThumbnail(svg, output);
if (result.errors.length) {
  console.error(result.errors.map((error) => `✗ ${error}`).join("\n"));
  process.exit(1);
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${svg}\n`);
console.log(`✓ ${output} · 아이콘 ${result.filled}칸 · ${result.bytes} bytes`);
