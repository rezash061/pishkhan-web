import { getRequestConfig } from "next-intl/server";

// Persian only for now (assumption A4). `fa-AF` (Dari) arrives in Phase 4 with a locale segment and hreflang.
export default getRequestConfig(async () => ({
  locale: "fa",
  timeZone: "Asia/Tehran",
  messages: (await import("../messages/fa.json")).default,
}));
