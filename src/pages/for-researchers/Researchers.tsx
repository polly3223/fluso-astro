import IndustryPage from "@/pages/personas/IndustryPage";

export default function Researchers() {
  return (
    <IndustryPage
      ns="researchers"
      backgroundLayer={false}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "logo", src: "https://api.iconify.design/simple-icons:zotero.svg", label: "Zotero" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:mendeley.svg", label: "Mendeley" },
        { kind: "mono", bg: "#2C5282", badge: "PM", label: "PubMed" },
        { kind: "mono", bg: "#B31B1B", badge: "aX", label: "arXiv" },
        { kind: "mono", bg: "#EE7C0E", badge: "SD", label: "ScienceDirect" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:orcid.svg", label: "ORCID" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:overleaf.svg", label: "Overleaf" },
        { kind: "mono", bg: "#4285F4", badge: "S", label: "Google Scholar" },
        { kind: "logo", src: "https://api.iconify.design/logos:slack-icon.svg", label: "Slack" },
        { kind: "logo", src: "https://api.iconify.design/logos:google-drive.svg", label: "Drive" },
      ]}
    />
  );
}
