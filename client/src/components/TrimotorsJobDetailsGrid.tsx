import { useMemo } from "react";
import SpecificJobRequest from "./SpecificJobRequest";
import TrimotorsPartsReplacementSection from "./TrimotorsPartsReplacement";
import phpCurrency from "@/utils/phpCurrency";
import { 
  TrimotorsJobAmountType,
  TrimotorsJobRequestType,
  TrimotorsPartsAmountsType, 
  TrimotorsPartsReplacement,
  TrimotorsPartsBrand,
  TrimotorsPartsNumber,
  TrimotorsPartsQuantity,
} from "@/types/jobOrderFormType";
import TrimotorsJobRequest from "./TrimotorsJobRequest";


interface TrimotorsJobDetailsGridProps {
  jobRequest: TrimotorsJobRequestType;
  setJobRequest: React.Dispatch<React.SetStateAction<TrimotorsJobRequestType>>;
  partsReplacement: TrimotorsPartsReplacement;
  setPartsReplacement: React.Dispatch<React.SetStateAction<TrimotorsPartsReplacement>>;
  jobAmounts: TrimotorsJobAmountType;
  handleJobAmountChange: (key: keyof TrimotorsJobAmountType, value: number) => void;
  partsAmounts: TrimotorsPartsAmountsType;
  handlePartsAmountChange: (key: keyof TrimotorsPartsAmountsType, value: number) => void;
  partsBrand: TrimotorsPartsBrand;
  setPartsBrand: React.Dispatch<React.SetStateAction<TrimotorsPartsBrand>>;
  partsNumber: TrimotorsPartsNumber;
  setPartsNumber: React.Dispatch<React.SetStateAction<TrimotorsPartsNumber>>;
  partsQuantity: TrimotorsPartsQuantity;
  setPartsQuantity: React.Dispatch<React.SetStateAction<TrimotorsPartsQuantity>>;
  jobTotal: number;
  partsTotal: number;
  overallTotal: number;
}

export default function TrimotorsJobDetailsGrid({
  jobRequest,
  setJobRequest,
  partsReplacement,
  setPartsReplacement,
  jobAmounts,
  handleJobAmountChange,
  partsAmounts,
  handlePartsAmountChange,
  partsBrand,
  setPartsBrand,
  partsNumber,
  setPartsNumber,
  partsQuantity,
  setPartsQuantity,
  jobTotal,
  partsTotal,
  overallTotal,
}: TrimotorsJobDetailsGridProps) {
  

  return (
   <>
   <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
    
      <TrimotorsJobRequest
        jobRequest={jobRequest}
        setJobRequest={setJobRequest}
        jobAmounts={jobAmounts}
        handleJobAmountChange={handleJobAmountChange}
        jobTotal={jobTotal}
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
    
      <TrimotorsPartsReplacementSection
        partsReplacement={partsReplacement}
        setPartsReplacement={setPartsReplacement}
        partsAmounts={partsAmounts}
        handlePartsAmountChange={handlePartsAmountChange}
        partsTotal={partsTotal}
        partsBrand={partsBrand}
        setPartsBrand={setPartsBrand}
        partsNumber={partsNumber}
        setPartsNumber={setPartsNumber}
        partsQuantity={partsQuantity}
        setPartsQuantity={setPartsQuantity}
      />

      {(jobTotal > 0 || partsTotal > 0) && (
        <div className="col-span-1 lg:col-span-2 bg-blue-50 p-4 rounded-md border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-blue-800">GRAND TOTAL:</span>
            <span className="font-bold text-2xl text-blue-800">
              {phpCurrency(overallTotal)}
            </span>
          </div>
        </div>
      )}
    </div>
   </>
    
  );
}