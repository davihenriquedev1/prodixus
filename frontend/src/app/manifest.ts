import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Prodixus",
    short_name: "Prodixus",
    description:
      "Organize suas tarefas e gerencie seus projetos com o Prodixus.",
    scope: "/",
    display: "standalone",
    background_color: "#080B12",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
