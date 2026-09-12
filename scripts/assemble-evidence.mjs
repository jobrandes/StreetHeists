import fs from "node:fs";
import path from "node:path";

/**
 * Evidence art is per-clue and must match what the player is supposed to notice.
 * Validates every imageSrc in src/lib/seed.ts (svg/png/jpg).
 */

const seedPath = path.resolve("src/lib/seed.ts");
const publicRoot = path.resolve("public");
const MIN_BYTES = 1000;

const seed = fs.readFileSync(seedPath, "utf8");
const imageSrcs = [...seed.matchAll(/imageSrc:\s*"([^"]+)"/g)].map((m) => m[1]);

if (imageSrcs.length === 0) {
  console.error("FAIL: no imageSrc entries found in src/lib/seed.ts");
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
  console.error(
    "\nEvidence assets failed validation. Each clue needs unique, real art that matches its tell.\n" +
      failures.map((line) => `  - ${line}`).join("\n"),
  );
  process.exit(1);
}

console.log(`Evidence assets validated (${imageSrcs.length} unique clues).`);
