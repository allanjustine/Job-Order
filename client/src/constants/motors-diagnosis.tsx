export interface MotorsDiagnosisItem {
  key: string;
  label: string;
}

export const motorsdiagnosisItems: MotorsDiagnosisItem[] = [
  { key: "lights", label: "Lights (HL/TL/SL/BL/MP)" },
      { key: "horn", label: "Horn" },
      { key: "switches", label: "Switches (IS/SS/SLS/HS)" },
      { key: "brakes", label: "Brakes (FR/RR)" },
      { key: "tires", label: "Tires (FR/RR)" },
      { key: "spokesWheels", label: "Spokes Wheels (FR/RR)" },
      { key: "driveChain", label: "Drive Chain/Belt" },
      { key: "steering", label: "Steering" },
      { key: "suspension", label: "Suspension (FR/RR)" },
      { key: "idleSpeed", label: "Idle Speed" },
      { key: "sideMain", label: "Side/Main Stand" },
      { key: "engineOil", label: "Engine Oil/Final Drive Oil Level" },
      { key: "coolantLevel", label: "Coolant Level" },
      { key: "brakeFluid", label: "Brake Fluid Level" },
      { key: "battery", label: "Battery" },
      { key: "cableOperation", label: "Cable Operation (CL/BR/CBS)" },
];



