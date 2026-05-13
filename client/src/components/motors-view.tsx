// components/MotorsView.tsx
"use client";

import { format } from "date-fns";
import phpCurrency from "@/utils/phpCurrency";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface PreviewJobOrderProps {
  data?: any;
  jobOrderId?: string;
}

const MotorsView = ({ data, jobOrderId }: PreviewJobOrderProps) => {
  const [jobOrders, setJobOrders] = useState<any[]>([]);
  const [selectedJobOrder, setSelectedJobOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const resp = await api.get("/job-orders");
        
        if (!mounted) return;
        
        const fetchedJobOrders = resp.data?.data || [];
        setJobOrders(fetchedJobOrders);
        
        if (jobOrderId && fetchedJobOrders.length > 0) {
          const foundJob = fetchedJobOrders.find((job: any) => job.id === jobOrderId);
          if (foundJob) {
            setSelectedJobOrder(foundJob);
            setSelectedJobId(foundJob.id);
          } else if (fetchedJobOrders.length > 0) {
            setSelectedJobOrder(fetchedJobOrders[0]);
            setSelectedJobId(fetchedJobOrders[0].id);
          }
        } else if (fetchedJobOrders.length > 0) {
          setSelectedJobOrder(fetchedJobOrders[0]);
          setSelectedJobId(fetchedJobOrders[0].id);
        }
      } catch (err) {
        console.error("Error fetching job orders:", err);
        setError("Failed to load job orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!data) {
      fetchData();
    } else {
      setSelectedJobOrder(data);
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [jobOrderId, data]);

  const handleJobOrderChange = (jobId: string) => {
    const selected = jobOrders.find(job => job.id === jobId);
    if (selected) {
      setSelectedJobOrder(selected);
      setSelectedJobId(jobId);
    }
  };

  const displayData = selectedJobOrder || data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm">Loading job order data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 text-white px-4 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Directly use totals from database
  const jobTotal = displayData.job_total || 0;
  const partsTotal = displayData.parts_total || 0;
  const grandTotal = displayData.total_amount || (jobTotal + partsTotal);

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount || amount === 0) return "";
    return phpCurrency(amount);
  };

  const getBranchDisplay = () => {
    if (!displayData.branch) return "";
    return displayData.branch.replace("(", "").replace(")", "").split(" ")[0] || "";
  };

  // Get jobs array directly from database (assuming backend sends formatted array)
  const jobsList = displayData.jobs || displayData.jobsList || [];
  const partsList = displayData.parts || displayData.partsList || [];

  return (
    <div>
      {jobOrders.length > 0 && !data && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm print:hidden">
          <label className="font-bold mr-3 text-sm">Select Job Order:</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => handleJobOrderChange(e.target.value)}
            className="border border-gray-300 p-2 rounded-md text-sm"
          >
            {jobOrders.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_order_number} - {job.customer?.name} ({format(new Date(job.date), "MM/dd/yyyy")})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="p-1 font-sans bg-white text-black leading-tight border-2 border-black" style={{ fontSize: "8pt", maxWidth: "210mm", minHeight: "158mm", margin: "0", lineHeight: "1.2" }}>
        {/* Header */}
        <div className="flex flex-col justify-center items-center mb-1">
          <div className="flex justify-between items-center w-full">
            <div className="flex-1"></div>
            <img src="/smct-header.jpg" alt="Company Logo" className="h-10 w-auto" />
            <div className="flex-1 flex justify-end items-center">
              <h3 className="text-right font-bold">{getBranchDisplay()}-{displayData.jobOrderNumber || displayData.job_order_number || ""}</h3>
            </div>
          </div>
          <h2 className="font-bold border-t border-b border-black py-1 my-1 text-center w-full" style={{ fontSize: "8pt", lineHeight: "0.8" }}>VEHICLE CHECKLIST</h2>
        </div>

        {/* Vehicle Information */}
        <div className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
          <div className="flex">
            <span className="font-bold w-32">Date:</span>
            <span className="border-b border-black flex-1">{displayData.date ? format(new Date(displayData.date), "MM/dd/yyyy") : ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Engine/Frame No.:</span>
            <span className="border-b border-black flex-1">{displayData.engine_number || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Branch Name:</span>
            <span className="border-b border-black flex-1">{displayData.branch || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Mileage:</span>
            <span className="border-b border-black flex-1">{displayData.mileage || 0} km</span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Customer Name:</span>
            <span className="border-b border-black flex-1">{displayData.customer?.name || displayData.customerName || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Purchased Date:</span>
            <span className="border-b border-black flex-1">{displayData.purchaseDate || displayData.purchase_date || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Contact Number:</span>
            <span className="border-b border-black flex-1">{displayData.contact ||  ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Repair Start Time:</span>
            <span className="border-b border-black flex-1">{ displayData.repair_start || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Model:</span>
            <span className="border-b border-black flex-1">{displayData.model || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Repair End Time:</span>
            <span className="border-b border-black flex-1">{displayData.repair_end || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-32">Fuel Level:</span>
            <span className="border-b border-black flex-1">{displayData.fuel_level || ""}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-40">Mechanic Name:</span>
            <span className="border-b border-black flex-1">{displayData.assignedMechanics?.map((m: any) => m.name).join(", ") || displayData.mechanics?.map((m: any) => m.name).join(", ") || ""}</span>
          </div>
        </div>

        {/* Motorcycle Unit & Engine Unit */}
        <div className="mb-2 grid grid-cols-2 gap-2" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
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
              <div className="flex items-center justify-center overflow-hidden" style={{ height: "160px" }}>
                <img src="/motorcycle-unit.png" alt="Motorcycle Unit Diagram" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex mt-2">
              <span className="font-bold mr-1">Category:</span>
              <span className="border-b border-black flex-1">{displayData.category || ""} </span>
            </div>
          </div>
          <div className="border border-black p-0.5">
            <div className="font-bold mb-1">ENGINE UNIT:</div>
            <div className="mb-1">
              <div className="flex items-center justify-center overflow-hidden" style={{ height: "170px" }}>
                <img src="/engine-unit.png" alt="Engine Unit Diagram" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex mt-1">
              <span className="font-bold whitespace-nowrap mr-1">Engine Condition:</span>
              <span className="border-b border-black flex-1">{displayData.engineCondition || displayData.engine_condition || ""}</span>
            </div>
          </div>
        </div>

        <div className="flex mt-1 mb-2">
          <span className="font-bold w-40">Contents inside U-Box:</span>
          <span className="underline">{displayData.contentUbox || displayData.content_ubox || ""}</span>
        </div>

        {/* JOB ORDER */}
        <div className="mb-1 text-xs" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
          <h3 className="font-bold text-center border border-black py-1 bg-gray-100">JOB ORDER</h3>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black p-0.5 text-left">Specific Job(s) Request</th>
                <th className="border border-black p-0.5 text-center w-16">Amount</th>
                <th className="border border-black p-0.5 text-left">Parts Used</th>
                <th className="border border-black p-0.5 text-center w-10">Qty</th>
                <th className="border border-black p-0.5 text-left w-28">Brand / Part No.</th>
                <th className="border border-black p-0.5 text-center w-16">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Get the maximum length between jobs and parts
                const maxLength = Math.max(jobsList.length, partsList.length);
                
                if (maxLength === 0) {
                  return (
                    <tr key="no-data">
                      <td className="border border-black p-0.5 text-center" colSpan={6} style={{ padding: "2px 4px" }}>
                        No jobs or parts selected
                      </td>
                    </tr>
                  );
                }
                
                const rows = [];
                for (let i = 0; i < maxLength; i++) {
                  const job = jobsList[i];
                  const part = partsList[i];
                  
                  rows.push(
                    <tr key={i}>
                      <td className="border border-black p-0.5 h-3" style={{ padding: "2px 4px" }}>
                        {job && <span>[✓] {job.description || job.name || job.label}</span>}
                      </td>
                      <td className="border border-black p-0.5 text-left h-3" style={{ padding: "2px 4px" }}>
                        {job && formatCurrency(job.amount)}
                      </td>
                      <td className="border border-black p-0.5 h-3" style={{ padding: "2px 4px" }}>
                        {part && <span>[✓] {part.description || part.name || part.label}</span>}
                      </td>
                      <td className="border border-black p-0.5 text-center h-3" style={{ padding: "2px 4px" }}>
                        {part?.quantity || ""}
                      </td>
                      <td className="border border-black p-0.5 text-left text-[7pt] h-3" style={{ padding: "2px 4px" }}>
                        {part?.brand && part?.part_number ? `${part.brand}-${part.part_number}` : part?.brand || (part?.part_number ? `#${part.part_number}` : "")}
                      </td>
                      <td className="border border-black p-0.5 text-left h-3" style={{ padding: "2px 4px" }}>
                        {formatCurrency(part?.amount)}
                      </td>
                    </tr>
                  );
                }
                
                // Add totals row
                rows.push(
                  <tr key="totals">
                    <td className="border border-black p-0.5 font-semibold" colSpan={2}>
                      Total Labor Cost: {phpCurrency(jobTotal)}
                    </td>
                    <td className="border border-black p-0.5 font-semibold" colSpan={4}>
                      Total Parts Cost: {phpCurrency(partsTotal)}
                    </td>
                  </tr>
                );
                
                return rows;
              })()}
            </tbody>
          </table>

          <div className="flex justify-between items-center border border-black border-t-0 py-1">
            <div className="font-bold ml-1">Grand Total: {phpCurrency(Number(grandTotal))}</div>
          </div>

          <div className="py-2">
            <span className="font-bold mr-2">Your Next Service Schedule is:</span>
            <span className="border-b border-black w-18 inline-block">{displayData.nextScheduleDate || displayData.next_schedule_date || ""}</span>
            <span> or </span>
            <span className="border-b border-black w-25 inline-block">{displayData.nextScheduleKms || displayData.next_schedule_kms || ""}</span>
            <span> kms (whichever comes first)</span>
          </div>

          <div className="flex">
            <span className="font-semibold mr-2">General Remarks:</span>
            <span className="border-b border-black flex-1">{displayData.general_remarks || ""}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-1 grid grid-cols-3 gap-2 text-xs" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
          <div className="text-center p-0.5">
            <div className="mb-1 pb-1 h-6"></div>
            <p className="text-xs mb-2 text-left">Prepared by:</p>
            <p className="underline">{displayData.service_advisor || ""}</p>
            <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>(Signature Over Printed Name)</p>
            <p className="text-xxs">Salesrep/Service Advisor</p>
          </div>
          <div className="text-center p-0.5">
            <div className="mb-1 pb-1 h-6"></div>
            <p className="text-xs mb-2 text-left">Checked by:</p>
            <p className="underline">{ displayData.branch_manager || ""}</p>
            <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>(Signature Over Printed Name)</p>
            <p className="text-xxs">BM/BS</p>
          </div>
          <div className="text-center p-0.5">
            <div className="mb-1 pb-1 h-6"></div>
            <p className="text-xs mb-2 text-left">Conformed by:</p>
            <p className="underline">{displayData.customer?.name || ""}</p>
            <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>(Signature Over Printed Name)</p>
            <p className="text-xxs">Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorsView;