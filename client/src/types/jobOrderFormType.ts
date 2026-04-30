export type CouponType = {
  id: number;
  name: string;
};

export interface JobOthersItem {
  id: string;
  description: string;
  amount: number;
}

export interface PartsOthersItem {
  id: string;
  description: string;
  brand: string;
  partNumber: number;
  quantity: number;
  amount: number;
}

export interface TrimotorsPartsOthersItem {
  id: string;
  description: string;
  brand: string;
  partNumber: number;
  quantity: number;
  amount: number;
}

export type JobRequest = {
  coupon: boolean;
  selectedCoupon?: string;
  couponBrand?: string;
  changeOil: boolean;
  overhaul: boolean;
  chainSprocket: boolean;
  carburetor: boolean;
  brakeSystem: boolean;
  steeringSystem: boolean;
  suspensionSystem: boolean;
  wheelsSpokes: boolean;
  wheelAdjustment: boolean;
  batteryCharging: boolean;
  minorElectrical: boolean;
  majorElectrical: boolean;
  installAccessories: boolean;
  generalCheckup: boolean;
  warrantyRepair: boolean;
  others: boolean; // To check if Others section is enabled
  othersItems: JobOthersItem[]; // Array of custom job items
  othersText: string;
};

export type PartsReplacement = {
  engineOil: boolean;
  drainPlugWasher: boolean;
  tappetORing: boolean;
  sparkPlug: boolean;
  airCleanerElement: boolean;
  brakeShoePads: boolean;
  gaskets: boolean;
  battery: boolean;
  chainSprocketBelt: boolean;
  fuelHose: boolean;
  tiresTubesFlaps: boolean;
  bulbs: boolean;
  bearings: boolean;
  springs: boolean;
  rubberPartsOilSeal: boolean;
  plasticParts: boolean;
  brakeFluid: boolean;
  coolant: boolean;
  partsOthers: boolean;
  partsOthersText: string;
  partsOthersItems?: PartsOthersItem[]; // New array for multiple others
  [key: string]: boolean | string | PartsOthersItem[] | undefined;
};

export type TrimotorsJobRequestType = {
  pivotPin: boolean
  detachSteeringColumn: boolean
  differentialGearOverhaul: boolean
  topOverhaul: boolean
  replaceRubberBoots: boolean
  changeOil: boolean
  replaceTensioner: boolean
  replaceBrakeShoe: boolean
  replaceBrakeLightSwitch: boolean
  engineOverhauling: boolean
  tuneUp: boolean
  replaceHeadlightBulb: boolean
  rubberBootsGreasing: boolean
  replaceBrakeReservoir: boolean
  replaceClutchCable: boolean
  replaceAcceleratorCable: boolean
  brakeShoeCleaning: boolean
  replaceCarbonBrush: boolean
  replaceGearCable: boolean
  replaceOilPipeHose: boolean
  replaceEngineCover: boolean
  batteryCharging: boolean
  electricalMinorRepair: boolean
  electricalMajorRepair: boolean
  replaceFrontShockAbsorber: boolean
  replaceFuelStrainer: boolean
  replaceHandbrakeCable: boolean
  minorTroubleRepair: boolean
  majorTroubleRepair: boolean
  replaceStarterRelay: boolean
  replaceHeadlightRelay: boolean
  replaceIsolatorRubber: boolean
  replaceStatorMagnetoRotorAssy: boolean
  others: boolean; // To check if Others section is enabled
  othersItems: JobOthersItem[];
  othersText: string;
};

// Define proper types for job and parts amounts
export type JobAmountsType = {
  coupon?: number;
  changeOil?: number;
  overhaul?: number;
  chainSprocket?: number;
  carburetor?: number;
  brakeSystem?: number;
  steeringSystem?: number;
  suspensionSystem?: number;
  wheelsSpokes?: number;
  wheelAdjustment?: number;
  batteryCharging?: number;
  minorElectrical?: number;
  majorElectrical?: number;
  installAccessories?: number;
  generalCheckup?: number;
  warrantyRepair?: number;
  others?: number;
  selectedCoupon?: number;
  total?: any;
  [key: string]: number | undefined;
};

export type PartsBrand = {
  engineOil?: string;
  drainPlugWasher?: string;
  tappetORing?: string;
  sparkPlug?: string;
  airCleanerElement?: string;
  brakeShoePads?: string;
  gaskets?: string;
  battery?: string;
  chainSprocketBelt?: string;
  fuelHose?: string;
  tiresTubesFlaps?: string;
  bulbs?: string;
  bearings?: string;
  springs?: string;
  rubberPartsOilSeal?: string;
  plasticParts?: string;
  brakeFluid?: string;
  coolant?: string;
  partsOthers?: string;
  [key: string]: string | undefined;
};

export type PartsNumber = {
  engineOil?: number;
  drainPlugWasher?: number;
  tappetORing?: number;
  sparkPlug?: number;
  airCleanerElement?: number;
  brakeShoePads?: number;
  gaskets?: number;
  battery?: number;
  chainSprocketBelt?: number;
  fuelHose?: number;
  tiresTubesFlaps?: number;
  bulbs?: number;
  bearings?: number;
  springs?: number;
  rubberPartsOilSeal?: number;
  plasticParts?: number;
  brakeFluid?: number;
  coolant?: number;
  partsOthers?: number;
  [key: string]: number | undefined;
};

export type PartsQuantity = {
  engineOil?: number;
  drainPlugWasher?: number;
  tappetORing?: number;
  sparkPlug?: number;
  airCleanerElement?: number;
  brakeShoePads?: number;
  gaskets?: number;
  battery?: number;
  chainSprocketBelt?: number;
  fuelHose?: number;
  tiresTubesFlaps?: number;
  bulbs?: number;
  bearings?: number;
  springs?: number;
  rubberPartsOilSeal?: number;
  plasticParts?: number;
  brakeFluid?: number;
  coolant?: number;
  partsOthers?: number;
  [key: string]: number | undefined;
};

export type PartsAmountsType = {
  engineOil?: number;
  drainPlugWasher?: number;
  tappetORing?: number;
  sparkPlug?: number;
  airCleanerElement?: number;
  brakeShoePads?: number;
  gaskets?: number;
  battery?: number;
  chainSprocketBelt?: number;
  fuelHose?: number;
  tiresTubesFlaps?: number;
  bulbs?: number;
  bearings?: number;
  springs?: number;
  rubberPartsOilSeal?: number;
  plasticParts?: number;
  brakeFluid?: number;
  coolant?: number;
  total?: any;
  partsOthers?: number;
  [key: string]: number | undefined;
};

export type TrimotorsJobAmountType = {
  pivotPin?: number;
  detachSteeringColumn?: number;
  differentialGearOverhaul?: number;
  topOverhaul?: number;
  replaceRubberBoots?: number;
  changeOil?: number;
  replaceTensioner?: number;
  replaceBrakeShoe?: number;
  replaceBrakeLightSwitch?: number;
  engineOverhauling?: number;
  tuneUp?: number;
  replaceHeadlightBulb?: number;
  rubberBootsGreasing?: number;
  replaceBrakeReservoir?: number;
  replaceClutchCable?: number;
  replaceAcceleratorCable?: number;
  brakeShoeCleaning?: number;
  replaceCarbonBrush?: number;
  replaceGearCable?: number;
  replaceOilPipeHose?: number;
  replaceEngineCover?: number;
  batteryCharging?: number;
  electricalMinorRepair?: number;
  electricalMajorRepair?: number;
  replaceFrontShockAbsorber?: number;
  replaceFuelStrainer?: number;
  replaceHandbrakeCable?: number;
  minorTroubleRepair?: number;
  majorTroubleRepair?: number;
  replaceStarterRelay?: number;
  replaceHeadlightRelay?: number;
  replaceIsolatorRubber?: number;
  replaceStatorMagnetoRotorAssy?: number;
  others?: number;
  othersText?: number;
};

export type DiagnosisStatus = "ok" | "ng" | "na" | null;

export interface DiagnosisState {
  status: DiagnosisStatus;
  remarks: string;
}

export type DiagnosisKeys =
  | "lights"
  | "horn"
  | "switches"
  | "brakes"
  | "tires"
  | "spokesWheels"
  | "driveChain"
  | "steering"
  | "suspension"
  | "idleSpeed"
  | "sideMain"
  | "engineOil"
  | "coolantLevel"
  | "brakeFluid"
  | "battery"
  | "cableOperation";

export type TrimotorsDiagnosisKeys =
  | "windshield"
  | "wipeArm"
  | "frontIndicator"
  | "frontHeadLamp"
  | "housingScudo"
  | "housingHeadlamp"
  | "frontFender"
  | "mudFlapFront"
  | "scudoFront"
  | "frontEmblem"
  | "tailLamp"
  | "bumper"
  | "mudFlapRear"
  | "rearDoor"
  | "rearEmblem"
  | "tailEnd"
  | "leftBeading"
  | "leftBodyPaint"
  | "mudGuard"
  | "rightBeading"
  | "rightBodyPaint"
  | "checkHoles"
  | "damageStitching"
  | "coverHood"
  | "tapeHood"
  | "alumninum"
  | "nailScrew"
  | "dashboard"
  | "seatsDriver"
  | "seatsPassenger"
  | "seatBelts"
  | "handleLeather"
  | "rubberMatting"
  | "underseatCover"
  | "headlamp"
  | "beam"
  | "signalLamp"
  | "hazardlamp"
  | "wiper"
  | "interiorLamp"
  | "gaugeLamp"
  | "carCharger"
  | "tools"
  | "battery"
  | "jack"
  | "spareTire"
  | "sideMirror"
  | "warrantyBooklet";

  export type TrimotorsPartsReplacement = {
  bajajOil: boolean;
  oilFilter: boolean;
  fuelStrainer: boolean;
  speedometerCable: boolean;
  handBrakeCable: boolean;
  clutchCable: boolean;
  gearCableBlack: boolean;
  gearCableWhite: boolean;
  reverseCable: boolean;
  acceleratorCable: boolean;
  headlightBulb: boolean;
  brakeLightBulb: boolean;
  peanutBulb: boolean;
  sealHeadCover: boolean;
  clipSpring: boolean;
  pivotPin: boolean;
  fuse10Amp: boolean;
  brakePipeAssly: boolean;
  kitMajorTmc: boolean;
  wheelCylinderAsslyFront: boolean;
  brakeShoe: boolean;
  wheelCylinderAsslyRear: boolean;
  sparkplug: boolean;
  sparkplugCapRh: boolean;
  headlightRelay: boolean;
  partsOthers: boolean;
  partsOthersText: string;
  partsOthersItems?: PartsOthersItem[]; // New array for multiple others
  [key: string]: boolean | string | PartsOthersItem[] | undefined;
};

export type TrimotorsPartsBrand = {
  bajajOil?: string;
  oilFilter?: string;
  fuelStrainer?: string;
  speedometerCable?: string;
  handBrakeCable?: string;
  clutchCable?: string;    
  gearCableBlack?: string;
  gearCableWhite?: string;
  reverseCable?: string;
  acceleratorCable?: string;
  headlightBulb?: string;
  brakeLightBulb?: string;
  peanutBulb?: string;
  sealHeadCover?: string;
  clipSpring?: string;
  pivotPin?: string;
  fuse10Amp?: string;
  brakePipeAssly?: string;
  kitMajorTmc?: string;
  wheelCylinderAsslyFront?: string;
  brakeShoe?: string;
  wheelCylinderAsslyRear?: string;
  sparkplug?: string;
  sparkplugCapRh?: string;
  headlightRelay?: string;
  partsOthers?: string;
  [key: string]: string | undefined;
};

export type TrimotorsPartsNumber = {
  bajajOil?: number;
  oilFilter?: number;
  fuelStrainer?: number;
  speedometerCable?: number;
  handBrakeCable?: number;
  clutchCable?: number;
  gearCableBlack?: number;
  gearCableWhite?: number;
  reverseCable?: number;
  acceleratorCable?: number;
  headlightBulb?: number;
  brakeLightBulb?: number;
  peanutBulb?: number;
  sealHeadCover?: number;
  clipSpring?: number;
  pivotPin?: number;
  fuse10Amp?: number;
  brakePipeAssly?: number;
  kitMajorTmc?: number;
  wheelCylinderAsslyFront?: number;
  brakeShoe?: number;
  wheelCylinderAsslyRear?: number;
  sparkplug?: number;
  sparkplugCapRh?: number;
  headlightRelay?: number;
  partsOthers?: number;
  [key: string]: number | undefined;
};

export type TrimotorsPartsQuantity = {
  bajajOil?: number;
  oilFilter?: number;
  fuelStrainer?: number;
  speedometerCable?: number;
  handBrakeCable?: number;
  clutchCable?: number;
  gearCableBlack?: number;
  gearCableWhite?: number;
  reverseCable?: number;
  acceleratorCable?: number;
  headlightBulb?: number;
  brakeLightBulb?: number;
  peanutBulb?: number;
  sealHeadCover?: number;
  clipSpring?: number;
  pivotPin?: number;
  fuse10Amp?: number;
  brakePipeAssly?: number;
  kitMajorTmc?: number;
  wheelCylinderAsslyFront?: number;
  brakeShoe?: number;
  wheelCylinderAsslyRear?: number;
  sparkplug?: number;
  sparkplugCapRh?: number;
  headlightRelay?: number;
  partsOthers?: number;
  [key: string]: number | undefined;
};

export type TrimotorsPartsAmountsType = {
  bajajOil?: number;
  oilFilter?: number;
  fuelStrainer?: number;
  speedometerCable?: number;
  handBrakeCable?: number;
  clutchCable?: number;
  gearCableBlack?: number;
  gearCableWhite?: number;
  reverseCable?: number;
  acceleratorCable?: number;
  headlightBulb?: number;
  brakeLightBulb?: number;
  peanutBulb?: number;
  sealHeadCover?: number;
  clipSpring?: number;
  pivotPin?: number;
  fuse10Amp?: number;
  brakePipeAssly?: number;
  kitMajorTmc?: number;
  wheelCylinderAsslyFront?: number;
  brakeShoe?: number;
  wheelCylinderAsslyRear?: number;
  sparkplug?: number;
  sparkplugCapRh?: number;
  headlightRelay?: number;
    partsOthers?: number;
  [key: string]: number | undefined;
};