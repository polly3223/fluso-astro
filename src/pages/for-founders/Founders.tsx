import IndustryPage from "@/pages/personas/IndustryPage";

export default function Founders() {
  return (
    <IndustryPage
      ns="founders"
      backgroundLayer={true}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "logo", src: "https://api.iconify.design/logos:stripe.svg", label: "Stripe" },
        { kind: "logo", src: "https://api.iconify.design/logos:hubspot.svg", label: "HubSpot" },
        { kind: "logo", src: "https://api.iconify.design/logos:notion-icon.svg", label: "Notion" },
        { kind: "logo", src: "https://api.iconify.design/logos:linear-icon.svg", label: "Linear" },
        { kind: "logo", src: "https://api.iconify.design/logos:slack-icon.svg", label: "Slack" },
        { kind: "logo", src: "https://api.iconify.design/logos:google-gmail.svg", label: "Gmail" },
        { kind: "logo", src: "https://api.iconify.design/logos:calendly.svg", label: "Calendly" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:brex.svg", label: "Brex" },
        { kind: "logo", src: "https://api.iconify.design/logos:loom-icon.svg", label: "Loom" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:mercury.svg", label: "Mercury" },
      ]}
    />
  );
}
