export interface TrimotorsJobItem {
  key: string;
  label: string;
  hasText?: boolean; 
}

export const trimotorsJobItems: TrimotorsJobItem[] = [
  { key: "pivotPin", label: "Replace Pivot PIN (with pivot PIN remover)" },
  { key: "detachSteeringColumn", label: "Detach Steering Column" },
  { key: "differentialGearOverhaul", label: "Differential Gear Overhaul" },
  { key: "topOverhaul", label: "Top Overhaul" },
  { key: "replaceRubberBoots", label: "REPLACE RUBBER BOOTS (MAXIMA Z)" },
  { key: "changeOil", label: "Change Oil" },
  { key: "replaceTensioner", label: "Replace Tensioner" },
  { key: "replaceBrakeShoe", label: "Replace Brake Shoe (Each)" },
  { key: "replaceBrakeLightSwitch", label: "Replace Brake Light Switch" },
  { key: "engineOverhauling", label: "Engine Overhauling" },
  { key: "tuneUp", label: "Tune-Up" },
  { key: "replaceHeadlightBulb", label: "Replace Headlight Bulb" },
  { key: "rubberBootsGreasing", label: "Rubber Boots Greasing" },
  { key: "replaceBrakeReservoir", label: "Replace Brake Reservoir" },
  { key: "replaceClutchCable", label: "Replace Clutch Cable" },
  { key: "replaceAcceleratorCable", label: "Replace Accelerator Cable" },
  { key: "brakeShoeCleaning", label: "Brake Shoe Cleaning" },
  { key: "replaceCarbonBrush", label: "Replace Carbon Brush" },
  { key: "replaceGearCable", label: "Replace Gear Cable" },
  { key: "replaceOilPipeHose", label: "Replace Oil Pipe Hose (Cooler)" },
  { key: "replaceEngineCover", label: "Replace Engine Cover" },
  { key: "batteryCharging", label: "Battery Charging" },
  { key: "electricalMinorRepair", label: "Electrical Minor Repair (Wiring)" },
  { key: "electricalMajorRepair", label: "Electrical Major Repair (Wiring)" },
  { key: "replaceFrontShockAbsorber", label: "Replace Front Shock Absorber" },
  { key: "replaceFuelStrainer", label: "Replace fuel Strainer" },
  { key: "replaceHandbrakeCable", label: "Replace Handbrake Cable" },
  { key: "minorTroubleRepair", label: "Minor Trouble Repair" },
  { key: "majorTroubleRepair", label: "Major Trouble Repair" },
  { key: "replaceStarterRelay", label: "Replace Starter Relay" },
  { key: "replaceHeadlightRelay", label: "Replace Headlight Relay" },
  { key: "replaceIsolatorRubber", label: "Replace Isolator Rubber" },
  { key: "replaceStatorMagnetoRotorAssy", label: "Replace Stator/Magneto/Rotor Assy." },
  { key: "others", label: "Others" },
];
