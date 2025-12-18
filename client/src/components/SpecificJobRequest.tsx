import Input from "./ui/input";
import Label from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import { JobAmountsType, JobRequest } from "@/types/jobOrderFormType";

interface JobItem {
  key: string;
  label: string;
}

interface SpecificJobRequestProps {
  jobRequest: JobRequest;
  setJobRequest: React.Dispatch<React.SetStateAction<JobRequest>>;
  jobAmounts: JobAmountsType;
  handleJobAmountChange: (key: keyof JobAmountsType, value: number) => void;
  jobTotal: number;
}

export default function TrimotorsJobRequest({
  jobRequest,
  setJobRequest,
  jobAmounts,
  handleJobAmountChange,
  jobTotal,
}: SpecificJobRequestProps) {
  const jobItems: JobItem[] = [
    { key: 'coupon', label: 'Coupon 1 / 2 / 3' },
    { key: 'changeOil', label: 'Change Oil / Tune-up' },
    { key: 'overhaul', label: 'Top / major Overhaul' },
    { key: 'chainSprocket', label: 'Chain & Sprocket / Drive Belt' },
    { key: 'carburetor', label: 'Carburetor / Fuel Injection' },
    { key: 'brakeSystem', label: 'Brake System (FR / RR)' },
    { key: 'steeringSystem', label: 'Steering System' },
    { key: 'suspensionSystem', label: 'Suspension System (FR / RR) / Swing Arm' },
    { key: 'wheelsSpokes', label: 'Wheels / Spokes (FR / RR)' },
    { key: 'wheelAdjustment', label: 'Wheel Adjustment' },
    { key: 'batteryCharging', label: 'Battery Charging' },
    { key: 'minorElectrical', label: 'Minor Electrical (Horn / Winker / Others)' },
    { key: 'majorElectrical', label: 'Major Electrical (Charging / Ignition / Starting)' },
    { key: 'installAccessories', label: 'Install Accessories' },
    { key: 'generalCheckup', label: 'General Check Up' },
    { key: 'warrantyRepair', label: 'Warranty Repair' },
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-semibold mb-3 text-blue-700 text-center">
        SPECIFIC JOB(S) REQUEST
      </h3>
      <div className="space-y-2">
        {jobItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <Label onCheck className="flex-1">
              <Input
                type="checkbox"
                checked={jobRequest[item.key as keyof JobRequest] as boolean}
                onChange={(e) =>
                  setJobRequest({
                    ...jobRequest,
                    [item.key]: e.target.checked,
                  })
                }
              />
              {item.label}
            </Label>
            {jobRequest[item.key as keyof JobRequest] as boolean && (
              <div className="w-40">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                    ₱
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={jobAmounts[item.key as keyof JobAmountsType] || ''}
                    onChange={(e) => 
                      handleJobAmountChange(
                        item.key as keyof JobAmountsType, 
                        Number(e.target.value)
                      )
                    }
                    min="0"
                    step="0.01"
                    className="pl-8 pr-3 text-right"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Others field */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Label onCheck>
              <Input
                type="checkbox"
                checked={jobRequest.others}
                onChange={(e) =>
                  setJobRequest({
                    ...jobRequest,
                    others: e.target.checked,
                  })
                }
              />
              Others
            </Label>
            {jobRequest.others && (
              <Input
                type="text"
                value={jobRequest.othersText || ''}
                onChange={(e) =>
                  setJobRequest({
                    ...jobRequest,
                    othersText: e.target.value,
                  })
                }
                placeholder="Specify"
                className="flex-1"
              />
            )}
          </div>
          {jobRequest.others && (
            <div className="w-40">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  ₱
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={jobAmounts.others || ''}
                  onChange={(e) => handleJobAmountChange('others', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="pl-8 pr-3 text-right"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Total section */}
        {(Object.values(jobRequest).some(val => val === true) || jobTotal > 0) && (
          <div className="pt-4 mt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Labor Cost:</span>
              <span className="font-bold text-blue-700">
                {phpCurrency(jobTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}