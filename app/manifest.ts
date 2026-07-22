import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "자격증 문제 연습",
    short_name: "자격증 연습",
    description: "필기 CBT와 실기 필답형 자격증 문제를 연습하는 앱",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#111613",
    theme_color: "#111613",
    lang: "ko",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
