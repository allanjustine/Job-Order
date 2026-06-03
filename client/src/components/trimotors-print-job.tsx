"use client";

import { format } from "date-fns";
import phpCurrency from "@/utils/phpCurrency";
import {
  TrimotorsDiagnosisKeys,
  DiagnosisState,
  TrimotorsJobAmountType,
  TrimotorsJobRequestType,
  TrimotorsPartsReplacement,
  TrimotorsPartsBrand,
  TrimotorsPartsNumber,
  TrimotorsPartsQuantity,
  TrimotorsPartsAmountsType,
  TrimotorsPartsOthersItem,
} from "@/types/jobOrderFormType";
import { trimotorsPartsItems } from "@/constants/trimotors-part-items";
import { trimotorsJobItems } from "@/constants/trimotors-job-items";
import { trimotorsdiagnosisItems } from "@/constants/trimotors-diagnosis";
import NextServiceScheduleView from "./NextServiceScheduleView";
import CustomerGridView from "./CustomerGridView";

interface TrimotorsPrintJobOrderProps {
  data: {
    branch: string;
    customerName: string;
    address: string;
    date: string;
    contact: string;
    model: string;
    engineFrameNo: string;
    purchaseDate: string;
    repairStart: string;
    repairEnd: string;
    // fuelLevel: string;
    mileage: string;
    motorcycleUnit: string;
    remarks: string;
    engineUnit: string;
    engineCondition: string;
    contentUbox: string;
    diagnosis: Record<TrimotorsDiagnosisKeys, DiagnosisState>;
    jobRequest: TrimotorsJobRequestType;
    jobAmounts: TrimotorsJobAmountType;
    partsReplacement: TrimotorsPartsReplacement;
    partsBrand: TrimotorsPartsBrand;
    partsNumber: TrimotorsPartsNumber;
    partsQuantity: TrimotorsPartsQuantity;
    partsAmounts: TrimotorsPartsAmountsType;
    nextScheduleDate: string;
    nextScheduleKms: string;
    generalRemarks: string;
    serviceAdvisor: string;
    branchManager: string;
    mechanic: string;
    jobOrderNumber: string;
    transactionCode: string;
    assignedMechanics: string[];
  };
}

const TrimotorsPrintJobOrder = ({ data }: TrimotorsPrintJobOrderProps) => {
  const renderCheckbox = (checked: boolean) => (checked ? "[✓]" : "[  ]");

  // Safely calculate totals with fallbacks
  const jobTotal = (() => {
    let total = 0;
    Object.entries(data.jobAmounts || {}).forEach(([key, value]) => {
      if (key !== 'selectedCoupon') {
        total += Number(value) || 0;
      }
    });
    // Add coupon amount if present
    if ((data.jobAmounts as any).selectedCoupon) {
      total += Number((data.jobAmounts as any).selectedCoupon);
    }
    return total;
  })();

  const partsTotal = Object.values(data.partsAmounts || {}).reduce(
    (s: number = 0, v) => s + (Number(v) || 0),
    0,
  )!;
  const grandTotal = jobTotal + partsTotal;

  // Helper function to safely get amount values
  const getJobAmount = (key: string): number => {
    return data.jobAmounts[key as keyof typeof data.jobAmounts] || 0;
  };

  const getPartsAmount = (key: string): number => {
    return data.partsAmounts[key as keyof typeof data.partsAmounts] || 0;
  };

  const getPartsQuantity = (key: string): number => {
    if (!data.partsQuantity) return 0;
    return data.partsQuantity[key as keyof TrimotorsPartsQuantity] || 0;
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount || amount === 0) return "";
    return phpCurrency(amount);
  };

  const formatPartDetail = (partKey: string): string => {
    const brand = data.partsBrand?.[partKey as keyof TrimotorsPartsBrand];
    const partNo = data.partsNumber?.[partKey as keyof TrimotorsPartsNumber];

    if (brand && partNo) {
      return `${brand}-${partNo}`;
    } else if (brand) {
      return brand;
    } else if (partNo) {
      return `#${partNo}`;
    }
    return "";
  };

  // Check if part is selected and has quantity
  const isPartSelected = (partKey: string): boolean => {
    return !!(
      data.partsReplacement?.[partKey as keyof TrimotorsPartsReplacement] &&
      getPartsQuantity(partKey) > 0
    );
  };

  // Get job item label from trimotorsJobItems
  const getJobItemLabel = (key: string): string => {
    const jobItem = trimotorsJobItems.find((item) => item.key === key);
    return jobItem ? jobItem.label : key;
  };

  // Get part label
  const getPartLabel = (key: string): string => {
    const partItem = trimotorsPartsItems.find((item) => item.key === key);
    return partItem ? partItem.label : key.replace(/([A-Z])/g, " $1").trim();
  };

  // Check if a job is selected (including others items)
  const isJobSelected = (jobKey: string): boolean => {
    if (jobKey === "others") {
      const othersItems = (data.jobRequest as any).othersItems;
      return !!(othersItems && othersItems.length > 0);
    }
    return !!data.jobRequest[jobKey as keyof TrimotorsJobRequestType];
  };

  const getCouponData = () => {
    if ((data.jobRequest as any).coupon && (data.jobRequest as any).selectedCoupon) {
      return {
        selectedCoupon: (data.jobRequest as any).selectedCoupon,
        couponBrand: (data.jobRequest as any).couponBrand,
        amount: (data.jobAmounts as any).selectedCoupon || 0
      };
    }
    return null;
  };

  // Get all selected jobs including multiple others items
  const getSelectedJobs = () => {
    const selectedJobs: Array<{
      key: string;
      label: string;
      amount: number;
      isOthers?: boolean;
      isCoupon?: boolean;
      description?: string;
    }> = [];

       // Add coupon as a job item if selected
  const couponData = getCouponData();
    if (couponData) {
      selectedJobs.push({
        key: 'coupon',
        label: `${couponData.selectedCoupon}${couponData.couponBrand ? ` - ${couponData.couponBrand}` : ''}`,
        amount: couponData.amount,
        isCoupon: true,
      });
    }

    // Add regular selected jobs
    trimotorsJobItems.forEach((item) => {
      if(item.key === "selectedCoupon"){
        return;
      }
      else if (item.key !== "others" && isJobSelected(item.key)) {
        selectedJobs.push({
          key: item.key,
          label: item.label,
          amount: getJobAmount(item.key),
          isOthers: false,
        });
      }
    });

    // Add others items if they exist
    const othersItems = (data.jobRequest as any).othersItems;
    if (othersItems && othersItems.length > 0) {
      othersItems.forEach((item: any, index: number) => {
        selectedJobs.push({
          key: `others_${item.id || index}`,
          label: item.description || `Custom Job ${index + 1}`,
          amount: item.amount || 0,
          isOthers: true,
          description: item.description,
        });
      });
    }

    return selectedJobs;
  };

  // Get all selected parts including multiple others items
  const getSelectedParts = () => {
    const selectedParts: Array<{
      key: string;
      label: string;
      quantity: number;
      detail: string;
      amount: number;
      isOthers?: boolean;
      description?: string;
      brand?: string;
      partNumber?: string;
    }> = [];

    // Add regular selected parts
    trimotorsPartsItems.forEach((item) => {
      if (item.key !== "partsOthers" && isPartSelected(item.key)) {
        selectedParts.push({
          key: item.key,
          label: item.label,
          quantity: getPartsQuantity(item.key),
          detail: formatPartDetail(item.key),
          amount: getPartsAmount(item.key),
          isOthers: false,
        });
      }
    });

    // Add parts others items if they exist
    const partsOthersItems = (data.partsReplacement as any).partsOthersItems;
    if (partsOthersItems && partsOthersItems.length > 0) {
      partsOthersItems.forEach(
        (item: TrimotorsPartsOthersItem, index: number) => {
          const brandInfo = item.brand ? item.brand : "";
          const partNoInfo = item.partNumber ? `-${item.partNumber}` : "";
          const detailText =
            brandInfo || partNoInfo ? `${brandInfo}${partNoInfo}` : "";

          selectedParts.push({
            key: `partsOthers_${item.id || index}`,
            label: item.description || `Custom Part ${index + 1}`,
            quantity: item.quantity || 1,
            detail: detailText,
            amount: item.amount || 0,
            isOthers: true,
            description: item.description,
            brand: item.brand,
            partNumber: item.partNumber,
          });
        },
      );
    }

    return selectedParts;
  };

  const getNGDiagnosisItems = () => {
    // FIX: Use trimotorsPartsItems instead of MotorsDiagnosisItem
    const diagnosisItems = trimotorsdiagnosisItems; // This should be the correct list of diagnosis items
  
    return diagnosisItems.filter(
      (item) => data.diagnosis?.[item.key as TrimotorsDiagnosisKeys]?.status === "ng"
    );
  };
  
  // Check if any diagnosis is NG
  const hasNGDiagnosis = () => {
    return getNGDiagnosisItems().length > 0;
  };
  
  // Check if all diagnosis are OK (no NG and at least one diagnosis exists)
  const allDiagnosisOK = () => {
    if (!data.diagnosis) return false;
    const diagnosisValues = Object.values(data.diagnosis);
    if (diagnosisValues.length === 0) return false;
    return diagnosisValues.every(
      (item) => item.status === "ok" || item.status === "na"
    );
  };

  // Helper function for diagnosis cells
  const renderStatusCell = (dataKey: string, statusType: string) => {
    const item = data.diagnosis?.[dataKey as keyof typeof data.diagnosis];
    return item?.status === statusType ? "✓" : "";
  };

  return (
    <div
      className="p-1 font-sans bg-white text-black leading-tight border-2 border-black"
      style={{
        fontSize: "8pt",
        maxWidth: "210mm",
        minHeight: "258mm",
        margin: "0",
        lineHeight: "0.10",
      }}
    >
      {/* Honda Header */}
      <div className="flex flex-col justify-center items-center mb-1">
        <div className="flex justify-between items-center w-full">
          <div className="flex-1 font-bold">{data.transactionCode}</div>
          <img
            src="/smct-header.jpg"
            alt="Company Logo"
            className="h-10 w-auto"
          />
          <div className="flex-1 flex justify-end items-center">
            <h3 className="text-right font-bold">
              {data.branch.replace("(", "").replace(")", "").split(" ")[0]}-
              {data.jobOrderNumber}
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

      {/* Vehicle Information - Compact Grid */}
       <CustomerGridView data={data} />

      {/* Motorcycle Unit & Engine Unit */}
      <div
        className="mb-2 grid grid-cols-1 gap-2"
        style={{ fontSize: "8pt", lineHeight: "0.8" }}
      >
        <div className="border border-black p-0.5">
          <div className="font-bold mb-1">TRIMOTOR UNIT:</div>
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
              style={{ height: "145px" }}
            >
              <img
                src="/trimotors.png"
                alt="Trimotors Unit Diagram"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold mr-1">Category:</span>
            <span className="border-b border-black flex-1">{data.remarks}</span>
          </div>
        </div>
      </div>

      {/* Motorcycle Diagnosis Section */}
      <div className="mb-2 text-xs">
        <h3 className="font-bold text-center border border-black py-0.5 bg-gray-100 text-[7pt]">
          TRIMOTORS' DIAGNOSIS
        </h3>
        
        {allDiagnosisOK() && (
          <div className="border border-black p-2 text-center">
            <p className="font-semibold">All diagnosis are OK</p>
          </div>
        )}
        
        {hasNGDiagnosis() && (
          <table
            className="w-full border-collapse border border-black my-0"
            style={{ fontSize: "8pt", lineHeight: "0.8" }}
          >
            <thead>
              <tr className="bg-gray-40">
                <th className="border border-black p-0.5 text-left">Diagnosis Item</th>
                <th className="border border-black p-0.5 text-center">Status</th>
                <th className="border border-black p-0.5 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {getNGDiagnosisItems().map((item) => (
                <tr key={item.key}>
                  <td className="border border-black p-0.5 w-1/3">
                    {item.label}
                  </td>
                  <td className="border border-black p-0.5 text-center font-bold text-red-600 w-1/3">
                    NG
                  </td>
                  <td className="border border-black p-0.5 w-1/3">
                    {data.diagnosis?.[item.key as TrimotorsDiagnosisKeys]?.remarks || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* JOB ORDER - Dynamic rows based on selected items (including multiple others) */}
      <div
        className="mb-1 text-xs"
        style={{ fontSize: "8pt", lineHeight: "0.8" }}
      >
        <h3 className="font-bold text-center border border-black py-1 bg-gray-100">
          JOB ORDER
        </h3>

        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-40">
              <th className="border border-black p-0.5 text-left">
                Specific Job(s) Request
              </th>
              <th className="border border-black p-0.5 text-center w-16">
                Amount
              </th>
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
            {(() => {
              const selectedJobs = getSelectedJobs();
              const selectedParts = getSelectedParts();

              // Get the maximum number of rows needed
              const totalRows = Math.max(
                selectedJobs.length,
                selectedParts.length,
              );

              const rows = [];

              // If nothing is selected, show empty state
              if (totalRows === 0) {
                rows.push(
                  <tr key="empty">
                    <td
                      className="border border-black p-0.5 text-center text-gray-500"
                      style={{ padding: "2px 4px" }}
                      colSpan={6}
                    >
                      No job requests or parts selected
                    </td>
                  </tr>,
                );
              } else {
                // Loop through based on the maximum length
                for (let i = 0; i < totalRows; i++) {
                  const job = selectedJobs[i];
                  const part = selectedParts[i];

                  // Job data
                  let jobLabel = "";
                  let jobAmount = "";
                  let jobCheckbox = "";

                  if (job) {
                    if (job.isCoupon) {
                      jobLabel = `${job.label}`;
                    } else if (job.isOthers) {
                      jobLabel = `${job.label}`;
                    } else {
                      jobLabel = job.label;
                    }
                    jobAmount =  phpCurrency(job.amount);
                    jobCheckbox = "[✓] ";
                  }

                  // Part data
                  let partLabel = "";
                  let partQty: string = "";
                  let partDetail = "";
                  let partAmount = "";
                  let partCheckbox = "";

                  if (part) {
                    if (part.isOthers) {
                      partLabel = `${part.label}`;
                    } else {
                      partLabel = part.label;
                    }
                    partQty = part.quantity > 0 ? part.quantity.toString() : "";
                    partDetail = part.detail;
                    partAmount = formatCurrency(part.amount)
                    partCheckbox = "[✓] ";
                  }

                  rows.push(
                    <tr key={i}>
                      <td
                        className="border border-black p-0.5 h-3"
                        style={{ padding: "2px 4px" }}
                      >
                        {job && (
                          <span>
                            {jobCheckbox}
                            {jobLabel}
                          </span>
                        )}
                      </td>
                      <td
                        className="border border-black p-0.5 text-left h-3"
                        style={{ padding: "2px 4px" }}
                      >
                        {jobAmount}
                      </td>
                      <td
                        className="border border-black p-0.5 h-3"
                        style={{ padding: "2px 4px" }}
                      >
                        {part && (
                          <span>
                            {partCheckbox}
                            {partLabel}
                          </span>
                        )}
                      </td>
                      <td
                        className="border border-black p-0.5 text-center h-3"
                        style={{ padding: "2px 4px" }}
                      >
                        {partQty}
                      </td>
                      <td
                        className="border border-black p-0.5 text-left text-[7pt] h-3"
                        style={{ padding: "2px 4px" }}
                      >
                        {partDetail}
                      </td>
                      <td
                        className="border border-black p-0.5 text-left h-3"
                        style={{ padding: "2px 4px" }}
                      >
                        {partAmount}
                      </td>
                    </tr>,
                  );
                }
              }

              // Add totals row (only if there are selections)
              if (totalRows > 0) {
                rows.push(
                  <tr key="totals">
                    <td
                      className="border border-black p-0.5 font-semibold"
                      style={{ padding: "2px 4px" }}
                      colSpan={2}
                    >
                      Total Labor Cost: {phpCurrency(jobTotal)}
                    </td>
                    <td
                      className="border border-black p-0.5 font-semibold"
                      style={{ padding: "2px 4px" }}
                      colSpan={4}
                    >
                      Total Parts Cost: {phpCurrency(partsTotal)}
                    </td>
                  </tr>,
                );
              }

              return rows;
            })()}
          </tbody>
        </table>

        {/* Grand Total */}
        <div className="flex justify-between items-center border border-black border-t-0 py-1">
          <div className="font-bold ml-1 text-xxs">
            Grand Total: {phpCurrency(grandTotal)}
          </div>
        </div>
      </div>

         <NextServiceScheduleView data={data} />

      {/* Footer Note */}
      <p className="mt-2 text-center" style={{ fontSize: "6pt" }}>
        Printed on: {format(new Date(), "MMMM dd, yyyy hh:mm a")}
      </p>
    </div>
  );
};

export default TrimotorsPrintJobOrder;
