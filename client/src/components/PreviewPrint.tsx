// components/PreviewPrint.tsx
"use client";

import { format } from "date-fns";
import phpCurrency from "@/utils/phpCurrency";
import { DiagnosisKeys, DiagnosisState, JobAmountsType, PartsAmountsType, JobRequest, PartsReplacement } from "@/types/jobOrderFormType";

interface PreviewJobOrderProps {
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
    jobAmounts: JobAmountsType;
    partsAmounts: PartsAmountsType;
    nextScheduleDate: string;
    nextScheduleKms: string;
    generalRemarks: string;
    serviceAdvisor: string;
    branchManager: string;
    mechanic:string;
  };
}

const PreviewPrint = ({ data }: PreviewJobOrderProps) => {
  
  const renderCheckbox = (checked: boolean) => (checked ? "[✓]" : "[  ]");
  
  // Safely calculate totals with fallbacks
  const jobTotal = Object.values(data.jobAmounts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
  const partsTotal = Object.values(data.partsAmounts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
  const grandTotal = jobTotal + partsTotal;

  // Helper function to safely get amount values
// Simpler version with type assertions
const getJobAmount = (key: string): number => {
  return data.jobAmounts[key as keyof typeof data.jobAmounts] || 0;
};

const getPartsAmount = (key: string): number => {
  return data.partsAmounts[key as keyof typeof data.partsAmounts] || 0;
};

const formatCurrency = (amount: number | undefined): string => {
  if (!amount || amount === 0) return '';
  return phpCurrency(amount);
};

  return (
    <div
      className="p-1 font-sans bg-white text-black leading-tight border-2 border-black-100"
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
        <img src="/smct-header.jpg" alt="Company Logo" className="h-10 w-auto mx-auto" />
        <h2 className="font-bold border-t border-b border-black py-1 my-1 text-center w-full" style={{ fontSize: "8pt", lineHeight: "0.8" }}>VEHICLE CHECKLIST</h2>
    </div>

      {/* Vehicle Information - Compact Grid */}
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
          <span className="border-b border-black flex-1">{data.mechanic}</span>
        </div>
      </div>

        {/* Motorcycle Unit & Engine Unit - Two Column Side by Side */}
      <div className="mb-2 grid grid-cols-2 gap-2" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
        {/* Left Column - Motorcycle Unit */}
        <div className="border border-black p-0.5">
          <div className="font-bold mb-1">MOTORCYCLE UNIT:</div>
          <div className="mb-1" style={{ fontSize: "6pt", lineHeight: "0.6" }}>
            <span className="font-bold mr-2">LEGEND:</span>
            <span className="mr-2">X-SCRATCH</span>
            <span className="mr-2">●-DENT</span>
            <span className="mr-2">■-CRACK</span>
            <span>□-NOT AVAILABLE</span>
          </div>
        
          {/* 8 small motorcycle diagram images - 4 columns, 2 rows */}
          <div className="mb-1">
            <div className="flex items-center justify-center overflow-hidden" style={{ height: "160px" }}>
              <img 
                src="/motorcycle-unit.png" 
                alt="Motorcycle Unit Diagram" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex mt-2">
            <span className="font-bold mr-1">Remarks:</span>
            <span className="border-b border-black flex-1">{data.remarks}</span>
          </div>
        </div>

        {/* Right Column - Engine Unit */}
        <div className="border border-black p-0.5">
          <div className="font-bold mb-1">ENGINE UNIT:</div>
          
          {/* Single engine unit image */}
          <div className="mb-1">
            <div className="flex items-center justify-center overflow-hidden" style={{ height: "170px" }}>
              <img 
                src="/engine-unit.png" 
                alt="Engine Unit Diagram" 
                className="w-full h-full object-contain"
              />
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

{/* Motorcycle Diagnosis Section */}
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
      {/* Row 1 - Lights & Suspension */}
      <tr>
        <td className="border border-black p-0.5">Lights (HL/TL/SL/BL/MP)</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.lights?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.lights?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.lights?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.lights?.remarks || ''}</td>
        <td className="border border-black p-0.5">Suspension (FR/RR)</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.suspension?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.suspension?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.suspension?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.suspension?.remarks || ''}</td>
      </tr>
      
      {/* Row 2 - Horn & Idle Speed */}
      <tr>
        <td className="border border-black p-0.5">Horn</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.horn?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.horn?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.horn?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.horn?.remarks || ''}</td>
        <td className="border border-black p-0.5">Idle Speed</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.idleSpeed?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.idleSpeed?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.idleSpeed?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.idleSpeed?.remarks || ''}</td>
      </tr>
      
      {/* Row 3 - Switches & Side/Main Stand */}
      <tr>
        <td className="border border-black p-0.5">Switches (IS/SS/SLS/HS)</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.switches?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.switches?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.switches?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.switches?.remarks || ''}</td>
        <td className="border border-black p-0.5">Side/Main Stand</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.sideMain?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.sideMain?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.sideMain?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.sideMain?.remarks || ''}</td>
      </tr>
      
      {/* Row 4 - Brakes & Engine Oil */}
      <tr>
        <td className="border border-black p-0.5">Brakes (FR/RR)</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.brakes?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.brakes?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.brakes?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.brakes?.remarks || ''}</td>
        <td className="border border-black p-0.5">Engine Oil/Final Drive Oil Level</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.engineOil?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.engineOil?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.engineOil?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.engineOil?.remarks || ''}</td>
      </tr>
      
      {/* Row 5 - Tires & Coolant Level */}
      <tr>
        <td className="border border-black p-0.5">Tires (FR/RR)</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.tires?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.tires?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.tires?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.tires?.remarks || ''}</td>
        <td className="border border-black p-0.5">Coolant Level</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.coolantLevel?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.coolantLevel?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.coolantLevel?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.coolantLevel?.remarks || ''}</td>
      </tr>
      
      {/* Row 6 - Spokes Wheels & Brake Fluid Level */}
      <tr>
        <td className="border border-black p-0.5">Spokes Wheels (FR/RR)</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.spokesWheels?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.spokesWheels?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.spokesWheels?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.spokesWheels?.remarks || ''}</td>
        <td className="border border-black p-0.5">Brake Fluid Level</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.brakeFluid?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.brakeFluid?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.brakeFluid?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.brakeFluid?.remarks || ''}</td>
      </tr>
      
      {/* Row 7 - Drive Chain/Belt & Battery */}
      <tr>
        <td className="border border-black p-0.5">Drive Chain/Belt</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.driveChain?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.driveChain?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.driveChain?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.driveChain?.remarks || ''}</td>
        <td className="border border-black p-0.5">Battery</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.battery?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.battery?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.battery?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.battery?.remarks || ''}</td>
      </tr>
      
      {/* Row 8 - Steering & Cable Operation */}
      <tr>
        <td className="border border-black p-0.5">Steering</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.steering?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.steering?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.steering?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.steering?.remarks || ''}</td>
        <td className="border border-black p-0.5">Cable Operation (CL/BR/CBS)</td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.cableOperation?.status === 'ok' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.cableOperation?.status === 'ng' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5 text-center">
          {data.diagnosis?.cableOperation?.status === 'na' ? '✓' : ''}
        </td>
        <td className="border border-black p-0.5" colSpan={2}>{data.diagnosis?.cableOperation?.remarks || ''}</td>
      </tr>
    </tbody>
  </table>
</div>

      {/* JOB ORDER - Two Column Layout */}
      <div className="mb-1 text-xs" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
        <h3 className="font-bold text-center border border-black py-1 bg-gray-100">
          JOB ORDER
        </h3>
  
        {/* Job Order Table - 4 Column Layout */}
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-40">
              <th className="border border-black p-0.5 text-left">Specific Job(s) Request</th>
              <th className="border border-black p-0.5 text-center w-16">Amount</th>
              <th className="border border-black p-0.5 text-left">Parts for Replacement</th>
              <th className="border border-black p-0.5 text-center w-16">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.coupon)}</span>
                  <span>Coupon (1 / 2 / 3)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("coupon"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.engineOil)}</span>
                  <span>Engine Oil</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("engineOil"))}</td>
            </tr>
            
            {/* Row 2 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.changeOil)}</span>
                  <span>Charge Oil / Tune-up</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("changeOil"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.drainPlugWasher)}</span>
                  <span>Drain Plug Washer</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("drainPlugWasher"))}</td>
            </tr>
            
            {/* Row 3 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.overhaul)}</span>
                  <span>Top / Major Overhaul</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("overhaul"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.tappetORing)}</span>
                  <span>Tapped Cu Ring</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("tappetORing"))}</td>
            </tr>
            
            {/* Row 4 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.chainSprocket)}</span>
                  <span>Chain & Sprocket / Drive Belt</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("chainSprocket"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.sparkPlug)}</span>
                  <span>Spark Plug</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("sparkPlug"))}</td>
            </tr>
            
            {/* Row 5 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.carburetor)}</span>
                  <span>Carburetor / Fuel Injection</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("carburetor"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.airCleanerElement)}</span>
                  <span>Air Cleaner Element</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("airCleanerElement"))}</td>
            </tr>
            
            {/* Row 6 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.brakeSystem)}</span>
                  <span>Brake System (FR / RR)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("brakeSystem"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.brakeShoePads)}</span>
                  <span>Brake Shoe / Pads (FR / RR)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("brakeShoePads"))}</td>
            </tr>
            
            {/* Row 7 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.steeringSystem)}</span>
                  <span>Steering System</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("steeringSystem"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.gaskets)}</span>
                  <span>Gaskets (Head, Right, Left, Other: ______)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("gaskets"))}</td>
            </tr>
            
            {/* Row 8 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.suspensionSystem)}</span>
                  <span>Suspension System (FR / RR) / Swing Arm</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("suspensionSystem"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.battery)}</span>
                  <span>Battery</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("battery"))}</td>
            </tr>
            
            {/* Row 9 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.wheelsSpokes)}</span>
                  <span>Wheel & Spokes (FR / RR)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("wheelsSpokes"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.chainSprocketBelt)}</span>
                  <span>Chain & Sprocket / Drive Belt</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("chainSprocketBelt"))}</td>
            </tr>
            
            {/* Row 10 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.wheelAdjustment)}</span>
                  <span>Wheel Adjustment</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("wheelAdjustment"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.fuelHose)}</span>
                  <span>Fuel Hose</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("fuelHose"))}</td>
            </tr>
            
            {/* Row 11 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.batteryCharging)}</span>
                  <span>Battery Charging</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("batteryCharging"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.tiresTubesFlaps)}</span>
                  <span>Tires, Tubes, Flaps</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("tiresTubesFlaps"))}</td>
            </tr>
            
            {/* Row 12 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.minorElectrical)}</span>
                  <span>Minor Electrical (Horn / Winker / Others)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("minorElectrical"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.bulbs)}</span>
                  <span>Bulbs</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("bulbs"))}</td>
            </tr>
            
            {/* Row 13 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.majorElectrical)}</span>
                  <span>Major Electrical (Charging / Ignition / Starting)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("majorElectrical"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.bearings)}</span>
                  <span>Bearings</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("bearings"))}</td>
            </tr>
            
            {/* Row 14 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.installAccessories)}</span>
                  <span>Install Accessories</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("installAccessories"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.springs)}</span>
                  <span>Springs</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("springs"))}</td>
            </tr>
            
            {/* Row 15 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.generalCheckup)}</span>
                  <span>General Check Up</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("generalCheckup"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.rubberPartsOilSeal)}</span>
                  <span>Rubber Parts / Oil Seal</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("rubberPartsOilSeal"))}</td>
            </tr>
            
            {/* Row 16 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.warrantyRepair)}</span>
                  <span>Warranty Repair</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("warrantyRepair"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.plasticParts)}</span>
                  <span>Plastic Parts</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("plasticParts"))}</td>
            </tr>
            
            {/* Row 17 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.others)}</span>
                  <span>Others: {data.jobRequest.othersText}</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("others"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.brakeFluid)}</span>
                  <span>Brake Fluid</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("brakeFluid"))}</td>
            </tr>
            
            {/* Row 18 */}
            <tr>
              <td className="border border-black p-0.5"></td>
              <td className="border border-black p-0.5 text-left"></td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.coolant)}</span>
                  <span>Coolant</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("coolant"))}</td>
            </tr>
            
            {/* Row 19 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6"></span>
                  <span></span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left"></td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.partsReplacement.partsOthers)}</span>
                  <span>Others: {data.partsReplacement.partsOthersText}</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getPartsAmount("partsOthers"))}</td>
            </tr>
            
            {/* Row 20 - Totals */}
            <tr>
              <td className="border border-black p-0.5 font-semibold">Total Labor Cost:</td>
              <td className="border border-black p-0.5 text-left font-semibold">{phpCurrency(jobTotal)}</td>
              <td className="border border-black p-0.5 font-semibold">Total Parts Cost:</td>
              <td className="border border-black p-0.5 text-left font-semibold">{phpCurrency(partsTotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Next Service Schedule - Below the table */}
        <div className="flex justify-between items-center border border-black border-t-0 py-1 ">
          <div className="font-bold ml-1 text-xxs">Grand Total: {phpCurrency(grandTotal)}</div>
        </div>

        <div className="py-2">
          <span className="font-bold mr-2 ">Your Next Service Schedule is:</span>
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
        <div className="text-center  p-0.5">
          <div className=" mb-1 pb-1 h-6"></div>
          <p className="text-xs mb-2">Prepared by:</p>
          <p className="underline" style={{fontStyle:'underline'}}>{data.serviceAdvisor}</p>
          <p className="text-xs text-gray-600" style={{fontSize: '7pt'}} >(Signature Over Printed Name)</p>
          <p className="text-xxs">Salesrep/Service Advisor</p>
        </div>
        <div className="text-center p-0.5">
          <div className=" mb-1 pb-1 h-6"></div>
          <p className="text-xs mb-2">Checked by:</p>
          <p className="underline" style={{fontStyle:'underline'}}>{data.branchManager}</p>
          <p className="text-xs text-gray-600" style={{fontSize: '7pt'}}>(Signature Over Printed Name)</p>
          <p className="text-xxs">BM/BS</p>
        </div>
        <div className="text-center  p-0.5">
          <div className=" mb-1 pb-1 h-6"></div>
          <p className="text-xs mb-2">Conformed by:</p>
          <p className="underline" style={{fontStyle:'underline'}}>{data.customerName}</p>
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

export default PreviewPrint;