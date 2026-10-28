import Plans from "./sections/Plans";
import Trust from "./sections/Trust";
import Compare from "./sections/Compare";
import Faq from "./sections/Faq";
import Closing from "./sections/Closing";

export default function Pricing() {

  return (
    <div className="relative z-2 isolate flex flex-col gap-4 overflow-x-clip p-4" id="top">
      <Plans />
      <Trust />
      <Compare />
      <Faq />
      <Closing />
    </div>
  );
}
