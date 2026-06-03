export default function NextServiceScheduleView({ data }: { data: any }) {
    return (
        <>
          <div className="py-2">
            <span className="font-bold mr-2">Your Next Service Schedule is:</span>
            <span className="border-b border-black w-18 inline-block">
                {data.nextScheduleDate}
            </span>
            <span> or </span>
            <span className="border-b border-black w-25 inline-block">
                {data.nextScheduleKms}
            </span>
            <span> kms </span>
            <span className="text-xs ml-2">(whichever comes first)</span>
          </div>

        <div className="flex">
          <span className="font-semibold mr-2">General Remarks:</span>
          <span className="flex-1 underline">
            {data.generalRemarks}
          </span>
        </div>

         <div
        className="mt-0.5 grid grid-cols-3 gap-2 text-xs"
        style={{ fontSize: "8pt", lineHeight: "0.8" }}
      >
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left mb-5">Prepared by:</p>
          <p className="underline">{data.serviceAdvisor}</p>
          <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
            (Signature Over Printed Name)
          </p>
          <p className="text-xxs">Salesrep/Service Advisor</p>
        </div>
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left mb-5">Checked by:</p>
          <p className="underline">{data.branchManager}</p>
          <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
            (Signature Over Printed Name)
          </p>
          <p className="text-xxs">BM/BS</p>
        </div>
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left mb-5">Conformed by:</p>
          <p className="underline">{data.customerName}</p>
          <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
            (Signature Over Printed Name)
          </p>
          <p className="text-xxs">Customer</p>
        </div>
      </div>

        </>
    )
}