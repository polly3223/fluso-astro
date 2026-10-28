import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { FlusoText } from "@/components/FlusoWordmark";

export default function LegalWordmark({ className }: { className?: string }) {
  const { t } = useTranslation("lawyers");
  return (
    <span
      className={cn(
        "relative top-[-3px] inline-block whitespace-nowrap pr-[2.15em]",
        className,
      )}
    >
      <FlusoText />
      <em className="ml-1 top-[4px] relative font-serif text-[1em] font-normal italic leading-none tracking-[0.01em]">
        {t("wordmarkSuffix")}
      </em>
    </span>
  );
}
