import fs from "node:fs";
import path from "node:path";

/**
 * Evidence art is per-clue and must match what the player is supposed to notice.
 * Validates every imageSrc under src/lib (seed + case modules).
 */

const libRoot = path.resolve("src/lib");
const publicRoot = path.resolve("public");
const MIN_BYTES = 1000;

function collectTsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectTsFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".ts")) out.push(full);
  }
  return out;
}

const imageSrcs = [];
for (const file of collectTsFiles(libRoot)) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/imageSrc:\s*"([^"]+)"/g)) {
    imageSrcs.push(match[1]);
  }
}

if (imageSrcs.length === 0) {
  console.error("FAIL: no imageSrc entries found under src/lib");
  process.exit(1);
}

const failures = [];
const seen = new Set();

function kindOf(filePath, bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "jpeg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  const head = bytes.slice(0, 64).toString("utf8").trim();
  if (head.includes("<svg") || head.includes("<?xml")) return "svg";
  if (/^placeholder$/i.test(head) || head === "PLACEHOLDER") return "placeholder";
  return "unknown";
}

for (const src of imageSrcs) {
  if (seen.has(src)) {
    failures.push(`${src}: reused by more than one clue (each clue needs unique art)`);
    continue;
  }
  seen.add(src);

  if (!src.startsWith("/evidence/")) {
    failures.push(`${src}: must live under /evidence/`);
    continue;
  }

  const filePath = path.join(publicRoot, src.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    failures.push(`${src}: missing on disk`);
    console.error("FAIL", src, "missing");
    continue;
  }

  const size = fs.statSync(filePath).size;
  if (size < MIN_BYTES) {
    failures.push(`${src}: too small (${size}b)`);
    console.error("FAIL", src, `too small (${size}b)`);
    continue;
  }

  const bytes = fs.readFileSync(filePath);
  const kind = kindOf(filePath, bytes);
  if (kind === "placeholder") {
    failures.push(`${src}: placeholder stub`);
    console.error("FAIL", src, "placeholder stub");
    continue;
  }
  if (kind === "unknown") {
    failures.push(`${src}: unrecognized image type`);
    console.error("FAIL", src, "unrecognized image type");
    continue;
  }

  console.log("ok", src, `${size}b`, kind);
}

if (failures.length) {
  console.error("\nEvidence validation failed:");
  for (const line of failures) console.error(" -", line);
  process.exit(1);
}

console.log(`Evidence assets validated (${seen.size} unique clues).`);
