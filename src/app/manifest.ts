import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Street Heists",
    short_name: "Heists",
    description: "Create and run fictional heists on real maps. Pure make-believe. Zero real crime.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B0C",
    theme_color: "#0B0B0C",
    orientation: "portrait",
    icons: [{ src: "/keyhole.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
