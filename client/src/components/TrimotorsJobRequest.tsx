import Input from "./ui/input";
import Label from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import { TrimotorsJobAmountType, TrimotorsJobRequestType } from "@/types/jobOrderFormType";

interface JobItem {
  key: string;
  label: string;
}

interface TrimotorsJobRequestProps {
  jobRequest: TrimotorsJobRequestType;
  setJobRequest: React.Dispatch<React.SetStateAction<TrimotorsJobRequestType>>;
  jobAmounts: TrimotorsJobAmountType;
  handleJobAmountChange: (key: keyof TrimotorsJobAmountType, value: number) => void;
  jobTotal: number;
}

export default function TrimotorsJobRequest({
  jobRequest,
  setJobRequest,
  jobAmounts,
  handleJobAmountChange,
  jobTotal,
}: TrimotorsJobRequestProps) {
  const jobItems: JobItem[] = [
    { key: 'vehicleWashing', label: 'Vehicle Washing & Cleaning' },
    { key: 'airFilter', label: 'Clean/replace Air filter Element' },
    { key: 'breather', label: 'Clean/Replace breather tube filter' },
    { key: 'checkLights', label: 'Check all lights for working' },
    { key: 'oilStrainer', label: 'Replace oil strainer' },
    { key: 'checkSteering', label: 'Check/adjust steering column tight race & lock nut' },
    { key: 'cleanSpark', label: 'Clean/Adjust/Replace Spark plug gap' },
    { key: 'checkValve', label: 'Check & adjust valve clearance' },
    { key: 'checkFuel', label: 'Check/Replace fuel pipe' },
    { key: 'checkBattery', label: 'Check Battery electrolyte level & top up' },
    { key: 'tireRotation', label: 'Do tire rotation (seq. 1 & 2)' },
    { key: 'replaceProp', label: 'Replace Prop. Shaft rubber buffers' },
    { key: 'replaceOil', label: 'Replace Oil Filter' },
    { key: 'checkCabies', label: 'Check and adjust control cabies' },
    { key: 'checkShock', label: 'Check front/near shock absorbers for any defect' },
    { key: 'checkBrake', label: 'Check & top up brake fluid' },
    { key: 'deCarbonising', label: 'De-carbonising engine' },
    { key: 'checkBrakeLiner', label: 'Check brake liner wear, replace if required' },
    { key: 'replaceEngine', label: 'Replace engine oil' },
    { key: 'replaceDifferential', label: 'Replace/top up differential oil' },
    { key: 'greaseSteering', label: 'Grease steering races, balls' },
    { key: 'greaseFront', label: 'Grease Front Suspension' },
    { key: 'greaseNipple', label: 'Grease Front & Rear axles (Grease nipple)' },
    { key: 'greasePropeller', label: 'Grease Propeller shaft flanges' },
    { key: 'greaseGear', label: 'Grease Gear shifter sector' },
    { key: 'greaseFare', label: 'Grease Fare/Speedo meter drive' },
    { key: 'speedometer', label: 'Speedometer inner greasing' },
    { key: 'petroleum', label: 'Apply petroleum jelly on battery terminals' }
  ];

  const firstColumnItems = jobItems.slice(0, Math.ceil(jobItems.length / 2));
  const secondColumnItems = jobItems.slice(Math.ceil(jobItems.length / 2));

  const renderJobItem = (item: JobItem) => (
    <div key={item.key} className="flex items-center justify-between gap-4 mb-2">
      <Label onCheck className="flex-1">
        <Input
          type="checkbox"
          checked={jobRequest[item.key as keyof TrimotorsJobRequestType] as boolean}
          onChange={(e) =>
            setJobRequest({
              ...jobRequest,
              [item.key]: e.target.checked,
            })
          }
        />
        {item.label}
      </Label>
      {jobRequest[item.key as keyof TrimotorsJobRequestType] as boolean && (
        <div className="w-32 min-w-[8rem]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
              ₱
            </span>
            <Input
              type="number"
              placeholder="0.00"
              value={jobAmounts[item.key as keyof TrimotorsJobAmountType] || ''}
              onChange={(e) => 
                handleJobAmountChange(
                  item.key as keyof TrimotorsJobAmountType, 
                  Number(e.target.value)
                )
              }
              min="0"
              step="0.01"
              className="pl-8 pr-3 text-right text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-semibold mb-4 text-blue-700 text-center">
        SPECIFIC JOB(S) REQUEST
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* First Column */}
        <div className="space-y-2">
          {firstColumnItems.map(renderJobItem)}
        </div>
        
        {/* Second Column */}
        <div className="space-y-2">
          {secondColumnItems.map(renderJobItem)}
          
          {/* Others field - placed in second column */}
          <div className="flex items-center justify-between gap-4 mb-2">
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
                  className="flex-1 text-sm"
                />
              )}
            </div>
            {jobRequest.others && (
              <div className="w-32 min-w-[8rem]">
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
                    className="pl-8 pr-3 text-right text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {(Object.values(jobRequest).some(val => val === true) || jobTotal > 0) && (
        <div className="pt-4 mt-6 border-t border-gray-300 col-span-full">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total Labor Cost:</span>
            <span className="font-bold text-blue-700">
              {phpCurrency(jobTotal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}