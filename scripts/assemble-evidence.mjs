import fs from "node:fs";
import path from "node:path";

const root = path.resolve("public/evidence");
const partsDir = path.join(root, "parts");
const manifestPath = path.join(partsDir, "manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.log("No evidence parts manifest; skipping assemble.");
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const [file, parts] of Object.entries(manifest)) {
  const target = path.join(root, file);
  const missing = parts.filter((p) => !fs.existsSync(path.join(partsDir, p)));
  if (missing.length) {
    const existing = fs.existsSync(target) ? fs.statSync(target).size : 0;
    console.log("skip", file, "missing parts:", missing.join(", "), `(keeping ${existing}b)`);
    continue;
  }
  const body = parts.map((p) => fs.readFileSync(path.join(partsDir, p), "utf8")).join("");
  // Never replace a real asset with an empty/tiny assemble result
  if (body.trim().length < 100) {
    console.log("skip", file, "assembled body too small");
    continue;
  }
  fs.writeFileSync(target, body);
  console.log("assembled", file, body.length);
}
