interface JobItem {
  key: string;
  label: string;
}

export const jobItems: JobItem[] = [
  { key: "coupon", label: "Coupon 1 / 2 / 3" },
  { key: "changeOil", label: "Change Oil / Tune-up" },
  { key: "overhaul", label: "Top / major Overhaul" },
  { key: "chainSprocket", label: "Chain & Sprocket / Drive Belt" },
  { key: "carburetor", label: "Carburetor / Fuel Injection" },
  { key: "brakeSystem", label: "Brake System (FR / RR)" },
  { key: "steeringSystem", label: "Steering System" },
  { key: "suspensionSystem", label: "Suspension System (FR / RR) / Swing Arm" },
  { key: "wheelsSpokes", label: "Wheels / Spokes (FR / RR)" },
  { key: "wheelAdjustment", label: "Wheel Adjustment" },
  { key: "batteryCharging", label: "Battery Charging" },
  {
    key: "minorElectrical",
    label: "Minor Electrical (Horn / Winker / Others)",
  },
  {
    key: "majorElectrical",
    label: "Major Electrical (Charging / Ignition / Starting)",
  },
  { key: "installAccessories", label: "Install Accessories" },
  { key: "generalCheckup", label: "General Check Up" },
  { key: "warrantyRepair", label: "Warranty Repair" },
  { key: "others", label: "Others" },
];
