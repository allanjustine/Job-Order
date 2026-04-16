// components/PreviewPrint.tsx
"use client";

import { format } from "date-fns";
import phpCurrency from "@/utils/phpCurrency";
import {
  DiagnosisKeys,
  DiagnosisState,
  JobAmountsType,
  PartsAmountsType,
  JobRequest,
  PartsReplacement,
  PartsBrand,
  PartsNumber,
  PartsQuantity 
} from "@/types/jobOrderFormType";

interface PrintJobOrderProps {
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
    diagnosis: Record<DiagnosisKeys, DiagnosisState>;
    jobRequest: JobRequest;
    partsReplacement: PartsReplacement;
    partsBrand: PartsBrand;
    partsNumber: PartsNumber;
    partsQuantity: PartsQuantity;
    jobAmounts: JobAmountsType;
    partsAmounts: PartsAmountsType;
    nextScheduleDate: string;
    nextScheduleKms: string;
    generalRemarks: string;
    serviceAdvisor: string;
    branchManager: string;
    mechanic: string;
    jobOrderNumber: string;
  };
}

const MotorsPrintJobOrder = ({ data }: PrintJobOrderProps) => {
  
  // Safely calculate totals with fallbacks
  const jobTotal = Object.values(data.jobAmounts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
  const partsTotal = Object.values(data.partsAmounts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
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
    return data.partsQuantity[key as keyof PartsQuantity] || 0;
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount || amount === 0) return '';
    return phpCurrency(amount);
  };

  const getCouponName = (couponId: string | undefined): string => {
    if (!couponId) return "";
    
    const coupons = [
      { id: 1, name: "Coupon 1" },
      { id: 2, name: "Coupon 2" },
      { id: 3, name: "Coupon 3" },
      { id: 4, name: "Coupon 4" },
      { id: 5, name: "Coupon 5" },
      { id: 6, name: "Coupon 6" },
    ];
    
    return coupons.find(c => c.name === couponId)?.name || `Coupon ${couponId}`;
  };

  // Helper function to format brand and part number display
  const formatPartDetail = (partKey: string): string => {
    const brand = data.partsBrand?.[partKey as keyof PartsBrand];
    const partNo = data.partsNumber?.[partKey as keyof PartsNumber];
    
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
    return !!(data.partsReplacement?.[partKey as keyof PartsReplacement] && getPartsQuantity(partKey) > 0);
  };

  // Get job item label
  const getJobItemLabel = (key: string): string => {
    const jobLabels: Record<string, string> = {
      coupon: "Coupon",
      changeOil: "Charge Oil / Tune-up",
      overhaul: "Top / Major Overhaul",
      chainSprocket: "Chain & Sprocket / Drive Belt",
      carburetor: "Carburetor / Fuel Injection",
      brakeSystem: "Brake System (FR / RR)",
      steeringSystem: "Steering System",
      suspensionSystem: "Suspension System (FR / RR) / Swing Arm",
      wheelsSpokes: "Wheel & Spokes (FR / RR)",
      wheelAdjustment: "Wheel Adjustment",
      batteryCharging: "Battery Charging",
      minorElectrical: "Minor Electrical (Horn / Winker / Others)",
      majorElectrical: "Major Electrical (Charging / Ignition / Starting)",
      installAccessories: "Install Accessories",
      generalCheckup: "General Check Up",
      warrantyRepair: "Warranty Repair",
      others: "Others"
    };
    return jobLabels[key] || key;
  };

  // Get part label
  const getPartLabel = (key: string): string => {
    const partLabels: Record<string, string> = {
      engineOil: "Engine Oil",
      drainPlugWasher: "Drain Plug Washer",
      tappetORing: "Tapped Cu Ring",
      sparkPlug: "Spark Plug",
      airCleanerElement: "Air Cleaner Element",
      brakeShoePads: "Brake Shoe / Pads (FR / RR)",
      gaskets: "Gaskets (Head, Right, Left)",
      battery: "Battery",
      chainSprocketBelt: "Chain & Sprocket / Drive Belt",
      fuelHose: "Fuel Hose",
      tiresTubesFlaps: "Tires, Tubes, Flaps",
      bulbs: "Bulbs",
      bearings: "Bearings",
      springs: "Springs",
      rubberPartsOilSeal: "Rubber Parts / Oil Seal",
      plasticParts: "Plastic Parts",
      brakeFluid: "Brake Fluid",
      coolant: "Coolant",
      partsOthers: "Others"
    };
    return partLabels[key] || key.replace(/([A-Z])/g, ' $1').trim();
  };

  // Check if a job is selected
  const isJobSelected = (jobKey: string): boolean => {
    if (jobKey === 'coupon') {
      return !!(data.jobRequest.coupon && data.jobRequest.selectedCoupon);
    }
    if (jobKey === 'others') {
      return !!(data.jobRequest.others && data.jobRequest.othersText);
    }
    return !!(data.jobRequest[jobKey as keyof JobRequest]);
  };

  // Get all selected jobs in order
  const getSelectedJobs = () => {
    const jobKeys = [
      'coupon', 'changeOil', 'overhaul', 'chainSprocket', 'carburetor', 
      'brakeSystem', 'steeringSystem', 'suspensionSystem', 'wheelsSpokes', 
      'wheelAdjustment', 'batteryCharging', 'minorElectrical', 'majorElectrical', 
      'installAccessories', 'generalCheckup', 'warrantyRepair', 'others'
    ];
    return jobKeys.filter(key => isJobSelected(key));
  };

  // Get all selected parts in order
  const getSelectedParts = () => {
    const allParts = [
      'engineOil', 'drainPlugWasher', 'tappetORing', 'sparkPlug', 'airCleanerElement',
      'brakeShoePads', 'gaskets', 'battery', 'chainSprocketBelt', 'fuelHose',
      'tiresTubesFlaps', 'bulbs', 'bearings', 'springs', 'rubberPartsOilSeal',
      'plasticParts', 'brakeFluid', 'coolant', 'partsOthers'
    ];
    
    return allParts.filter(partKey => isPartSelected(partKey));
  };

  return (
    <div
      className="p-1 font-sans bg-white text-black leading-tight border-2 border-black"
      style={{
        fontSize: "8pt",
        maxWidth: "210mm",
        minHeight: "258mm",
        margin: "0",
        lineHeight: "1.2",
      }}
    >
      {/* Honda Header */}
      <div className="flex flex-col justify-center items-center mb-1">
        <div className="flex justify-between items-center w-full">
          <div className="flex-1"></div>
          <img src="/smct-header.jpg" alt="Company Logo" className="h-10 w-auto" />
          <div className="flex-1 flex justify-end items-center">
            <h3 className="text-right font-bold">{ data.branch.replace("(", "").replace(")", "").split(" ")[0] }-{ data.jobOrderNumber }</h3>
          </div>
        </div>
        <h2 className="font-bold border-t border-b border-black py-1 my-1 text-center w-full" style={{ fontSize: "8pt", lineHeight: "0.8" }}>VEHICLE CHECKLIST</h2>
      </div>

      {/* Vehicle Information */}
      <div className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
        <div className="flex">
          <span className="font-bold w-32">Date:</span>
          <span className="border-b border-black flex-1">{format(new Date(data.date), "MM/dd/yyyy")}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-40">Engine/Frame No.:</span>
          <span className="border-b border-black flex-1">{data.engineFrameNo}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-32">Branch Name:</span>
          <span className="border-b border-black flex-1">{data.branch}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-40">Mileage:</span>
          <span className="border-b border-black flex-1">{data.mileage} km</span>
        </div>
        <div className="flex">
          <span className="font-bold w-32">Customer Name:</span>
          <span className="border-b border-black flex-1">{data.customerName}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-40">Purchased Date:</span>
          <span className="border-b border-black flex-1">{data.purchaseDate}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-32">Contact Number:</span>
          <span className="border-b border-black flex-1">{data.contact}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-40">Repair Start Time:</span>
          <span className="border-b border-black flex-1">{data.repairStart}</span>
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
          <span className="border-b border-black flex-1">{data.mechanic.split("_")[1]}</span>
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
            <span className="font-bold mr-1">Remarks:</span>
            <span className="border-b border-black flex-1">{data.remarks}</span>
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
            <span className="border-b border-black flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{data.engineCondition}</span>
          </div>
        </div>
      </div>
      
      <div className="flex mt-1 mb-2">
        <span className="font-bold w-40">Contents inside U-Box:</span>
        <span className="underline">{data.contentUbox}</span>
      </div>

      {/* Motorcycle Diagnosis Section - keep existing */}
      <div className="mb-2 text-xs">
        <h3 className="font-bold text-center border border-black py-0.5 bg-gray-100 text-[7pt]">
          MOTORCYCLE'S DIAGNOSIS
        </h3>
        <table className="w-full border-collapse border border-black my-0" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
          <thead>
            <tr className="bg-gray-40">
              <th className="border border-black p-0.5 text-center"></th>
              <th className="border border-black p-0.5 text-center w-8">OK</th>
              <th className="border border-black p-0.5 text-center w-8">NG</th>
              <th className="border border-black p-0.5 text-center w-8">N/A</th>
              <th className="border border-black p-0.5 text-center w-24" colSpan={2}>Remarks</th>
              <th className="border border-black p-0.5 text-center"></th>
              <th className="border border-black p-0.5 text-center w-8">OK</th>
              <th className="border border-black p-0.5 text-center w-8">NG</th>
              <th className="border border-black p-0.5 text-center w-8">N/A</th>
              <th className="border border-black p-0.5 text-center w-24" colSpan={2}>Remarks</th>
             </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-0.5">Lights (HL/TL/SL/BL/MP)</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.lights?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.lights?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.lights?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.lights?.remarks || ''}</td>
              <td className="border border-black p-0.5">Suspension (FR/RR)</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.suspension?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.suspension?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.suspension?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.suspension?.remarks || ''}</td>
            </tr>
            <tr>
              <td className="border border-black p-0.5">Horn</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.horn?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.horn?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.horn?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.horn?.remarks || ''}</td>
              <td className="border border-black p-0.5">Idle Speed</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.idleSpeed?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.idleSpeed?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.idleSpeed?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.idleSpeed?.remarks || ''}</td>
            </tr>
            <tr>
              <td className="border border-black p-0.5">Switches (IS/SS/SLS/HS)</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.switches?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.switches?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.switches?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.switches?.remarks || ''}</td>
              <td className="border border-black p-0.5">Side/Main Stand</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.sideMain?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.sideMain?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.sideMain?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.sideMain?.remarks || ''}</td>
            </tr>
            <tr>
              <td className="border border-black p-0.5">Brakes (FR/RR)</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.brakes?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.brakes?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.brakes?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.brakes?.remarks || ''}</td>
              <td className="border border-black p-0.5">Engine Oil/Final Drive Oil Level</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.engineOil?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.engineOil?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.engineOil?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.engineOil?.remarks || ''}</td>
            </tr>
            <tr>
              <td className="border border-black p-0.5">Tires (FR/RR)</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.tires?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.tires?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.tires?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.tires?.remarks || ''}</td>
              <td className="border border-black p-0.5">Coolant Level</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.coolantLevel?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.coolantLevel?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.coolantLevel?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.coolantLevel?.remarks || ''}</td>
            </tr>
            <tr>
              <td className="border border-black p-0.5">Spokes Wheels (FR/RR)</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.spokesWheels?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.spokesWheels?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.spokesWheels?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.spokesWheels?.remarks || ''}</td>
              <td className="border border-black p-0.5">Brake Fluid Level</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.brakeFluid?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.brakeFluid?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.brakeFluid?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.brakeFluid?.remarks || ''}</td>
            </tr>
            <tr>
              <td className="border border-black p-0.5">Drive Chain/Belt</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.driveChain?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.driveChain?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.driveChain?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.driveChain?.remarks || ''}</td>
              <td className="border border-black p-0.5">Battery</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.battery?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.battery?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.battery?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.battery?.remarks || ''}</td>
            </tr>
            <tr>
              <td className="border border-black p-0.5">Steering</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.steering?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.steering?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.steering?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.steering?.remarks || ''}</td>
              <td className="border border-black p-0.5">Cable Operation (CL/BR/CBS)</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.cableOperation?.status === 'ok' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.cableOperation?.status === 'ng' ? '✓' : ''}</td>
              <td className="border border-black p-0.5 text-center">{data.diagnosis?.cableOperation?.status === 'na' ? '✓' : ''}</td>
              <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.cableOperation?.remarks || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* JOB ORDER - Fixed 19 rows (18 data rows + 1 totals row) */}
      <div className="mb-1 text-xs" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
        <h3 className="font-bold text-center border border-black py-1 bg-gray-100">
          JOB ORDER
        </h3>
  
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-40">
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
              const selectedJobs = getSelectedJobs();
              const selectedParts = getSelectedParts();
              
              // Fixed number of data rows (18 data rows + 1 totals row = 19 total rows)
              const FIXED_DATA_ROWS = 16;
              
              const rows = [];
              
              for (let i = 0; i < FIXED_DATA_ROWS; i++) {
                const job = selectedJobs[i];
                const part = selectedParts[i];
                
                // Job data
                let jobLabel = '';
                let jobAmount = '';
                let jobCheckbox = '';
                
                if (job) {
                  const jobKey = job;
                  const jobLabelText = getJobItemLabel(jobKey);
                  const amountKey = jobKey === 'coupon' ? 'selectedCoupon' : jobKey;
                  const jobAmountValue = getJobAmount(amountKey);
                  
                  if (jobKey === 'coupon') {
                    jobLabel = `Coupon - ${getCouponName(data.jobRequest.selectedCoupon)}`;
                  } else if (jobKey === 'others') {
                    jobLabel = `Others: ${data.jobRequest.othersText}`;
                  } else {
                    jobLabel = jobLabelText;
                  }
                  jobAmount = jobAmountValue > 0 ? phpCurrency(jobAmountValue) : '';
                  jobCheckbox = '[✓] ';
                }
                
                // Part data - convert numbers to strings to avoid type errors
                let partLabel = '';
                let partQty: string = '';
                let partDetail = '';
                let partAmount = '';
                let partCheckbox = '';
                
                if (part) {
                  const partKey = part;
                  const partLabelText = getPartLabel(partKey);
                  const partQtyValue = getPartsQuantity(partKey);
                  const partAmountValue = getPartsAmount(partKey);
                  const partDetailText = formatPartDetail(partKey);
                  
                  if (partKey === 'partsOthers') {
                    partLabel = `Others: ${data.partsReplacement.partsOthersText}`;
                  } else {
                    partLabel = partLabelText;
                  }
                  partQty = partQtyValue > 0 ? partQtyValue.toString() : '';
                  partDetail = partDetailText;
                  partAmount = partAmountValue > 0 ? formatCurrency(partAmountValue) : '';
                  partCheckbox = '[✓] ';
                }
                
                rows.push(
                  <tr key={i} className="h-3">
                    <td className="border border-black p-0.5 h-3 align-middle">
                      {job && <span>{jobCheckbox}{jobLabel}</span>}
                    </td>
                    <td className="border border-black p-0.5 text-left h-3 align-middle">
                      {jobAmount}
                    </td>
                    <td className="border border-black p-0.5 h-3 align-middle">
                      {part && <span>{partCheckbox}{partLabel}</span>}
                    </td>
                    <td className="border border-black p-0.5 text-center h-3 align-middle">
                      {partQty}
                    </td>
                    <td className="border border-black p-0.5 text-left text-[7pt] h-3 align-middle">
                      {partDetail}
                    </td>
                    <td className="border border-black p-0.5 text-left h-3 align-middle">
                      {partAmount}
                    </td>
                  </tr>
                );
              }
              
              // Add totals row (row 19)
              rows.push(
                <tr key="totals" className="h-6">
                  <td className="border border-black p-0.5 font-semibold h-6 align-middle" colSpan={2}>
                    Total Labor Cost: {phpCurrency(jobTotal)}
                   </td>
                  <td className="border border-black p-0.5 font-semibold h-6 align-middle" colSpan={4}>
                    Total Parts Cost: {phpCurrency(partsTotal)}
                   </td>
                 </tr>
              );
              
              return rows;
            })()}
          </tbody>
         </table>

        {/* Grand Total */}
        <div className="flex justify-between items-center border border-black border-t-0 py-1">
          <div className="font-bold ml-1">Grand Total: {phpCurrency(grandTotal)}</div>
        </div>

        {/* Next Service Schedule */}
        <div className="py-2">
          <span className="font-bold mr-2">Your Next Service Schedule is:</span>
          <span className="border-b border-black w-18 inline-block">{data.nextScheduleDate}</span>
          <span> or </span>
          <span className="border-b border-black w-25 inline-block">{data.nextScheduleKms}</span>
          <span> kms </span>
          <span className="text-xs ml-2">(whichever comes first)</span>
        </div>

        {/* General Remarks */}
        <div className="flex">
          <span className="font-semibold mr-2">General Remarks:</span>
          <span className="border-b border-black flex-1">{data.generalRemarks}</span>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-1 grid grid-cols-3 gap-2 text-xs" style={{fontSize: '8pt', lineHeight: '0.8'}}>
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs mb-2">Prepared by:</p>
          <p className="underline">{data.serviceAdvisor}</p>
          <p className="text-xs text-gray-600" style={{fontSize: '7pt'}}>(Signature Over Printed Name)</p>
          <p className="text-xxs">Salesrep/Service Advisor</p>
        </div>
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs mb-2">Checked by:</p>
          <p className="underline">{data.branchManager}</p>
          <p className="text-xs text-gray-600" style={{fontSize: '7pt'}}>(Signature Over Printed Name)</p>
          <p className="text-xxs">BM/BS</p>
        </div>
        <div className="text-center p-0.5">
          <div className="mb-1 pb-1 h-6"></div>
          <p className="text-xs mb-2">Conformed by:</p>
          <p className="underline">{data.customerName}</p>
          <p className="text-xs text-gray-600" style={{fontSize: '7pt'}}>(Signature Over Printed Name)</p>
          <p className="text-xxs">Customer</p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-2 text-center" style={{fontSize: '6pt'}}>
        Printed on: {format(new Date(), "MMMM dd, yyyy hh:mm a")}
      </p>
    </div>
  );
};

export default MotorsPrintJobOrder;