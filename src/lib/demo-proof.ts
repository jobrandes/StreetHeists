const PALETTES = [["#1a1712", "#3a2a14", "#C9A227"], ["#12161c", "#243044", "#8A6E2F"], ["#1c1214", "#4a2224", "#C43C3C"], ["#14120e", "#2c2618", "#F2F0EA"]];
export function makeDemoProof(label: string, beatIndex: number) {
  const canvas = document.createElement("canvas"); canvas.width = 720; canvas.height = 960;
  const ctx = canvas.getContext("2d"); if (!ctx) return "";
  const [deep, mid, accent] = PALETTES[beatIndex % PALETTES.length];
  const gradient = ctx.createLinearGradient(0, 0, 720, 960); gradient.addColorStop(0, deep); gradient.addColorStop(0.55, mid); gradient.addColorStop(1, "#0B0B0C");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 720, 960); ctx.strokeStyle = accent; ctx.lineWidth = 18; ctx.strokeRect(28, 28, 664, 904);
  ctx.fillStyle = accent; ctx.font = "600 22px sans-serif"; ctx.fillText("EVIDENCE  ·  STREET HEISTS", 64, 120);
  ctx.fillStyle = "#F2F0EA"; ctx.font = "italic 54px serif"; ctx.fillText(label, 64, 470);
  ctx.fillStyle = "rgba(242,240,234,0.7)"; ctx.font = "500 20px sans-serif"; ctx.fillText(new Date().toLocaleString(), 64, 860); ctx.fillText("DEMO STILL  ·  MAKE-BELIEVE", 64, 892);
  return canvas.toDataURL("image/jpeg", 0.86);
}
export function fileToDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); }); }
export function swatchProof(color: string, caption: string) {
  const svg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960"><rect width="720" height="960" fill="${color}"/><rect x="24" y="24" width="672" height="912" fill="none" stroke="#C9A227" stroke-width="10"/><text x="60" y="140" fill="#C9A227" font-family="serif" font-size="22">ARCHIVED STILL</text><text x="60" y="470" fill="#F2F0EA" font-family="serif" font-size="48">${caption}</text></svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}
