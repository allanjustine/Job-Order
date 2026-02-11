import Input from "./ui/input";
import Label from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import { JobAmountsType, JobRequest, CouponType } from "@/types/jobOrderFormType";
import { jobItems } from "@/constants/job-items";

interface SpecificJobRequestProps {
  jobRequest: JobRequest;
  setJobRequest: React.Dispatch<React.SetStateAction<JobRequest>>;
  jobAmounts: JobAmountsType;
  handleJobAmountChange: (key: keyof JobAmountsType, value: number) => void;
  jobTotal: number;
}

export const coupons: CouponType[] = [
  { id: 1, name: "Coupon 1" },
  { id: 2, name: "Coupon 2" },
  { id: 3, name: "Coupon 3" },
  { id: 4, name: "Coupon 4" },
  { id: 5, name: "Coupon 5" },
  { id: 6, name: "Coupon 6" },
];

export default function SpecificJobRequest({
  jobRequest,
  setJobRequest,
  jobAmounts,
  handleJobAmountChange,
  jobTotal,
}: SpecificJobRequestProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-semibold mb-3 text-blue-700 text-center">
        SPECIFIC JOB(S) REQUEST
      </h3>
      <div className="space-y-2">
        {/* Coupon Item - Similar to other job items */}
        <div className="flex items-center justify-between gap-4">
          <Label onCheck className="flex-1">
            <Input
              type="checkbox"
              checked={jobRequest.coupon}
              onChange={(e) =>
                setJobRequest({
                  ...jobRequest,
                  coupon: e.target.checked,
                  // Reset selected coupon when unchecking
                  ...(e.target.checked === false && { selectedCoupon: undefined }),
                })
              }
            />
            Coupon
          </Label>
          
          {/* Show coupon dropdown and amount field side-by-side when coupon is checked */}
          {jobRequest.coupon && (
            <div className="flex items-center gap-2 w-80"> {/* Increased width */}
              {/* Coupon dropdown */}
              <div className="w-1/2">
                <select
                  value={jobRequest.selectedCoupon || ""}
                  onChange={(e) =>
                    setJobRequest({
                      ...jobRequest,
                      selectedCoupon: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="" disabled>Select Coupon</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Amount input field - show only when coupon is selected */}
              {jobRequest.selectedCoupon && (
                <div className="w-1/2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      ₱
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={jobAmounts.coupon || ""}
                      onChange={(e) =>
                        handleJobAmountChange("coupon", Number(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      className="pl-8 pr-3 text-right w-full"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Regular job items */}
        {jobItems
          .filter((item) => item.key !== "others")
          .map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4"
            >
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
              {(jobRequest[item.key as keyof JobRequest] as boolean) && (
                <div className="w-40">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      ₱
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={jobAmounts[item.key as keyof JobAmountsType] || ""}
                      onChange={(e) =>
                        handleJobAmountChange(
                          item.key as keyof JobAmountsType,
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                      className="pl-8 pr-3 text-right"
                      required
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
                value={jobRequest.othersText || ""}
                onChange={(e) =>
                  setJobRequest({
                    ...jobRequest,
                    othersText: e.target.value,
                  })
                }
                placeholder="Specify"
                className="flex-1"
                required
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
                  value={jobAmounts.others || ""}
                  onChange={(e) =>
                    handleJobAmountChange("others", Number(e.target.value))
                  }
                  min="0"
                  step="0.01"
                  className="pl-8 pr-3 text-right"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Total section */}
        {(Object.values(jobRequest).some((val) => val === true) ||
          jobTotal > 0) && (
          <div className="pt-4 mt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Total Labor Cost:
              </span>
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