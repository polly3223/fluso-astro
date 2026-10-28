import {useLocation} from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import Agents from "./home/sections/Agents";
import { useHomeBehavior } from "./home/useHomeBehavior";
import Hero from "./home/sections/Hero";
import HowItWorks from "./home/sections/HowItWorks";
import Capabilities from "./home/sections/Capabilities";
import Connectors from "./home/sections/Connectors";
import Privacy from "./home/sections/Privacy";
import Faq from "./home/sections/Faq";

export default function Home({agentDemo, chatDemo}: {agentDemo?: ReactNode; chatDemo?: ReactNode}) {
  useHomeBehavior();
  const {hash} = useLocation();
  useEffect(() => {
    if (hash !== '#agents') return;
    const frame = requestAnimationFrame(() => document.getElementById('agents')?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
        <Hero>{chatDemo}</Hero>
        <Agents>{agentDemo}</Agents>
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
