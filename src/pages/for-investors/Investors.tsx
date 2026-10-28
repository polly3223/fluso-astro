import IndustryPage from "@/pages/personas/IndustryPage";

export default function Investors() {
  return (
    <IndustryPage
      ns="investors"
      backgroundLayer={true}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "mono", bg: "#7B61FF", badge: "A", label: "Affinity" },
        { kind: "mono", bg: "#C40000", badge: "C", label: "Carta" },
        { kind: "mono", bg: "#002B5C", badge: "PB", label: "Pitchbook" },
        { kind: "logo", src: "https://api.iconify.design/logos:crunchbase.svg", label: "Crunchbase" },
        { kind: "logo", src: "https://api.iconify.design/logos:linkedin-icon.svg", label: "LinkedIn" },
        { kind: "logo", src: "https://api.iconify.design/logos:notion-icon.svg", label: "Notion" },
        { kind: "logo", src: "https://api.iconify.design/logos:google-gmail.svg", label: "Gmail" },
        { kind: "logo", src: "https://api.iconify.design/logos:calendly.svg", label: "Calendly" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:angellist.svg", label: "AngelList" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:bloomberg.svg", label: "Bloomberg" },
      ]}
    />
  );
}
