import { PREM_LOGO_PATHS } from "@/components/icons/static/prem-logo-data";

export function IconPrem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 313 324"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {PREM_LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
