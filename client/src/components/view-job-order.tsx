// components/ViewJobOrder.tsx
"use client";

import phpCurrency from "@/utils/phpCurrency";
import MotorsImage from "./motors-image";
import TriMotorsImage from "./trimotors-image";
import { EmptyItem } from "./empty-item";
import { Wrench } from "lucide-react";
import formatDate from "@/utils/format-date";
import { motorsdiagnosisItems } from "@/constants/motors-diagnosis";
import { trimotorsdiagnosisItems } from "@/constants/trimotors-diagnosis";
import { useMemo } from "react";
import { getJobOrderPageRange, getJobOrderPrintPageCount,} from "@/utils/job-order-pagination";

interface PreviewJobOrderProps {
  data?: Record<string, any>;
  isReprint?: boolean;
  printPage?: number;
  isPrintRestItems?: boolean;
}

const ViewJobOrder = ({
  data,
  isReprint = false,
  printPage,
  isPrintRestItems,
}: PreviewJobOrderProps) => {
 
  const resolvedPage = printPage ?? (isPrintRestItems ? 1 : 0);
  const totalPages = getJobOrderPrintPageCount(data);
  const isLastPage = !isReprint || resolvedPage >= totalPages - 1;
  const isFirstPage = !isReprint || resolvedPage === 0;
  const jobTotal = Number(data?.total_job_request) || 0;
  const partsTotal = Number(data?.total_parts_used) || 0;
  const grandTotal = Number(data?.job_order_details_sum_amount) || 0;

  const formatCurrency = (amount: number | undefined): string => {
    if (amount ===undefined) return "";
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

  // Get all jobs and parts from the full data
  const allJobs = data?.job_order_details?.filter((item: any) => item.type === "job_request") || [];
  const allParts = data?.job_order_details?.filter((item: any) => item.type === "parts_replacement") || [];


  const filteredJobs = useMemo(() => {
    if (!isReprint) return allJobs;
    const { start, end } = getJobOrderPageRange(resolvedPage);
    return allJobs.slice(start, end);
  }, [isReprint, resolvedPage, allJobs]);

  const filteredParts = useMemo(() => {
    if (!isReprint) return allParts;
    const { start, end } = getJobOrderPageRange(resolvedPage);
    return allParts.slice(start, end);
  }, [isReprint, resolvedPage, allParts]);

  // Get the max items for dynamic row matching
  const maxItems = Math.max(filteredJobs.length, filteredParts.length);

  // Format part detail - keeps brand and part number on one line
  const formatPartDetail = (part: any): string => {
    if (part?.part_brand && part?.part_number) {
      return `${part.part_brand}-${part.part_number}`;
    } else if (part?.part_brand) {
      return part.part_brand;
    } else if (part?.part_number) {
      return `#${part.part_number}`;
    }
    return "";
  };

  return (
    <>
      {/* Print sizing: content is 5in x 7.7in, rotated 90deg ONLY WHEN PRINTING
          so it prints upright on a normal Letter-size (8.5in x 11in) portrait
          short bond sheet -- no custom/landscape paper size needed on the
          printer. On screen, it displays normally (not rotated). After
          printing, the sheet is cut crosswise in half (5.5in each half),
          so content height must stay under ~5.3in (5.5in - 0.2in margin). */}
      {isReprint && (
        <style>{`
    @page {
      size: Letter portrait;
      margin: 0;
    }

    @media print {
      html,
      body {
        width: 8.5in;
        height: 11in;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      .print-page {
        position: relative;
        width: 8.5in;
        height: 11in;
        overflow: hidden;
      }

      .jo-rotate-wrapper {
        position: absolute;
        width: 7.9in;
        height: 5.3in;
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .jo-rotate-wrapper:nth-child(1) {
        top: .2in;
        left: 0;
      }

      .jo-rotate-wrapper:nth-child(2) {
        top: 5.55in;
        left: 0;
      }

      .jo-rotate-content {
        position: absolute;
        top: 0;
        left: 7.9in;
        transform: rotate(90deg);
        transform-origin: top left;
      }
    }

    /* Auto-wrap text in cells */
    .break-words {
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
      white-space: normal;
    }

    /* Prevent wrapping for numbers/amounts */
    .whitespace-nowrap {
      white-space: nowrap;
    }

    .break-inside-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `}</style>
      )}

      <div className={isReprint ? "print-page" : ""}>
        {Array.from({ length: isReprint ? 2 : 1 }).map((_, index) => (
          <div
            className={`jo-rotate-wrapper ${isReprint ? `mt-3 ml-3 ${index === 0 ? "border-b border-black border-dashed" : ""}` : ""}`}
            key={index}
          >
            <div
              className={`jo-rotate-content p-1 font-sans bg-white border border-black text-black leading-tight box-border`}
              style={
                isReprint
                  ? {
                      fontSize: "7.5pt",
                      width: "5.1in",
                      height: "7.45in",
                      maxWidth: "5.3in",
                      minHeight: "7.45in",
                      lineHeight: "1.15",
                      overflow: "hidden",
                    }
                  : {}
              }
            >
              {/* Header */}
              <div className="flex flex-col justify-center items-center mb-0.5">
                <div className="flex justify-between items-center w-full">
                  <div className="flex-1 font-bold text-[9px]">
                    {data.transaction_code}
                  </div>
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
                {isFirstPage && (
                  <h2
                    className="font-bold border-t border-b border-black py-0.5 my-0.5 text-center w-full"
                    style={isReprint ? { fontSize: "8pt", lineHeight: "1" } : {}}
                  >
                    VEHICLE CHECKLIST
                  </h2>
                )}
              </div>

              {isFirstPage ? (
                <>
                  {/* Vehicle Information */}
                  <div
                    className="mb-1 grid grid-cols-2 gap-x-2 gap-y-0.5"
                    style={{
                      fontSize: isReprint ? "7.5pt" : "9pt",
                      lineHeight: "1",
                    }}
                  >
                    <div className="flex">
                      <span className="font-bold w-16">Date:</span>
                      <span className="border-b border-black flex-1">
                        {data.date ? formatDate(new Date(data.date)) : "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-24">Engine/Frame No.:</span>
                      <span className="border-b border-black flex-1">
                        {data.engine_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-16">Branch Name:</span>
                      <span className="border-b border-black flex-1">
                        {data.customer.user.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-24">Mileage:</span>
                      <span className="border-b border-black flex-1">
                        {data.mileage || 0} km
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-16">Customer Name:</span>
                      <span className="border-b border-black flex-1">
                        {data.customer?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-24">Purchased Date:</span>
                      <span className="border-b border-black flex-1">
                        {data.purchase_date
                          ? formatDate(new Date(data.purchase_date))
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-16">Contact Number:</span>
                      <span className="border-b border-black flex-1">
                        {data.customer.contact_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-24">Estimated Repair Time:</span>
                      <span className="border-b border-black flex-1">
                        {data.estimated_repair_time || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-16">Model:</span>
                      <span className="border-b border-black flex-1">
                        {data.model || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-24">Repair Start Time:</span>
                      <span className="border-b border-black flex-1">
                        {data.repair_start || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-16">Address:</span>
                      <span className="border-b border-black flex-1">
                        {data.customer?.address || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-24">Repair End Time:</span>
                      <span className="border-b border-black flex-1">
                        {data.repair_end || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-16">Category:</span>
                      <span className="border-b border-black flex-1">
                        {data.category || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-24">Mechanic Name:</span>
                      <span className="border-b border-black flex-1">
                        {data.assignedMechanics
                          ?.map((m: any) => m.name)
                          .join(", ") ||
                          data.mechanics?.map((m: any) => m.name).join(", ") ||
                          ""}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-16">Dealers Name:</span>
                      <span className="border-b border-black flex-1">
                        {data.dealers_name || "N/A"}
                      </span>
                    </div>
                  </div>

              {/* {data?.job_order_type === "motors" ? (
          <MotorsImage data={data} />
        ) : (
          <TriMotorsImage data={data} />
        )} */}

                  {/* here */}
                  <div className="mb-1 text-xs">
                    <h3 className="font-bold text-center border-[0.1px] border-black py-0.5 bg-gray-100 text-[7.5pt]">
                      MOTORCYCLE'S DIAGNOSIS
                    </h3>

                    {data?.job_order_diagnosis?.length > 0 ? (
                      <table
                        className="w-full border-collapse border-[0.1px] border-black my-0"
                        style={{
                          fontSize: isReprint ? "7pt" : "9pt",
                          lineHeight: "1",
                        }}
                      >
                        <thead>
                          <tr className="bg-gray-40">
                            <th className="border-[0.1px] border-black p-0.5 text-left">
                              Diagnosis Item
                            </th>
                            <th className="border-[0.1px] border-black p-0.5 text-center">
                              Status
                            </th>
                            <th className="border-[0.1px] border-black p-0.5 text-left">
                              Remarks
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.job_order_diagnosis?.map(
                            (item: {
                              id: number;
                              title: string;
                              status: string;
                              remarks: string;
                            }) => (
                              <tr key={item.id}>
                                <td className="border-[0.1px] border-black p-px w-1/3">
                                  {[
                                    ...trimotorsdiagnosisItems,
                                    ...motorsdiagnosisItems,
                                  ].find((it) => it.key === item.title)?.label ||
                                    "N/A"}
                                </td>
                                <td className="border-[0.1px] border-black p-px text-center font-bold text-red-600 w-1/3">
                                  {item?.status?.toUpperCase() || "N/A"}
                                </td>
                                <td className="border-[0.1px] border-black p-px w-1/3">
                                  {item.remarks || "N/A"}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <div className="border-[0.1px] border-black p-1 text-center">
                        <p className="font-semibold">All diagnosis are OK</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div
                  className="mb-1 text-center font-bold border-[0.1px] border-black py-0.5 bg-gray-100"
                  style={{ fontSize: isReprint ? "7.5pt" : "9pt" }}
                >
                  JOB ORDER (continued)
                </div>
              )}

              {/* JOB ORDER */}
              <div
                className="mb-0.5 text-xs"
                style={isReprint ? { fontSize: "7pt", lineHeight: "1" } : {}}
              >
                <h3 className="font-bold text-center border-[0.1px] border-black py-0.5 bg-gray-100 text-[6.5pt]">
                  JOB ORDER
                </h3>
                <div className="flex gap-1">
                  <table
                    className="w-[42%] border-collapse border-[0.1px] border-black"
                    style={{
                      fontSize: isReprint ? "7pt" : "9pt",
                      lineHeight: "1",
                    }}
                  >
                    <thead>
                      <tr>
                        <th className="border-[0.1px] border-black p-px text-left text-[6.5pt]">
                          Specific Job(s) Request
                        </th>
                        <th className="border-[0.1px] border-black p-px text-center w-12 text-[6.5pt] whitespace-nowrap">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const rows = [];
                        for (let i = 0; i < maxItems; i++) {
                          const job = filteredJobs[i];
                          
                          if (job) {
                            const jobLabel = job.category || "";
                            const jobBrand = job.part_brand?.toLowerCase() !== "n/a" 
                              ? ` - ${job.part_brand}` 
                              : "";
                            
                            rows.push(
                              <tr key={`job_${i}`} className="break-inside-avoid">
                                <td
                                  className="border-[0.1px] border-black align-top"
                                  style={{ padding: "1px 3px" }}
                                >
                                  <span className="text-[7.5pt] leading-[1.2] block">
                                    ✓ {jobLabel}{jobBrand}
                                  </span>
                                </td>
                                <td
                                  className="border-[0.1px] border-black text-left align-top whitespace-nowrap"
                                  style={{ padding: "1px 3px" }}
                                >
                                  <span className="text-[7.5pt]">
                                    {formatCurrency(job.amount)}
                                  </span>
                                </td>
                              </tr>
                            );
                          } else {
                            rows.push(
                              <tr key={`job_empty_${i}`} className="break-inside-avoid">
                                <td
                                  className="border-[0.1px] border-black"
                                  style={{ padding: "1px 3px", height: "14px" }}
                                ></td>
                                <td
                                  className="border-[0.1px] border-black"
                                  style={{ padding: "1px 3px", height: "14px" }}
                                ></td>
                              </tr>
                            );
                          }
                        }
                        return rows;
                      })()}
                      <tr key="totals">
                        <td className="border-b border-black p-0.5 font-semibold text-[7.5pt]">
                          Total Labor Cost:
                        </td>
                        <td className="border-b border-black p-0.5 font-semibold text-[7.5pt] whitespace-nowrap">
                          {phpCurrency(jobTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table
                    className="w-[58%] border-collapse border-[0.1px] border-black"
                    style={{
                      fontSize: isReprint ? "6pt" : "9pt",
                      lineHeight: "1",
                      tableLayout: "fixed",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "27%" }} />
                      <col style={{ width: "9%" }} />
                      <col style={{ width: "42%" }} />
                      <col style={{ width: "22%" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="border-[0.1px] border-black p-px text-left text-[7.5pt]">
                          Parts Used
                        </th>
                        <th className="border-[0.1px] border-black p-px text-center text-[7.5pt] whitespace-nowrap">
                          Qty
                        </th>
                        <th className="border-[0.1px] border-black p-px text-left text-[7.5pt]">
                          Brand / Part No.
                        </th>
                        <th className="border-[0.1px] border-black p-px text-center text-[7.5pt] whitespace-nowrap">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const rows = [];
                        for (let i = 0; i < maxItems; i++) {
                          const part = filteredParts[i];
                          
                          if (part) {
                            const partDetail = formatPartDetail(part);
                            
                            rows.push(
                              <tr key={`part_${i}`} className="break-inside-avoid">
                                <td
                                  className="border-[0.1px] border-black align-top"
                                  style={{ padding: "1px 3px" }}
                                >
                                  <span className="text-[7.5pt] leading-[1.2] block">
                                    ✓ {part.category}
                                  </span>
                                </td>
                                <td
                                  className="border-[0.1px] border-black text-center align-top whitespace-nowrap"
                                  style={{ padding: "1px 3px" }}
                                >
                                  <span className="text-[7.5pt]">{part?.quantity || ""}</span>
                                </td>
                                <td
                                  className="border-[0.1px] border-black text-left align-top overflow-hidden"
                                  style={{ padding: "1px 3px" }}
                                >
                                  <span className="text-[7.5pt] leading-[1.2] block ">
                                    {partDetail || ""}
                                  </span>
                                </td>
                                <td
                                  className="border-[0.1px] border-black text-left align-top whitespace-nowrap"
                                  style={{ padding: "1px 3px" }}
                                >
                                  <span className="text-[7.5pt]">
                                    {formatCurrency(part?.amount)}
                                  </span>
                                </td>
                              </tr>
                            );
                          } else {
                            rows.push(
                              <tr key={`part_empty_${i}`} className="break-inside-avoid">
                                <td
                                  className="border-[0.1px] border-black"
                                  style={{ padding: "1px 3px", height: "14px" }}
                                ></td>
                                <td
                                  className="border-[0.1px] border-black"
                                  style={{ padding: "1px 3px", height: "14px" }}
                                ></td>
                                <td
                                  className="border-[0.1px] border-black"
                                  style={{ padding: "1px 3px", height: "14px" }}
                                ></td>
                                <td
                                  className="border-[0.1px] border-black"
                                  style={{ padding: "1px 3px", height: "14px" }}
                                ></td>
                              </tr>
                            );
                          }
                        }
                        return rows;
                      })()}
                      
                      <tr key="totals">
                        <td
                          className="border-b border-black p-0.5 font-semibold text-[7.5pt] "
                          colSpan={3}
                        >
                          Total Parts Cost:
                        </td>
                        <td className="border-b border-black p-0.5 font-semibold text-[7.5pt] whitespace-nowrap">
                          {phpCurrency(partsTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {isLastPage && (
                  <>
                    <div className="flex justify-between items-center border-[0.1px] border-black border-t-0 py-0.5">
                      <div className="font-bold ml-1">
                        Grand Total: {phpCurrency(grandTotal)}
                      </div>
                    </div>

                    <div className="py-1">
                      <span className="font-bold mr-2">
                        Your Next Service Schedule is:
                      </span>
                      <span className="underline inline-block">
                        {formatDate(
                          data.nextScheduleDate || data.next_schedule_date,
                        ) || "N/A"}
                      </span>
                      <span> or </span>
                      <span className="underline inline-block">
                        {data.nextScheduleKms || data.next_schedule_kms || "N/A"}
                      </span>
                      <span> kms (whichever comes first)</span>
                    </div>

                    <div className="flex mt-1">
                      <span className="font-bold mr-2">General Remarks:</span>
                      <span className="underline flex-1">
                        {data.general_remarks || "N/A"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Signatures */}
              {isLastPage && (
                <div
                  className="mt-0.5 grid grid-cols-3 gap-2 text-xs"
                  style={{
                    fontSize: isReprint ? "7.5pt" : "9pt",
                    lineHeight: "1",
                  }}
                >
                  <div className="text-center p-0.5">
                    <div className="mb-0.5 pb-0.5 h-4"></div>
                    <p
                      className="text-left mb-2"
                      style={{ fontSize: isReprint ? "7.5pt" : "9pt" }}
                    >
                      Prepared by:
                    </p>
                    <p className="underline">{data.service_advisor || "N/A"}</p>
                    <p
                      className="text-gray-600"
                      style={{ fontSize: isReprint ? "7pt" : "9pt" }}
                    >
                      (Signature Over Printed Name)
                    </p>
                    <p style={{ fontSize: isReprint ? "7pt" : "9pt" }}>
                      Salesrep/Service Advisor
                    </p>
                  </div>
                  <div className="text-center p-0.5">
                    <div className="mb-0.5 pb-0.5 h-4"></div>
                    <p
                      className="text-left mb-2"
                      style={{ fontSize: isReprint ? "7.5pt" : "9pt" }}
                    >
                      Checked by:
                    </p>
                    <p className="underline">{data.branch_manager || "N/A"}</p>
                    <p
                      className="text-gray-600"
                      style={{ fontSize: isReprint ? "7pt" : "9pt" }}
                    >
                      (Signature Over Printed Name)
                    </p>
                    <p style={{ fontSize: isReprint ? "7pt" : "9pt" }}>BM/BS</p>
                  </div>
                  <div className="text-center p-0.5">
                    <div className="mb-0.5 pb-0.5 h-4"></div>
                    <p
                      className="text-left mb-2"
                      style={{ fontSize: isReprint ? "7.5pt" : "9pt" }}
                    >
                      Conformed by:
                    </p>
                    <p className="underline">{data.customer?.name || "N/A"}</p>
                    <p
                      className="text-gray-600"
                      style={{ fontSize: isReprint ? "7pt" : "9pt" }}
                    >
                      (Signature Over Printed Name)
                    </p>
                    <p style={{ fontSize: isReprint ? "7pt" : "9pt" }}>
                      Customer
                    </p>
                  </div>
                </div>
              )}

              {isLastPage && (
                <>
                  <div className="flex mt-2" style={{ fontSize: "8pt" }}>
                    <span className="font-bold mr-2">Receipt #:</span>
                    <span className="w-30 border-b border-black mt-1">{data.receipt_number || ""}</span>
                  </div>
                  <div className="flex mt-1" style={{ fontSize: "8pt" }}>
                    <span className="font-bold mr-2">Cashier's Signature:</span>
                    <span className="w-30 border-b border-black mt-1"></span>
                  </div>

                  {/* Footer Note */}
                  <p className="mt-1 text-center text-red-600 font-bold text-lg">
                    {data.status === "cancelled" ? "CANCELLED" : ""}
                  </p>

                  <p
                    className="mt-0.5 text-center text-black"
                    style={{ fontSize: "8pt" }}
                  >
                    {data.reason_for_cancellation
                      ? data.reason_for_cancellation
                      : ""}
                  </p>
                </>
              )}

              {isReprint && index === 1 && (
                <span
                  className="absolute bottom-1 right-1 text-xs"
                  style={{ fontSize: "7pt" }}
                >
                  Customer's Copy
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewJobOrder;
