export type JobRequest = {
  request: string;
  cost: number;
};

export type PartRequest = {
  name: string;
  partNo: string;
  quantity: number;
  price: number;
};

export type VehicleDocument = {
  ownerToolKit: boolean;
  ownerManual: boolean;
  warrantyGuideBook: boolean;
  others: boolean;
  othersText: string;
};

export type VehicleVisualCheck = {
  dent: boolean;
  dentNotes: string;
  scratch: boolean;
  scratchNotes: string;
  broken: boolean;
  brokenNotes: string;
  missing: boolean;
  missingNotes: string;
};
