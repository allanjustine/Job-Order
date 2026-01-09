export interface TrimotorsJobItem {
  key: string;
  label: string;
}

export const trimotorsJobItems: TrimotorsJobItem[] = [
  { key: "vehicleWashing", label: "Vehicle Washing & Cleaning" },
  { key: "airFilter", label: "Clean/replace Air filter Element" },
  { key: "breather", label: "Clean/Replace breather tube filter" },
  { key: "checkLights", label: "Check all lights for working" },
  { key: "oilStrainer", label: "Replace oil strainer" },
  {
    key: "checkSteering",
    label: "Check/adjust steering column tight race & lock nut",
  },
  { key: "cleanSpark", label: "Clean/Adjust/Replace Spark plug gap" },
  { key: "checkValve", label: "Check & adjust valve clearance" },
  { key: "checkFuel", label: "Check/Replace fuel pipe" },
  { key: "checkBattery", label: "Check Battery electrolyte level & top up" },
  { key: "tireRotation", label: "Do tire rotation (seq. 1 & 2)" },
  { key: "replaceProp", label: "Replace Prop. Shaft rubber buffers" },
  { key: "replaceOil", label: "Replace Oil Filter" },
  { key: "checkCabies", label: "Check and adjust control cabies" },
  {
    key: "checkShock",
    label: "Check front/near shock absorbers for any defect",
  },
  { key: "checkBrake", label: "Check & top up brake fluid" },
  { key: "deCarbonising", label: "De-carbonising engine" },
  {
    key: "checkBrakeLiner",
    label: "Check brake liner wear, replace if required",
  },
  { key: "replaceEngine", label: "Replace engine oil" },
  { key: "replaceDifferential", label: "Replace/top up differential oil" },
  { key: "greaseSteering", label: "Grease steering races, balls" },
  { key: "greaseFront", label: "Grease Front Suspension" },
  { key: "greaseNipple", label: "Grease Front & Rear axles (Grease nipple)" },
  { key: "greasePropeller", label: "Grease Propeller shaft flanges" },
  { key: "greaseGear", label: "Grease Gear shifter sector" },
  { key: "greaseFare", label: "Grease Fare/Speedo meter drive" },
  { key: "speedometer", label: "Speedometer inner greasing" },
  { key: "petroleum", label: "Apply petroleum jelly on battery terminals" },
  { key: "others", label: "Others" },
];
