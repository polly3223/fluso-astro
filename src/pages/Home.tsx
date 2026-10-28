import { useHomeBehavior } from "./home/useHomeBehavior";
import Hero from "./home/sections/Hero";
import HowItWorks from "./home/sections/HowItWorks";
import Capabilities from "./home/sections/Capabilities";
import Connectors from "./home/sections/Connectors";
import Privacy from "./home/sections/Privacy";
import Faq from "./home/sections/Faq";

export default function Home() {
  useHomeBehavior();

  return (
    <>
        <Hero />
        <HowItWorks />
        <Capabilities />
        <div className="relative bg-ink">
        <Connectors />
        <Privacy />
        </div>
        <Faq />
    </>
  );
}
