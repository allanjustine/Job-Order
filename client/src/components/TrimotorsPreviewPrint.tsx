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

interface TrimotorsPreviewJobOrderProps {
  data: {
    branch: string;
    customerName: string;
    date: string;
    contact: string;
    model: string;
    engineFrameNo: string;
    purchaseDate: string;
    repairStart: string;
    repairEnd: string;
    fuelLevel: string;
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
    assignedMechanics: string[];
  };
}

const TrimotorsPreviewJobOrder = ({ data }: TrimotorsPreviewJobOrderProps) => {
  const renderCheckbox = (checked: boolean) => (checked ? "[✓]" : "[  ]");

  // Safely calculate totals with fallbacks including coupon
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

  // Get coupon data
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

  // Get all selected jobs including coupon, regular jobs, and multiple others items
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
        return; // Skip coupon as it's handled separately
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

  const diagnosisRows = [
    {
      leftLabel: "Windshield",
      leftKey: "windhsield",
      rightLabel: "Tape Hood",
      rightKey: "tapeHood",
    },
    {
      leftLabel: "Wipe Arm",
      leftKey: "wipeArm",
      rightLabel: "Aluminum",
      rightKey: "alumninum",
    },
    {
      leftLabel: "Front Indicator L/R",
      leftKey: "frontIndicator",
      rightLabel: "Nails & Screw",
      rightKey: "nailScrew",
    },
    {
      leftLabel: "Headlamp",
      leftKey: "frontHeadLamp",
      rightLabel: "Dashboard",
      rightKey: "dashboard",
    },
    {
      leftLabel: "Housing Scudo",
      leftKey: "housingScudo",
      rightLabel: "Seats Driver",
      rightKey: "seatsDriver",
    },
    {
      leftLabel: "Housing Headlamp L/R",
      leftKey: "housingHeadlamp",
      rightLabel: "Seats Passenger",
      rightKey: "seatsPassenger",
    },
    {
      leftLabel: "Front Fender",
      leftKey: "frontFender",
      rightLabel: "Seat Belts 4pcs",
      rightKey: "seatBelts",
    },
    {
      leftLabel: "Mud Flap",
      leftKey: "mudFlapFront",
      rightLabel: "Handle Leather",
      rightKey: "handleLeather",
    },
    {
      leftLabel: "Scudo/Front Paint",
      leftKey: "scudoFront",
      rightLabel: "Rubber Matting (F/R/C)",
      rightKey: "rubberMatting",
    },
    {
      leftLabel: "Emblem Logo",
      leftKey: "frontEmblem",
      rightLabel: "Underseat Cover",
      rightKey: "underseatCover",
    },
    {
      leftLabel: "Tail Lamp L/R",
      leftKey: "tailLamp",
      rightLabel: "Headlamp/Park Lamp",
      rightKey: "headlamp",
    },
    {
      leftLabel: "Bumper",
      leftKey: "bumper",
      rightLabel: "High/Low Beam",
      rightKey: "beam",
    },
    {
      leftLabel: "Mud Flap L/R",
      leftKey: "mudFlapRear",
      rightLabel: "Signal Lamps",
      rightKey: "signalLamp",
    },
    {
      leftLabel: "Rear Door",
      leftKey: "rearDoor",
      rightLabel: "Hazard Lamps",
      rightKey: "hazardlamp",
    },
    {
      leftLabel: "Emblem Logo",
      leftKey: "rearEmblem",
      rightLabel: "Wiper Motor",
      rightKey: "wiper",
    },
    {
      leftLabel: "Tail End Body Paint",
      leftKey: "tailEnd",
      rightLabel: "Lamps (Interior/Engine)",
      rightKey: "interiorLamp",
    },
    {
      leftLabel: "Beading",
      leftKey: "leftBeading",
      rightLabel: "Gauge Lamps",
      rightKey: "gaugeLamp",
    },
    {
      leftLabel: "Left Side Body Paint",
      leftKey: "leftBodyPaint",
      rightLabel: "Car Charger w/ Cap",
      rightKey: "carCharger",
    },
    {
      leftLabel: "Mud Guard",
      leftKey: "mudGuard",
      rightLabel: "Tools",
      rightKey: "tools",
    },
    {
      leftLabel: "Beading",
      leftKey: "rightBeading",
      rightLabel: "Battery",
      rightKey: "battery",
    },
    {
      leftLabel: "Right Side Body Paint",
      leftKey: "rightBodyPaint",
      rightLabel: "Jack",
      rightKey: "jack",
    },
    {
      leftLabel: "Check for Holes/Torn",
      leftKey: "checkHoles",
      rightLabel: "Spare Tire",
      rightKey: "spareTire",
    },
    {
      leftLabel: "Damage Stitching",
      leftKey: "damageStitching",
      rightLabel: "Side Mirror L/R",
      rightKey: "sideMirror",
    },
    {
      leftLabel: "Cover Hood Top",
      leftKey: "coverHood",
      rightLabel: "Warranty Booklet",
      rightKey: "warrantyBooklet",
    },
  ];

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
          <div className="flex-1"></div>
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
          <span className="font-bold w-32">Fuel Level:</span>
          <span className="border-b border-black flex-1">{data.fuelLevel}</span>
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
        <table
          className="w-full border-collapse border border-black my-0"
          style={{ fontSize: "8pt", lineHeight: "0.8" }}
        >
          <thead>
            <tr className="bg-gray-40">
              <th className="border border-black p-0.5 text-center"></th>
              <th className="border border-black p-0.5 text-center w-8">OK</th>
              <th className="border border-black p-0.5 text-center w-8">NG</th>
              <th className="border border-black p-0.5 text-center w-8">N/A</th>
              <th
                className="border border-black p-0.5 text-center w-24"
                colSpan={2}
              >
                Remarks
              </th>
              <th className="border border-black p-0.5 text-center"></th>
              <th className="border border-black p-0.5 text-center w-8">OK</th>
              <th className="border border-black p-0.5 text-center w-8">NG</th>
              <th className="border border-black p-0.5 text-center w-8">N/A</th>
              <th
                className="border border-black p-0.5 text-center w-24"
                colSpan={2}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {diagnosisRows.map((row, index) => {
              const leftItem =
                data.diagnosis?.[row.leftKey as keyof typeof data.diagnosis];
              const rightItem =
                data.diagnosis?.[row.rightKey as keyof typeof data.diagnosis];

              return (
                <tr key={index}>
                  <td className="border border-black p-0.5">{row.leftLabel}</td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.leftKey, "ok")}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.leftKey, "ng")}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.leftKey, "na")}
                  </td>
                  <td className="border border-black p-0.5" colSpan={2}>
                    {leftItem?.remarks || ""}
                  </td>
                  <td className="border border-black p-0.5">
                    {row.rightLabel}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.rightKey, "ok")}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.rightKey, "ng")}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.rightKey, "na")}
                  </td>
                  <td className="border border-black p-0.5" colSpan={2}>
                    {rightItem?.remarks || ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
                      jobLabel = job.label;
                    } else if (job.isOthers) {
                      jobLabel = `${job.label}`;
                    } else {
                      jobLabel = job.label;
                    }
                    jobAmount = phpCurrency(job.amount);
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
                    partAmount = phpCurrency(part.amount);
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

        {/* Next Service Schedule */}
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

        {/* General Remarks */}
        <div className="flex">
          <span className="font-semibold mr-2">General Remarks:</span>
          <span className="border-b border-black flex-1">
            {data.generalRemarks}
          </span>
        </div>
      </div>

      {/* Signatures */}
      <div
        className="mt-0.5 grid grid-cols-3 gap-2 text-xs"
        style={{ fontSize: "8pt", lineHeight: "0.8" }}
      >
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left">Prepared by:</p>
          <p className="underline">{data.serviceAdvisor}</p>
          <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
            (Signature Over Printed Name)
          </p>
          <p className="text-xxs">Salesrep/Service Advisor</p>
        </div>
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left">Checked by:</p>
          <p className="underline">{data.branchManager}</p>
          <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
            (Signature Over Printed Name)
          </p>
          <p className="text-xxs">BM/BS</p>
        </div>
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left">Conformed by:</p>
          <p className="underline">{data.customerName}</p>
          <p className="text-xs text-gray-600" style={{ fontSize: "7pt" }}>
            (Signature Over Printed Name)
          </p>
          <p className="text-xxs">Customer</p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-2 text-center" style={{ fontSize: "6pt" }}>
        Printed on: {format(new Date(), "MMMM dd, yyyy hh:mm a")}
      </p>
    </div>
  );
};

export default TrimotorsPreviewJobOrder;
