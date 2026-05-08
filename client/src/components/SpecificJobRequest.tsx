// components/SpecificJobRequest.tsx
import Input from "./ui/input";
import { Label } from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import {
  JobAmountsType,
  JobRequest,
  CouponType,
  JobOthersItem,
} from "@/types/jobOrderFormType";
import { jobItems } from "@/constants/job-items";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SpecificJobRequestProps {
  jobRequest: JobRequest;
  setJobRequest: React.Dispatch<React.SetStateAction<JobRequest>>;
  jobAmounts: JobAmountsType;
  handleJobAmountChange: (key: keyof JobAmountsType, value: number) => void;
  jobTotal: number;
}

// Brand options (same as parts section)
const brandChoices = ["Honda", "Yamaha", "Kawasaki", "Suzuki", "Bajaj", "Hatatsu", "BG Powerstroke"];

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
  
  // Get others items from jobRequest or initialize empty array
  const othersItems: JobOthersItem[] = jobRequest.othersItems || [];
  
  // Add new others item
  const addOthersItem = () => {
    const newItem: JobOthersItem = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
    };
    const updatedItems = [...othersItems, newItem];
    setJobRequest({
      ...jobRequest,
      othersItems: updatedItems,
    });
  };
  
  // Remove others item
  const removeOthersItem = (id: string) => {
    const updatedItems = othersItems.filter(item => item.id !== id);
    setJobRequest({
      ...jobRequest,
      othersItems: updatedItems,
    });
    
    // If no items left, uncheck the others checkbox
    if (updatedItems.length === 0) {
      setJobRequest(prev => ({
        ...prev,
        others: false,
      }));
    }
  };
  
  // Update others item description
  const updateOthersDescription = (id: string, description: string) => {
    const updatedItems = othersItems.map(item =>
      item.id === id ? { ...item, description } : item
    );
    setJobRequest({
      ...jobRequest,
      othersItems: updatedItems,
    });
  };
  
  // Update others item brand
  const updateOthersBrand = (id: string, brand: string) => {
    const updatedItems = othersItems.map(item =>
      item.id === id ? { ...item, brand } : item
    );
    setJobRequest({
      ...jobRequest,
      othersItems: updatedItems,
    });
  };
  
  // Update others item amount
  const updateOthersAmount = (id: string, amount: number) => {
    const updatedItems = othersItems.map(item =>
      item.id === id ? { ...item, amount } : item
    );
    setJobRequest({
      ...jobRequest,
      othersItems: updatedItems,
    });
    
    // Update the total others amount in jobAmounts
    const totalOthersAmount = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    handleJobAmountChange("others", totalOthersAmount);
  };
  
  // Toggle others checkbox
  const toggleOthers = (checked: boolean) => {
    if (checked) {
      // If checking, add one empty item if none exists
      if (othersItems.length === 0) {
        const newItem: JobOthersItem = {
          id: Date.now().toString(),
          description: "",
          amount: 0,
        };
        setJobRequest({
          ...jobRequest,
          others: true,
          othersItems: [newItem],
        });
      } else {
        setJobRequest({
          ...jobRequest,
          others: true,
        });
      }
    } else {
      // If unchecking, clear all items and reset amount
      setJobRequest({
        ...jobRequest,
        others: false,
        othersItems: [],
      });
      handleJobAmountChange("others", 0);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-semibold mb-3 text-blue-700 text-center">
        SPECIFIC JOB(S) REQUEST
      </h3>
      <div className="space-y-2">
        {/* Coupon Item - Similar to other job items with brand */}
        <div className="flex items-center gap-4 text-sm flex-1 flex-wrap">
          <Label className="flex items-center gap-2 whitespace-nowrap w-32">
            <Input
              type="checkbox"
              checked={jobRequest.coupon}
              onChange={(e) =>
                setJobRequest({
                  ...jobRequest,
                  coupon: e.target.checked,
                  // Reset selected coupon and brand when unchecking
                  ...(e.target.checked === false && {
                    selectedCoupon: undefined,
                    couponBrand: undefined,
                  }),
                })
              }
            />
            Coupon
          </Label>

          {/* Show coupon fields when coupon is checked - nasa tabi mismo */}
          {jobRequest.coupon && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Coupon dropdown */}
              <div className="w-40">
                <select
                  value={jobRequest.selectedCoupon || ""}
                  onChange={(e) =>
                    setJobRequest({
                      ...jobRequest,
                      selectedCoupon: e.target.value || undefined,
                    })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="" disabled>
                    Select Coupon
                  </option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.name}>
                      {coupon.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand dropdown - lalabas after pumili ng coupon */}
              {jobRequest.selectedCoupon && (
                <>
                  <div className="flex-1">
                    <select
                        value={jobRequest.couponBrand || ""}
                        onChange={(e) =>
                          setJobRequest({
                            ...jobRequest,
                            couponBrand: e.target.value || undefined,
                          })
                        }
                        className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="" disabled>
                          Select Brand
                        </option>
                        {brandChoices.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Amount input field */}
                  <div className="w-32">
                 
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                        ₱
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={jobAmounts.selectedCoupon || ""}
                        onChange={(e) =>
                          handleJobAmountChange("selectedCoupon", Number(e.target.value))
                        }
                        step="0.01"
                        className="pl-8 pr-3 text-right w-full"
                        required
                      />
           
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Regular job items */}
        {jobItems
          .filter(
            (item) => item.key !== "others" && item.key !== "selectedCoupon",
          )
          .map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <Label className="flex-1">
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
                          Number(e.target.value),
                        )
                      }
                      step="0.01"
                      className="pl-8 pr-3 text-right"
                      required
                    />
                </div>
              )}
            </div>
          ))}

        {/* Multiple Others Fields */}
        <div className="space-y-3 ">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 font-semibold text-gray-700">
              <Input
                type="checkbox"
                checked={jobRequest.others}
                onChange={(e) => toggleOthers(e.target.checked)}
              />
              Others
            </Label>
            {jobRequest.others && (
              <Button
                type="button"
                onClick={addOthersItem}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Job
              </Button>
            )}
          </div>
          
          {jobRequest.others && othersItems.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4 border border-dashed border-gray-300 rounded-md">
              No custom jobs added. Click "Add Job" to add.
            </div>
          ) : (
            jobRequest.others && othersItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-md">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateOthersDescription(item.id, e.target.value)}
                      placeholder="Enter job description"
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
                <div className="w-40">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      ₱
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.amount || ""}
                      onChange={(e) => updateOthersAmount(item.id, Number(e.target.value))}
                      step="0.01"
                      className="pl-8 pr-3 text-right"
                      required
                    />
                </div>
                <Button
                  type="button"
                  onClick={() => removeOthersItem(item.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Total section */}
        {(Object.values(jobRequest).some((val) => val === true) ||
          jobTotal > 0 ||
          (jobRequest.others && othersItems.length > 0)) && (
          <div className="pt-4 mt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Total Labor Cost:
              </span>
              <span className="font-bold text-green-700">
                {phpCurrency(jobTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}