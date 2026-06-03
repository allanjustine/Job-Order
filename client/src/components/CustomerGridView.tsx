import { format } from "date-fns";

export default function CustomerGridView({ data }: { data: any }) {
    return (
        <>
         <div
                className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1"
                style={{ fontSize: "8pt", lineHeight: "0.8" }}
              >
                <div className="flex">
                  <span className="font-bold w-32">Date:</span>
                  <span className="border-b border-black flex-1">
                    {format(new Date(data.date), "MM/dd/yyyy")}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-bold w-40">Engine/Frame No.:</span>
                  <span className="border-b border-black flex-1">
                    {data.engineFrameNo}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-bold w-32">Branch Name:</span>
                  <span className="border-b border-black flex-1">{data.branch}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-40">Mileage:</span>
                  <span className="border-b border-black flex-1">
                    {data.mileage} km
                  </span>
                </div>
                <div className="flex">
                  <span className="font-bold w-32">Customer Name:</span>
                  <span className="border-b border-black flex-1">
                    {data.customerName}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-bold w-40">Purchased Date:</span>
                  <span className="border-b border-black flex-1">
                    {data.purchaseDate}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-bold w-32">Contact Number:</span>
                  <span className="border-b border-black flex-1">{data.contact}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-40">Repair Start Time:</span>
                  <span className="border-b border-black flex-1">
                    {data.repairStart}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-bold w-32">Model:</span>
                  <span className="border-b border-black flex-1">{data.model}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-40">Repair End Time:</span>
                  <span className="border-b border-black flex-1">{data.repairEnd}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-32">Address:</span>
                  <span className="border-b border-black flex-1">{data.address}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-40">Mechanic Name:</span>
                  <span className="border-b border-black flex-1">
                    {data.assignedMechanics
                      ?.map((mechanic: any) => mechanic.name)
                      ?.join(", ")}
                  </span>
                </div>
              </div>
        </>
    );
}