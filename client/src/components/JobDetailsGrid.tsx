import { useMemo } from "react";
import SpecificJobRequest from "./SpecificJobRequest";
import PartsReplacementSection from "./PartsReplacement";
import phpCurrency from "@/utils/phpCurrency";
import { 
  JobAmountsType, 
  PartsAmountsType, 
  JobRequest, 
  PartsReplacement 
} from "@/types/jobOrderFormType";

interface JobDetailsGridProps {
  jobRequest: JobRequest;
  setJobRequest: React.Dispatch<React.SetStateAction<JobRequest>>;
  partsReplacement: PartsReplacement;
  setPartsReplacement: React.Dispatch<React.SetStateAction<PartsReplacement>>;
  jobAmounts: JobAmountsType;
  handleJobAmountChange: (key: keyof JobAmountsType, value: number) => void;
  partsAmounts: PartsAmountsType;
  handlePartsAmountChange: (key: keyof PartsAmountsType, value: number) => void;
  jobTotal: number;
  partsTotal: number;
  overallTotal: number;
}

export default function JobDetailsGrid({
  jobRequest,
  setJobRequest,
  partsReplacement,
  setPartsReplacement,
  jobAmounts,
  handleJobAmountChange,
  partsAmounts,
  handlePartsAmountChange,
  jobTotal,
  partsTotal,
  overallTotal,
}: JobDetailsGridProps) {
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    
      <SpecificJobRequest
        jobRequest={jobRequest}
        setJobRequest={setJobRequest}
        jobAmounts={jobAmounts}
        handleJobAmountChange={handleJobAmountChange}
        jobTotal={jobTotal}
      />

      <PartsReplacementSection
        partsReplacement={partsReplacement}
        setPartsReplacement={setPartsReplacement}
        partsAmounts={partsAmounts}
        handlePartsAmountChange={handlePartsAmountChange}
        partsTotal={partsTotal}
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
  );
}