import type { MetadataRoute } from "next";
import { company } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.brand,
    short_name: company.brand,
    description: "تیم فروش فارسی‌زبان شما در اینستاگرام",
    lang: "fa",
    dir: "rtl",
    start_url: "/",
    display: "browser",
    background_color: "#fcfbff",
    theme_color: "#5f2ceb",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
