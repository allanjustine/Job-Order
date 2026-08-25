interface JobItem {
  key: string;
  label: string;
}

export const jobItems: JobItem[] = [
  { key: "changeOil", label: "Change Oil" },
  { key: "overhaul", label: "Top / major Overhaul" },
  { key: "chainSprocket", label: "Chain & Sprocket / Drive Belt" },
  { key: "selectedCoupon", label: "Coupon" },
  { key: "carburetor", label: "Carburetor / Fuel Injection" },
  { key: "brakeSystem", label: "Brake System (FR / RR)" },
  { key: "steeringSystem", label: "Steering System" },
  { key: "suspensionSystem", label: "Suspension System (FR / RR) / Swing Arm" },
  { key: "wheelsSpokes", label: "Wheels / Spokes (FR / RR)" },
  { key: "wheelAdjustment", label: "Wheel Adjustment" },
  { key: "batteryCharging", label: "Battery Charging" },
  { key: "minorElectrical",label: "Minor Electrical (Horn / Winker / Others)",},
  { key: "majorElectrical",label: "Major Electrical (Charging / Ignition / Starting)",},
  { key: "installAccessories", label: "Install Accessories" },
  { key: "generalCheckup", label: "General Check Up" },
  { key: "warrantyRepair", label: "Warranty Repair" },
  { key: "cvtCleaning", label: "CVT Cleaning" },
  { key: "minorTuneUp", label: "Minor Tune-Up" },
  { key: "majorTuneUp", label: "Major Tune-Up" },
  { key: "throttleBodyCleaning", label: "Throttle Body Cleaning" },
  { key: "replaceBrakePad", label: "Replace Brake Pad" },
  { key: "replaceBrakeShoe", label: "Replace Brake Shoe" },
  { key: "checkUpCVT", label: "Check-up CVT" },
  { key: "replaceCVTParts", label: "Replace CVT Parts" },
  { key: "replaceCoolant", label: "Replace Coolant" },
  { key: "adjustBallRace", label: "Adjust Ball Race" },
  { key: "replaceBallRace", label: "Replace Ball Race" },
  { key: "replaceForkOilAndOilSeal", label: "Replace Fork Oil & Oil Seal" },
  { key: "upholstery", label: "Upholstery" },
  { key: "contractor", label: "Contractor" },
  { key: "others", label: "Others" },
];
