import IndustryPage from "@/pages/personas/IndustryPage";

export default function Operations() {
  return (
    <IndustryPage
      ns="operations"
      backgroundLayer={true}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "logo", src: "https://api.iconify.design/simple-icons:quickbooks.svg", label: "Quickbooks" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:billdotcom.svg", label: "Bill.com" },
        { kind: "logo", src: "https://api.iconify.design/logos:stripe.svg", label: "Stripe" },
        { kind: "logo", src: "https://api.iconify.design/logos:okta-icon.svg", label: "Okta" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:bamboohr.svg", label: "BambooHR" },
        { kind: "logo", src: "https://api.iconify.design/logos:zendesk-icon.svg", label: "Zendesk" },
        { kind: "mono", bg: "#0F1830", badge: "IC", label: "Ironclad" },
        { kind: "logo", src: "https://api.iconify.design/logos:asana-icon.svg", label: "Asana" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:pagerduty.svg", label: "Pagerduty" },
        { kind: "logo", src: "https://api.iconify.design/logos:slack-icon.svg", label: "Slack" },
      ]}
    />
  );
}
