// components/ViewJobOrder.tsx
"use client";

import { format } from "date-fns";
import phpCurrency from "@/utils/phpCurrency";
import MotorsImage from "./motors-image";
import TriMotorsImage from "./trimotors-image";
import { EmptyItem } from "./empty-item";
import { Wrench } from "lucide-react";
import formatDate from "@/utils/format-date";
import { jobItems } from "@/constants/job-items";

interface PreviewJobOrderProps {
  data?: any;
}

const ViewJobOrder = ({ data }: PreviewJobOrderProps) => {
  const jobTotal = Number(data.total_job_request) || 0;
  const partsTotal = Number(data.total_parts_used) || 0;
  const grandTotal = Number(data.job_order_details_sum_amount) || 0;

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount || amount === 0) return "";
    return phpCurrency(amount);
  };

  if (!data) {
    return (
      <EmptyItem
        icon={Wrench}
        title="Browse Job Order"
        description="Failed to load job orders. Please try again later."
      />
    );
  }

  return (
    <div>
      <div
        className="p-1 font-sans bg-white text-black leading-tight border-2 border-black"
        style={{
          fontSize: "8pt",
          maxWidth: "210mm",
          minHeight: "158mm",
          margin: "0",
          lineHeight: "1.2",
        }}
      >
        {/* Header */}
        <div className="flex flex-col justify-center items-center mb-1">
          <div className="flex justify-between items-center w-full">
            <div className="flex-1"></div>
            <img
              src="/smct-header.jpg"
              alt="Company Logo"
              className="h-10 w-auto"
            />
            <div className="flex-1 flex justify-end items-center">
              <h3 className="text-right font-bold">
                {`${data?.customer?.user?.code}-${data.job_order_number || "N/A"}`}
              </h3>
            </div>
          </div>
          <h2
            className="font-bold border-t border-b border-black py-1 my-1 text-center w-full"
            style={{ fontSize: "8pt", lineHeight: "0.8" }}
          >
            VEHICLE CHECKLIST
          </h2>
        </div>

        {/* Vehicle Information */}
        <div
          className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1"
          style={{ fontSize: "8pt", lineHeight: "0.8" }}
        >
          <div className="flex">
            <span className="font-bold w-32">Date:</span>
            <span className="border-b border-black flex-1">
              {data.date ? formatDate(new Date(data.date)) : "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Engine/Frame No.:</span>
            <span className="border-b border-black flex-1">
              {data.engine_number || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Branch Name:</span>
            <span className="border-b border-black flex-1">
              {data.customer.user.name || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Mileage:</span>
            <span className="border-b border-black flex-1">
              {data.mileage || 0} km
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Customer Name:</span>
            <span className="border-b border-black flex-1">
              {data.customer?.name || data.customerName || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Purchased Date:</span>
            <span className="border-b border-black flex-1">
              {data.purchase_date
                ? formatDate(new Date(data.purchase_date))
                : "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Contact Number:</span>
            <span className="border-b border-black flex-1">
              {data.customer.contact_number || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Repair Start Time:</span>
            <span className="border-b border-black flex-1">
              {data.repair_start || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Model:</span>
            <span className="border-b border-black flex-1">
              {data.model || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Repair End Time:</span>
            <span className="border-b border-black flex-1">
              {data.repair_end || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Fuel Level:</span>
            <span className="border-b border-black flex-1">
              {data.fuel_level || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Mechanic Name:</span>
            <span className="border-b border-black flex-1">
              {data.assignedMechanics?.map((m: any) => m.name).join(", ") ||
                data.mechanics?.map((m: any) => m.name).join(", ") ||
                ""}
            </span>
          </div>
        </div>

        {data?.job_order_type === "motors" ? (
          <MotorsImage data={data} />
        ) : (
          <TriMotorsImage data={data} />
        )}

        {/* JOB ORDER */}
        <div
          className="mb-1 text-xs"
          style={{ fontSize: "8pt", lineHeight: "0.8" }}
        >
          <h3 className="font-bold text-center border border-black py-1 bg-gray-100">
            JOB ORDER
          </h3>
          <div className="flex gap-1">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-0.5 text-left">
                    Specific Job(s) Request
                  </th>
                  <th className="border border-black p-0.5 text-center w-16">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.job_order_details.map((job: any, i: number) => (
                  <tr key={i}>
                    {job.type === "job_request" && (
                      <>
                        <td
                          className="border border-black p-0.5 h-3"
                          style={{ padding: "2px 4px" }}
                        >
                          <span>
                            [✓] {job.category}
                          </span>
                        </td>
                        <td
                          className="border border-black p-0.5 text-left h-3"
                          style={{ padding: "2px 4px" }}
                        >
                          {formatCurrency(job.amount)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                <tr key="totals">
                  <td className="border-b border-black p-0.5 font-semibold">
                    Total Labor Cost:
                  </td>
                  <td className="border-b border-black p-1 font-semibold">
                    {phpCurrency(jobTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-0.5 text-left">
                    Parts Used
                  </th>
                  <th className="border border-black p-0.5 text-center w-10">
                    Qty
                  </th>
                  <th className="border border-black p-0.5 text-left w-28">
                    Brand / Part No.
                  </th>
                  <th className="border border-black p-0.5 text-center w-16">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.job_order_details.map((job: any, i: number) => (
                  <tr key={i}>
                    {job.type === "parts_replacement" && (
                      <>
                        <td
                          className="border border-black p-0.5 h-3"
                          style={{ padding: "2px 4px" }}
                        >
                          <span>
                            [✓] {job.category}
                          </span>
                        </td>
                        <td
                          className="border border-black p-0.5 text-center h-3"
                          style={{ padding: "2px 4px" }}
                        >
                          {job?.quantity || "N/A"}
                        </td>
                        <td
                          className="border border-black p-0.5 text-left text-[7pt] h-3"
                          style={{ padding: "2px 4px" }}
                        >
                          {job?.part_brand && job?.part_number
                            ? `${job.part_brand}-${job.part_number}`
                            : job?.part_brand ||
                              (job?.part_number
                                ? `#${job.part_number}`
                                : "N/A")}
                        </td>
                        <td
                          className="border border-black p-0.5 text-left h-3"
                          style={{ padding: "2px 4px" }}
                        >
                          {formatCurrency(job?.amount)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                <tr key="totals">
                  <td
                    className="border-b border-black p-0.5 font-semibold"
                    colSpan={3}
                  >
                    Total Parts Cost:
                  </td>
                  <td className="border-b border-black p-1 font-semibold">
                    {phpCurrency(partsTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center border border-black border-t-0 py-1">
            <div className="font-bold ml-1">
              Grand Total: {phpCurrency(grandTotal)}
            </div>
          </div>

          {/* <div className="py-2">
            <span className="font-bold mr-2">
              Your Next Service Schedule is:
            </span>
            <span className="border-b border-black w-18 inline-block">
              {data.nextScheduleDate || data.next_schedule_date || "N/A"}
            </span>
            <span> or </span>
            <span className="border-b border-black w-25 inline-block">
              {data.nextScheduleKms || data.next_schedule_kms || "N/A"}
            </span>
            <span> kms (whichever comes first)</span>
          </div> */}

          <div className="flex mt-2">
            <span className="font-semibold mr-2">General Remarks:</span>
            <span className="border-b border-black flex-1">
              {data.general_remarks || "N/A"}
            </span>
          </div>
        </div>

        {/* Signatures */}
        <div
          className="mt-1 grid grid-cols-3 gap-2 text-xs"
          style={{ fontSize: "8pt", lineHeight: "0.8" }}
        >
          <div className="text-center p-0.5">
            <div className="mb-1 pb-1 h-6"></div>
            <p className="text-xs mb-2 text-left">Prepared by:</p>
            <p className="underline">{data.service_advisor || "N/A"}</p>
            <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
              (Signature Over Printed Name)
            </p>
            <p className="text-xxs">Salesrep/Service Advisor</p>
          </div>
          <div className="text-center p-0.5">
            <div className="mb-1 pb-1 h-6"></div>
            <p className="text-xs mb-2 text-left">Checked by:</p>
            <p className="underline">{data.branch_manager || "N/A"}</p>
            <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
              (Signature Over Printed Name)
            </p>
            <p className="text-xxs">BM/BS</p>
          </div>
          <div className="text-center p-0.5">
            <div className="mb-1 pb-1 h-6"></div>
            <p className="text-xs mb-2 text-left">Conformed by:</p>
            <p className="underline">{data.customer?.name || "N/A"}</p>
            <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
              (Signature Over Printed Name)
            </p>
            <p className="text-xxs">Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJobOrder;
