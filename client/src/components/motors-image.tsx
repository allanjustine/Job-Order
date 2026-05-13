export default function MotorsImage({ data }: { data: any }) {
  return (
    <div
      className="mb-2 grid grid-cols-2 gap-2"
      style={{ fontSize: "8pt", lineHeight: "0.8" }}
    >
      <div className="border border-black p-0.5">
        <div className="font-bold mb-1">MOTORCYCLE UNIT:</div>
        <div className="mb-1" style={{ fontSize: "6pt", lineHeight: "0.6" }}>
          <span className="font-bold mr-2">LEGEND:</span>
          <span className="mr-2">X-SCRATCH</span>
          <span className="mr-2">●-DENT</span>
          <span className="mr-2">■-CRACK</span>
          <span>□-NOT AVAILABLE</span>
        </div>
        <div className="mb-1">
          <div
            className="flex items-center justify-center overflow-hidden"
            style={{ height: "160px" }}
          >
            <img
              src="/motorcycle-unit.png"
              alt="Motorcycle Unit Diagram"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <span className="font-bold mr-1">Category:</span>
          <span className="border-b border-black flex-1">
            {data.category || ""}
          </span>
        </div>
      </div>
      <div className="border border-black p-0.5">
        <div className="font-bold mb-1">ENGINE UNIT:</div>
        <div className="mb-1">
          <div
            className="flex items-center justify-center overflow-hidden"
            style={{ height: "170px" }}
          >
            <img
              src="/engine-unit.png"
              alt="Engine Unit Diagram"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex mt-1">
          <span className="font-bold whitespace-nowrap mr-1">
            Engine Condition:
          </span>
          <span className="border-b border-black flex-1">
            {data.engineCondition || data.engine_condition || ""}
          </span>
        </div>
      </div>
    </div>
  );
}
