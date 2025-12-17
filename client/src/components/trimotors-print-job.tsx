// components/PreviewPrint.tsx
"use client";

import { format } from "date-fns";
import phpCurrency from "@/utils/phpCurrency";
import { TrimotorsDiagnosisKeys, DiagnosisState, TrimotorsJobAmountType,TrimotorsJobRequestType} from "@/types/jobOrderFormType";

interface TrimotorsPrintJobOrderProps {
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
    nextScheduleDate: string;
    nextScheduleKms: string;
    generalRemarks: string;
    serviceAdvisor: string;
    branchManager: string;
    mechanic:string;
  };
}

const TrimotorsPrintJobOrder = ({ data }: TrimotorsPrintJobOrderProps) => {
  
  const renderCheckbox = (checked: boolean) => (checked ? "[✓]" : "[  ]");
  
  // Safely calculate totals with fallbacks
  const jobTotal = Object.values(data.jobAmounts || {}).reduce((s, v) => s + (Number(v) || 0), 0);


  // Helper function to safely get amount values
  const getJobAmount = (key: string): number => {
    return data.jobAmounts[key as keyof typeof data.jobAmounts] || 0;
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount || amount === 0) return '';
    return phpCurrency(amount);
  };

  const diagnosisRows = [
    { leftLabel: 'Windshield', leftKey: 'windhsield', rightLabel: 'Tape Hood', rightKey: 'tapeHood' },
    { leftLabel: 'Wipe Arm', leftKey: 'wipeArm', rightLabel: 'Aluminum', rightKey: 'alumninum' },
    { leftLabel: 'Front Indicator L/R', leftKey: 'frontIndicator', rightLabel: 'Nails & Screw', rightKey: 'nailScrew' },
    { leftLabel: 'Headlamp', leftKey: 'frontHeadLamp', rightLabel: 'Dashboard', rightKey: 'dashboard' },
    { leftLabel: 'Housing Scudo', leftKey: 'housingScudo', rightLabel: 'Seats Driver', rightKey: 'seatsDriver' },
    { leftLabel: 'Housing Headlamp L/R', leftKey: 'housingHeadlamp', rightLabel: 'Seats Passenger', rightKey: 'seatsPassenger' },
    { leftLabel: 'Front Fender', leftKey: 'frontFender', rightLabel: 'Seat Belts 4pcs', rightKey: 'seatBelts' },
    { leftLabel: 'Mud Flap', leftKey: 'mudFlapFront', rightLabel: 'Handle Leather', rightKey: 'handleLeather' },
    { leftLabel: 'Scudo/Front Paint', leftKey: 'scudoFront', rightLabel: 'Rubber Matting (F/R/C)', rightKey: 'rubberMatting' },
    { leftLabel: 'Emblem Logo', leftKey: 'frontEmblem', rightLabel: 'Underseat Cover', rightKey: 'underseatCover' },
    { leftLabel: 'Tail Lamp L/R', leftKey: 'tailLamp', rightLabel: 'Headlamp/Park Lamp', rightKey: 'headlamp' },
    { leftLabel: 'Bumper', leftKey: 'bumper', rightLabel: 'High/Low Beam', rightKey: 'beam' },
    { leftLabel: 'Mud Flap L/R', leftKey: 'mudFlapRear', rightLabel: 'Signal Lamps', rightKey: 'signalLamp' },
    { leftLabel: 'Rear Door', leftKey: 'rearDoor', rightLabel: 'Hazard Lamps', rightKey: 'hazardlamp' },
    { leftLabel: 'Emblem Logo', leftKey: 'rearEmblem', rightLabel: 'Wiper Motor', rightKey: 'wiper' },
    { leftLabel: 'Tail End Body Paint', leftKey: 'tailEnd', rightLabel: 'Lamps (Interior/Engine)', rightKey: 'interiorLamp' },
    { leftLabel: 'Beading', leftKey: 'leftBeading', rightLabel: 'Gauge Lamps', rightKey: 'gaugeLamp' },
    { leftLabel: 'Left Side Body Paint', leftKey: 'leftBodyPaint', rightLabel: 'Car Charger w/ Cap', rightKey: 'carCharger' },
    { leftLabel: 'Mud Guard', leftKey: 'mudGuard', rightLabel: 'Tools', rightKey: 'tools' },
    { leftLabel: 'Beading', leftKey: 'rightBeading', rightLabel: 'Battery', rightKey: 'battery' },
    { leftLabel: 'Right Side Body Paint', leftKey: 'rightBodyPaint', rightLabel: 'Jack', rightKey: 'jack' },
    { leftLabel: 'Check for Holes/Torn', leftKey: 'checkHoles', rightLabel: 'Spare Tire', rightKey: 'spareTire' },
    { leftLabel: 'Damage Stitching', leftKey: 'damageStitching', rightLabel: 'Side Mirror L/R', rightKey: 'sideMirror' },
    { leftLabel: 'Cover Hood Top', leftKey: 'coverHood', rightLabel: 'Warranty Booklet', rightKey: 'warrantyBooklet' },  
  ];

  // Helper function for diagnosis cells
  const renderStatusCell = (dataKey: string, statusType: string) => {
    const item = data.diagnosis?.[dataKey as keyof typeof data.diagnosis];
    return item?.status === statusType ? '✓' : '';
  };

  return (
    <div
      className="p-1 font-sans bg-white text-black leading-tight border-2 border-black-100"
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
        <img src="/smct-header.jpg" alt="Company Logo" className="h-8 w-auto mx-auto" />
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
      <div className="mb-2 grid grid-cols-1 gap-2" style={{ fontSize: "8pt", lineHeight: "0.8" }}>
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
            <div className="flex items-center justify-center overflow-hidden" style={{ height: "145px" }}>
              <img 
                src="/trimotors.png" 
                alt="Trimotors Unit Diagram" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Motorcycle Diagnosis Section - REFACTORED */}
      <div className="mb-2 text-xs">
        <h3 className="font-bold text-center border border-black py-0.5 bg-gray-100 text-[7pt]">
          TRIMOTORS' DIAGNOSIS
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
            {diagnosisRows.map((row, index) => {
              const leftItem = data.diagnosis?.[row.leftKey as keyof typeof data.diagnosis];
              const rightItem = data.diagnosis?.[row.rightKey as keyof typeof data.diagnosis];
              
              return (
                <tr key={index}>
                  {/* Left side */}
                  <td className="border border-black p-0.5">{row.leftLabel}</td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.leftKey, 'ok')}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.leftKey, 'ng')}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.leftKey, 'na')}
                  </td>
                  <td className="border border-black p-0.5" colSpan={2}>
                    {leftItem?.remarks || ''}
                  </td>
                  
                  {/* Right side */}
                  <td className="border border-black p-0.5">{row.rightLabel}</td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.rightKey, 'ok')}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.rightKey, 'ng')}
                  </td>
                  <td className="border border-black p-0.5 text-center">
                    {renderStatusCell(row.rightKey, 'na')}
                  </td>
                  <td className="border border-black p-0.5" colSpan={2}>
                    {rightItem?.remarks || ''}
                  </td>
                </tr>
              );
            })}
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
              <th className="border border-black p-0.5 text-left"></th>
              <th className="border border-black p-0.5 text-center w-16">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.vehicleWashing)}</span>
                  <span>Vehicle Washing & Cleaning</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("vehicleWashing"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkShock)}</span>
                  <span>Check front/near shock absorbers for any defect</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkShock"))}</td>
            </tr>
            
            {/* Row 2 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.airFilter)}</span>
                  <span>Clean/Replace breather tube filter</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("airFilter"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkBrake)}</span>
                  <span>Check & top up brake fluid</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkBrake"))}</td>
            </tr>
            
            {/* Row 3 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.breather)}</span>
                  <span>Clean/Replace breather tube filter</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("breather"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.deCarbonising)}</span>
                  <span>De-carbonising engine</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("deCarbonising"))}</td>
            </tr>
            
            {/* Row 4 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkLights)}</span>
                  <span>Check all lights for working</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkLights"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkBrakeLiner)}</span>
                  <span>Check brake liner wear, replace if required</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkBrakeLiner"))}</td>
            </tr>
            
            {/* Row 5 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.oilStrainer)}</span>
                  <span>Replace oil strainer</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("oilStrainer"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.replaceEngine)}</span>
                  <span>Replace engine oil</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("replaceEngine"))}</td>
            </tr>
            
            {/* Row 6 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkSteering)}</span>
                  <span>Check/adjust steering column tight race & lock nut</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkSteering"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.replaceDifferential)}</span>
                  <span>Replace/top up differential oil</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("replaceDifferential"))}</td>
            </tr>
            
            {/* Row 7 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.cleanSpark)}</span>
                  <span>Clean/Adjust/Replace Spark plug gap</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("cleanSpark"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.greaseSteering)}</span>
                  <span>Grease steering races, balls</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("greaseSteering"))}</td>
            </tr>
            
            {/* Row 8 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkValve)}</span>
                  <span>Check & adjust valve clearance</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkValve"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.greaseFront)}</span>
                  <span>Grease Front Suspension</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("greaseFront"))}</td>
            </tr>
            
            {/* Row 9 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkFuel)}</span>
                  <span>Check/replace fule pipe</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkFuel"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.greaseNipple)}</span>
                  <span>Grease Front & Rear axles ( bGrease nipple)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("greaseNipple"))}</td>
            </tr>
            
            {/* Row 10 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkBattery)}</span>
                  <span>Check battery electrolyte level & top up</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkBattery"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.greasePropeller)}</span>
                  <span>Grease Propeller shaft flanges</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("greasePropeller"))}</td>
            </tr>
            
            {/* Row 11 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.tireRotation)}</span>
                  <span>Do tire rotation (seq. 1 & 2)</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("tireRotation"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.greaseGear)}</span>
                  <span>Grease Gear shifter sector</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("greaseGear"))}</td>
            </tr>
            
            {/* Row 12 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.replaceProp)}</span>
                  <span>Replace Prop. Shaft rubber buffers</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("greaseNipple"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.greaseFare)}</span>
                  <span>Grease Fare/Speedo meter drive</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("greaseFare"))}</td>
            </tr>
            
            {/* Row 13 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.replaceOil)}</span>
                  <span>Replace Oil Filter</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("replaceOil"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.speedometer)}</span>
                  <span>Speedometer inner greasing</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("speedometer"))}</td>
            </tr>
            
            {/* Row 14 */}
            <tr>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.checkCabies)}</span>
                  <span>Check and adjust control cabies</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("checkCabies"))}</td>
              <td className="border border-black p-0.5">
                <div className="flex items-center">
                  <span className="w-6">{renderCheckbox(data.jobRequest.petroleum)}</span>
                  <span>Apply petroleum jelly on battery terminals</span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left">{formatCurrency(getJobAmount("petroleum"))}</td>
            </tr>
             
            {/* Row 15 */}
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
                  <span className="w-6"></span>
                  <span></span>
                </div>
              </td>
              <td className="border border-black p-0.5 text-left"></td>
            </tr>           
            
            {/* Row 20 - Totals */}
            <tr>
              <td className="border border-black p-0.5 font-semibold">Total Labor Cost:</td>
              <td className="border border-black p-0.5 text-left font-semibold">{phpCurrency(jobTotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Next Service Schedule - Below the table */}
        <div className="flex justify-between items-center border border-black border-t-0 py-1 ">
          <div className="font-bold ml-1 text-xxs">Grand Total: {phpCurrency(jobTotal)}</div>
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
      <div className="mt-0.5 grid grid-cols-3 gap-2 text-xs" style={{fontSize: '8pt', lineHeight: '0.8'}}>
        <div className="text-center  p-0.5">
          <div className=" mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left">Prepared by:</p>
          <p className="underline" style={{fontStyle:'underline'}}>{data.serviceAdvisor}</p>
          <p className="text-xs text-gray-600" style={{fontSize: '7pt'}} >(Signature Over Printed Name)</p>
          <p className="text-xxs">Salesrep/Service Advisor</p>
        </div>
        <div className="text-center p-0.5">
          <div className=" mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left">Checked by:</p>
          <p className="underline" style={{fontStyle:'underline'}}>{data.branchManager}</p>
          <p className="text-xs text-gray-600" style={{fontSize: '7pt'}}>(Signature Over Printed Name)</p>
          <p className="text-xxs">BM/BS</p>
        </div>
        <div className="text-center  p-0.5">
          <div className=" mb-1 pb-1 h-6"></div>
          <p className="text-xs text-left">Performed by:</p>
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

export default TrimotorsPrintJobOrder;