import TorField from "./enterprise-visuals/TorField";

export default function EnterpriseField() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[59%] overflow-hidden max-lg:w-full max-lg:opacity-35"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 19%, black 100%)",
      }}
    >
      <TorField />
    </div>
  );
}
