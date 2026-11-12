import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nirvana Paws Initiative & Academy (NPIA)",
    short_name: "NPIA.",
    description:
      "Uniting animal shelters, veterinary clinics, rescuers, and volunteers across India to save street animals today while building NPIA's flagship sanctuary and Canine Academy.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFFFD",
    theme_color: "#0b1c0e",
    lang: "en-IN",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/npia-md.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
