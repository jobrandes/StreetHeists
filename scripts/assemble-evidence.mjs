import fs from "node:fs";
import path from "node:path";

/**
 * Evidence assets live as normal files in public/evidence/*.svg.
 * Parts under public/evidence/parts/ are an optional rebuild aid only.
 *
 * This script:
 * 1. Assembles from parts when a complete part set is present
 * 2. Always validates required evidence files exist and are real art
 * 3. Fails the build if any required asset is missing, tiny, or a placeholder
 */

const root = path.resolve("public/evidence");
const partsDir = path.join(root, "parts");
const manifestPath = path.join(partsDir, "manifest.json");

const REQUIRED = [
  "ev-crumbs.svg",
  "ev-feather.svg",
  "ev-fountain.svg",
  "ev-receipt.svg",
  "ev-window.svg",
  "ev-witness.svg",
];

const MIN_BYTES = 1000;

function isUsableAsset(filePath) {
  if (!fs.existsSync(filePath)) return { ok: false, reason: "missing" };
  const size = fs.statSync(filePath).size;
  if (size < MIN_BYTES) return { ok: false, reason: `too small (${size}b)` };
  const head = fs.readFileSync(filePath, "utf8").slice(0, 64).trim();
  if (/^placeholder$/i.test(head) || head === "PLACEHOLDER") {
    return { ok: false, reason: "placeholder stub" };
  }
  if (!head.includes("<svg") && !head.includes("<?xml")) {
    return { ok: false, reason: "not an svg" };
  }
  return { ok: true, size };
}

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const [file, parts] of Object.entries(manifest)) {
    const target = path.join(root, file);
    const missing = parts.filter((p) => !fs.existsSync(path.join(partsDir, p)));
    if (missing.length) {
      console.log(
        "parts incomplete for",
        file,
        "—",
        missing.join(", "),
        "(will validate existing asset)",
      );
      continue;
    }
    const body = parts.map((p) => fs.readFileSync(path.join(partsDir, p), "utf8")).join("");
    if (body.trim().length < MIN_BYTES) {
      console.error(`FAIL: assembled ${file} is too small (${body.trim().length}b)`);
      process.exit(1);
    }
    fs.writeFileSync(target, body);
    console.log("assembled", file, body.length);
  }
} else {
  console.log("No parts manifest; validating committed evidence assets only.");
}

const failures = [];
for (const file of REQUIRED) {
  const result = isUsableAsset(path.join(root, file));
  if (!result.ok) {
    failures.push(`${file}: ${result.reason}`);
    console.error("FAIL", file, result.reason);
  } else {
    console.log("ok", file, `${result.size}b`);
  }
}

if (failures.length) {
  console.error(
    "\nEvidence assets failed validation. Commit real SVG files (or complete part sets) before shipping.\n" +
      failures.map((line) => `  - ${line}`).join("\n"),
  );
  process.exit(1);
}

console.log("Evidence assets validated.");
