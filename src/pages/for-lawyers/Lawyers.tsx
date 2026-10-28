

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import LegalHero from "./sections/LegalHero";
import Pillars from "./sections/Pillars";
import Practice from "./sections/Practice";
import PracticeAreas from "./sections/PracticeAreas";
import Security from "./sections/Security";
import UseCases from "./sections/UseCases";
import Enterprise from "./sections/Enterprise";
import Demo from "./sections/Demo";
import TalkToUs from "@/pages/for-lawyers/sections/TalkToUs.tsx";

export default function Lawyers() {

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollSnapType;
    root.style.scrollSnapType = "y proximity";
    return () => {
      root.style.scrollSnapType = prev;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">

      <div className="legal-page">
        <LegalHero />
        <Pillars />
        <Practice />
        <PracticeAreas />
        <Security />
        <UseCases />
        <Enterprise />
        {/*<TalkToUs />*/}
        <Demo />
      </div>
    </MotionConfig>
  );
}
