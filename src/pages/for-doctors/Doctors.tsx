import IndustryPage from "@/pages/personas/IndustryPage";

export default function Doctors() {
  return (
    <IndustryPage
      ns="doctors"
      backgroundLayer={false}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "mono", bg: "#C8102E", badge: "E", label: "Epic" },
        { kind: "mono", bg: "#5C5C5C", badge: "C", label: "Cerner" },
        { kind: "mono", bg: "#79237F", badge: "A", label: "Athena" },
        { kind: "mono", bg: "#007F73", badge: "D", label: "Doximity" },
        { kind: "mono", bg: "#0066CC", badge: "UD", label: "UpToDate" },
        { kind: "mono", bg: "#1E5A8C", badge: "eC", label: "eClinicalWorks" },
        { kind: "logo", src: "https://api.iconify.design/logos:salesforce.svg", label: "Salesforce Health Cloud" },
        { kind: "logo", src: "https://api.iconify.design/logos:twilio-icon.svg", label: "Twilio" },
        { kind: "logo", src: "https://api.iconify.design/vscode-icons:file-type-outlook.svg", label: "Outlook" },
        { kind: "logo", src: "https://api.iconify.design/logos:microsoft-teams.svg", label: "Teams" },
      ]}
    />
  );
}
