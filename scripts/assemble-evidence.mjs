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
  const body = parts.map((p) => fs.readFileSync(path.join(partsDir, p), "utf8")).join("");
  fs.writeFileSync(path.join(root, file), body);
  console.log("assembled", file, body.length);
}
