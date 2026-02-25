
export type CouponType = {
  id: number;
  name: string;
};

export type JobRequest = {
  coupon: boolean;
  selectedCoupon?: string;
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
  others: boolean;
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
};


export type TrimotorsJobRequestType = {
  vehicleWashing: boolean;
  airFilter: boolean;
  breather: boolean;
  checkLights: boolean;
  oilStrainer: boolean;
  checkSteering: boolean;
  cleanSpark: boolean;
  checkValve: boolean;
  checkFuel: boolean;
  checkBattery: boolean;
  tireRotation: boolean;
  replaceProp: boolean;
  replaceOil: boolean;
  checkCabies: boolean;
  checkShock: boolean;
  checkBrake: boolean;
  deCarbonising: boolean;
  checkBrakeLiner: boolean;
  replaceEngine: boolean;
  replaceDifferential: boolean;
  greaseSteering: boolean;
  greaseFront: boolean;
  greaseNipple: boolean;
  greasePropeller: boolean;
  greaseGear: boolean;
  greaseFare: boolean;
  speedometer: boolean;
  petroleum: boolean;
  others: boolean;
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
  partsOthers?: number;
};

export type TrimotorsJobAmountType = {
  vehicleWashing?: number;
  airFilter?: number;
  breather?: number;
  checkLights?: number;
  oilStrainer?: number;
  checkSteering?: number;
  cleanSpark?: number;
  checkValve?: number;
  checkFuel?: number;
  checkBattery?: number;
  tireRotation?: number;
  replaceProp?: number;
  replaceOil?: number;
  checkCabies?: number;
  checkShock?: number;
  checkBrake?: number;
  deCarbonising?: number;
  checkBrakeLiner?: number;
  replaceEngine?: number;
  replaceDifferential?: number;
  greaseSteering?: number;
  greaseFront?: number;
  greaseNipple?: number;
  greasePropeller?: number;
  greaseGear?: number;
  greaseFare?: number;
  speedometer?: number;
  petroleum?: number;
  others?: number;
  othersText?: number;
};

export type DiagnosisStatus = 'ok' | 'ng' | 'na' | null;

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
  | "windshield" | "wipeArm"  | "frontIndicator" | "frontHeadLamp"  | "housingScudo"  | "housingHeadlamp" | "frontFender" | "mudFlapFront" | "scudoFront" | "frontEmblem"
  | "tailLamp" | "bumper" | "mudFlapRear" | "rearDoor" | "rearEmblem" | "tailEnd"
  | "leftBeading" | "leftBodyPaint"
  | "mudGuard" | "rightBeading" | "rightBodyPaint"
  | "checkHoles" | "damageStitching" | "coverHood" | "tapeHood" | "alumninum" | "nailScrew"
  | "dashboard" | "seatsDriver" | "seatsPassenger" | "seatBelts" | "handleLeather" | "rubberMatting" | "underseatCover"
  | "headlamp" | "beam" | "signalLamp" | "hazardlamp" | "wiper" | "interiorLamp" | "gaugeLamp" | "carCharger"
  | "tools" | "battery" | "jack" | "spareTire" | "sideMirror" | "warrantyBooklet"
  





