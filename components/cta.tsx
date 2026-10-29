import { getTranslations } from "next-intl/server";
import { env } from "@/lib/env";
import { SignupLink } from "./signup-link";
import { ButtonLink, buttonClass } from "./ui";
import { Icon } from "./icons";

/**
 * The primary call to action. During closed beta it opens the waitlist; with `SIGNUP_MODE=signup` it goes
 * straight to the panel's sign-up (plan 4.9, WS-1.8).
 */
export async function StartCta({ plan, template, size = "md", variant = "primary", label, className = "" }: { plan?: string; template?: string; size?: "md" | "lg"; variant?: "primary" | "secondary"; label?: string; className?: string }) {
  const t = await getTranslations("nav");
  if (env.signupMode === "waitlist") {
    const query = new URLSearchParams();
    if (plan) query.set("plan", plan);
    if (template) query.set("vertical", template);
    const qs = query.toString();
    return (
      <ButtonLink href={`/waitlist${qs ? `?${qs}` : ""}`} variant={variant} size={size} arrow className={className} data-umami-event="cta_click">
        {label ?? t("start")}
      </ButtonLink>
    );
  }
  return (
    <SignupLink panelUrl={env.panelUrl} plan={plan} template={template} className={buttonClass(variant, size, className)}>
      {label ?? t("start")}
      <Icon name="arrow" className="size-4" />
    </SignupLink>
  );
}

export function panelLoginUrl(): string {
  return `${env.panelUrl}/login`;
}
