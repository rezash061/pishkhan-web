import { company } from "@/content/site";

/** Placeholder mark: a speech bubble that is also a counter (پیشخوان). Replace with the final brand. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pk-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5f2ceb" />
          <stop offset="0.65" stopColor="#f8486b" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#pk-g)" />
      <path d="M11 13.5h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H18l-5 4v-4h-2a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill="#fff" />
      <path d="M14.5 20.5h11" stroke="#5f2ceb" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-xl font-black tracking-tight">{company.brand}</span>
    </span>
  );
}
