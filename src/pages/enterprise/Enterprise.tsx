import { useEnterpriseBehavior } from "./useEnterpriseBehavior";
import Hero from "./sections/Hero";
import Capabilities from "./sections/Capabilities";
import Confidential from "./sections/Confidential";
import Closing from "./sections/Closing";

export default function Enterprise() {
  useEnterpriseBehavior();

  return (
    <div className="relative z-2 isolate flex flex-col gap-4 overflow-x-clip p-4">
      <Hero />
      <Capabilities />
      <Confidential />
      <Closing />
    </div>
  );
}
