import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_BODY_SMALL, TYPE_CTA, TYPE_LEAD } from "@/components/typography";
import FaqList from "@/components/FaqList";
import { TITLE } from "./_chrome";

const FAQ_LINE = cn(
  "block text-[rgba(242,241,237,0.7)] [&_a]:border-b [&_a]:border-[rgba(242,241,237,0.4)] [&_a]:pb-px [&_a]:text-[#faf9f5] [&_a]:transition-[border-color] [&_a]:duration-[180ms] [&_a:hover]:border-[rgba(242,241,237,0.9)]",
  TYPE_BODY_SMALL,
);

export default function Faq() {
  const { t } = useTranslation("home");

  return (
    <section
      id="faq"
      className={cn("relative flex w-full flex-col min-h-dvh max-lg:h-auto max-lg:min-h-0")}
    >
      <main
        data-nav-dark
        className={cn(
          "min-h-dvh theme-light px-12 py-32 ",
          "relative flex items-center justify-start flex-col text-(--text-primary)",
        )}
      >
        <div
          className={cn(
            "grid  grid-cols-[minmax(280px,1fr)_minmax(0,1.8fr)] items-start gap-[clamp(36px,5vw,84px)]",
            "max-lg:grid-cols-1 max-lg:gap-8",
          )}
        >
          <aside className="sticky top-[calc(var(--nav-h)+64px)] max-lg:static">
            <h1 className={cn(TITLE, "text-(--text-primary) text-[#faf9f5]")} id="faq-title">
              <Trans t={t} i18nKey="faq.title" components={{ br: <br /> }} />
            </h1>
              <p className={cn("mt-[clamp(20px,2.6vh,32px)] mb-[clamp(32px,4vh,44px)] max-w-[34ch] text-[rgba(242,241,237,0.78)] max-lg:max-w-none", TYPE_LEAD)}>
              {t("faq.subtitle")}
            </p>
            <a
              className={cn(

                "group/faqcta inline-flex items-center gap-2 rounded-full border border-[#faf9f5] text-[#0c0c0c] bg-[#faf9f5] px-[22px] py-[13px] font-sans font-medium no-underline",
                TYPE_CTA,
                "transition-[transform,background,color,border-color] ease-[ease] hover:-translate-y-0.5 hover:bg-[#1d1d1d] hover:text-[#faf9f5] hover:border-[#1d1d1d]",
              )}
              data-platform-cta
              href="https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-arm64.dmg"
              download
            >
              <svg
                className="-mt-px shrink-0 transition-transform duration-[220ms] ease-[ease] group-hover/faqcta:scale-[1.06]"
                data-platform-icon
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
              </svg>
              <span data-platform-label>{t("faq.downloadMac")}</span>
            </a>
            <div className="mt-[clamp(28px,4vh,40px)] flex flex-col gap-[clamp(12px,1.4vh,18px)]">
              <span className={FAQ_LINE}>
                <Link to="/download">{t("faq.allInstallers")}</Link>
              </span>
              <span className={FAQ_LINE}>
                <Trans
                  t={t}
                  i18nKey="faq.enterpriseLine"
                  components={{
                    contact: (
                      <a
                        href="https://form.typeform.com/to/vZnBDhzs"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                />
              </span>
            </div>
          </aside>

          <FaqList
            variant="dark"
            answerComponents={{
              pricing: <Link to="/pricing" />,
              download: <Link to="/download" />,
              contact: (
                <a href="https://form.typeform.com/to/vZnBDhzs" target="_blank" rel="noopener noreferrer" />
              ),
            }}
          />
        </div>
      </main>
    </section>
  );
}
