import IndustryPage from "@/pages/personas/IndustryPage";

export default function Marketers() {
  return (
    <IndustryPage
      ns="marketers"
      backgroundLayer={true}
      ctaHref="https://form.typeform.com/to/vZnBDhzs"
      connectors={[
        { kind: "logo", src: "https://api.iconify.design/logos:google-analytics.svg", label: "GA4" },
        { kind: "logo", src: "https://api.iconify.design/logos:hubspot.svg", label: "HubSpot" },
        { kind: "logo", src: "https://api.iconify.design/logos:mailchimp.svg", label: "Mailchimp" },
        { kind: "logo", src: "https://api.iconify.design/simple-icons:klaviyo.svg", label: "Klaviyo" },
        { kind: "logo", src: "https://api.iconify.design/logos:segment-icon.svg", label: "Segment" },
        { kind: "logo", src: "https://api.iconify.design/logos:meta-icon.svg", label: "Meta Ads" },
        { kind: "logo", src: "https://api.iconify.design/logos:google-ads.svg", label: "Google Ads" },
        { kind: "logo", src: "https://api.iconify.design/logos:linkedin-icon.svg", label: "LinkedIn Ads" },
        { kind: "logo", src: "https://api.iconify.design/logos:figma.svg", label: "Figma" },
        { kind: "logo", src: "https://api.iconify.design/logos:notion-icon.svg", label: "Notion" },
      ]}
    />
  );
}
