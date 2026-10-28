import { useEffect } from "react";
import i18n from "@/i18n";

export function useDownloadBehavior(): void {
  useEffect(() => {

    var dl = (key: string): string => i18n.t(key as never, { ns: "download" });

    var DOWNLOADS: Record<
      string,
      { href: string; title: string; meta: string; icon: string }
    > = {
      "mac-arm64": {
        href: "https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-arm64.dmg",
        title: dl("platforms.downloads.mac-arm64.title"),
        meta: dl("platforms.downloads.mac-arm64.meta"),
        icon: "mac",
      },
      "mac-x64": {
        href: "https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-x64.dmg",
        title: dl("platforms.downloads.mac-x64.title"),
        meta: dl("platforms.downloads.mac-x64.meta"),
        icon: "mac",
      },
      windows: {
        href: "https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-windows.exe",
        title: dl("platforms.downloads.windows.title"),
        meta: dl("platforms.downloads.windows.meta"),
        icon: "windows",
      },
    };

    var SECONDARY_CARD_CLASS =
      "flex cursor-pointer items-center gap-3.5 rounded-[14px] border border-[rgba(12,12,12,0.08)] bg-[rgba(12,12,12,0.035)] px-4.5 py-4 text-(--text-primary) no-underline transition-[background,border-color] duration-180 ease-[ease] [-webkit-tap-highlight-color:transparent] hover:border-[rgba(12,12,12,0.18)] hover:bg-[rgba(12,12,12,0.055)] max-[640px]:py-4.5";
    var CARD_TEXT_CLASS = "flex min-w-0 flex-auto flex-col gap-[3px] text-left";
    var SECONDARY_TITLE_CLASS =
      "text-[15.5px] leading-[1.2] font-medium tracking-[-0.01em]";
    var CARD_META_CLASS =
      "font-[family-name:JetBrains_Mono,monospace] text-[11px] leading-[1.3] tracking-[0.12em] uppercase text-(--text-muted)";

    var ICONS: Record<string, string> = {
      mac: '<path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/>',
      windows:
        '<path d="M3 5.7l8.2-1.12V11.5H3V5.7zm0 6.8h8.2v6.92L3 18.3v-5.8zM12.3 4.42L21 3.2v8.3h-8.7V4.42zm0 8.08H21v8.3l-8.7-1.22V12.5z"/>',
    };

    function guessPlatform() {
      var ua = navigator.userAgent || "";
      if (/Windows|Win64|Win32|WOW64/i.test(ua)) return "windows";
      return "mac-arm64";
    }

    var ICON_CLASS = { lg: "shrink-0", sm: "shrink-0 opacity-85" };

    function buildIconSvg(iconKey: string, sizeClass: "lg" | "sm") {
      return (
        '<svg class="' +
        ICON_CLASS[sizeClass] +
        '" width="' +
        (sizeClass === "sm" ? 24 : 28) +
        '" height="' +
        (sizeClass === "sm" ? 24 : 28) +
        '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        (ICONS[iconKey] || ICONS.mac) +
        "</svg>"
      );
    }

    function applyPlatform() {
      var detected = guessPlatform();
      var primary = document.getElementById("dl-primary");
      var others = document.getElementById("dl-others");
      var detectedLabel = document.getElementById("dl-detected-label");
      var quitKbd = document.getElementById("dl-quit-kbd");
      var step2 = document.getElementById("dl-step-2");
      var step3 = document.getElementById("dl-step-3");

      if (!primary || !others) return;

      var entry = DOWNLOADS[detected];
      primary.setAttribute("href", entry.href);
      primary.setAttribute("data-platform", detected);
      primary.querySelector("[data-title]")!.textContent = entry.title;
      primary.querySelector("[data-meta]")!.textContent = entry.meta;
      var oldIcon = primary.querySelector("[data-icon]");
      if (oldIcon) {

        oldIcon.outerHTML = buildIconSvg(entry.icon, "lg").replace(
          "<svg ",
          "<svg data-icon ",
        );
      }

      var prettyName = dl("platforms.downloads." + detected + ".prettyName");
      if (detectedLabel)
        detectedLabel.textContent = dl("platforms.detectedPrefix") + " · " + prettyName;

      var otherKeys = Object.keys(DOWNLOADS).filter(function (k) {
        return k !== detected;
      });
      others.innerHTML = otherKeys
        .map(function (key) {
          var d = DOWNLOADS[key];
          return (
            '<a class="' +
            SECONDARY_CARD_CLASS +
            '" href="' +
            d.href +
            '" download data-platform="' +
            key +
            '">' +
            buildIconSvg(d.icon, "sm") +
            '<span class="' +
            CARD_TEXT_CLASS +
            '">' +
            '<span class="' +
            SECONDARY_TITLE_CLASS +
            '">' +
            d.title +
            "</span>" +
            '<span class="' +
            CARD_META_CLASS +
            '">' +
            d.meta +
            "</span>" +
            "</span>" +
            "</a>"
          );
        })
        .join("");

      var isWin = detected === "windows";
      // Keyboard shortcuts are OS key-combo literals, not translated copy.
      if (quitKbd) quitKbd.textContent = isWin ? "Alt+F4" : "⌘Q";
      if (step2)
        step2.innerHTML = isWin
          ? dl("install.steps.open.windows")
          : dl("install.steps.open.mac");
      if (step3)
        step3.innerHTML = isWin
          ? dl("install.steps.place.windows")
          : dl("install.steps.place.mac");
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyPlatform);
    } else {
      applyPlatform();
    }
  }, []);
}
