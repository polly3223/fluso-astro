import IndustryPage from "@/pages/personas/IndustryPage";

export default function Consultants() {
  return (
    <IndustryPage
      ns="consultants"
      backgroundLayer={true}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "logo", src: "https://api.iconify.design/logos:microsoft-sharepoint.svg", label: "SharePoint" },
        { kind: "logo", src: "https://api.iconify.design/logos:microsoft-teams.svg", label: "Teams" },
        { kind: "mono", bg: "#003865", badge: "CI", label: "CapIQ" },
        { kind: "mono", bg: "#002B5C", badge: "PB", label: "Pitchbook" },
        { kind: "logo", src: "https://api.iconify.design/logos:tableau-icon.svg", label: "Tableau" },
        { kind: "logo", src: "https://api.iconify.design/vscode-icons:file-type-excel.svg", label: "Excel" },
        { kind: "logo", src: "https://api.iconify.design/vscode-icons:file-type-powerpoint.svg", label: "PowerPoint" },
        { kind: "logo", src: "https://api.iconify.design/vscode-icons:file-type-outlook.svg", label: "Outlook" },
        { kind: "logo", src: "https://api.iconify.design/logos:salesforce.svg", label: "Salesforce" },
        { kind: "logo", src: "https://api.iconify.design/logos:jira.svg", label: "Jira" },
      ]}
    />
  );
}
