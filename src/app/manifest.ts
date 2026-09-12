import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Street Heists",
    short_name: "Heists",
    description:
      "A short comedy mystery with provided clues and one final accusation.",
    start_url: "/",
    display: "standalone",
    background_color: "#EEF2F6",
    theme_color: "#EEF2F6",
    orientation: "portrait",
    icons: [
      {
        src: "/keyhole.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
