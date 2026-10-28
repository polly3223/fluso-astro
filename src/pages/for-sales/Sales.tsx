import IndustryPage from "@/pages/personas/IndustryPage";

export default function Sales() {
  return (
    <IndustryPage
      ns="sales"
      backgroundLayer={true}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "logo", src: "https://api.iconify.design/logos:salesforce.svg", label: "Salesforce" },
        { kind: "logo", src: "https://api.iconify.design/logos:hubspot.svg", label: "HubSpot" },
        { kind: "mono", bg: "#5952FF", badge: "O", label: "Outreach" },
        { kind: "mono", bg: "#20BFAA", badge: "SL", label: "Salesloft" },
        { kind: "mono", bg: "#6C47FF", badge: "G", label: "Gong" },
        { kind: "mono", bg: "#2B66F8", badge: "A", label: "Apollo" },
        { kind: "logo", src: "https://api.iconify.design/logos:linkedin-icon.svg", label: "LinkedIn" },
        { kind: "logo", src: "https://api.iconify.design/logos:calendly.svg", label: "Calendly" },
        { kind: "logo", src: "https://api.iconify.design/logos:docusign-icon.svg", label: "DocuSign" },
        { kind: "mono", bg: "#FF6B35", badge: "C", label: "Clay" },
      ]}
    />
  );
}
