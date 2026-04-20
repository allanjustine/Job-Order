import Input from "./ui/input";
import { Label } from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import {
  TrimotorsJobAmountType,
  TrimotorsJobRequestType,
} from "@/types/jobOrderFormType";
import {
  TrimotorsJobItem,
  trimotorsJobItems,
} from "@/constants/trimotors-job-items";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

// Extended type for multiple others items
interface OthersJobItem {
  id: string;
  description: string;
  amount: number;
}

interface TrimotorsJobRequestProps {
  jobRequest: TrimotorsJobRequestType;
  setJobRequest: React.Dispatch<React.SetStateAction<TrimotorsJobRequestType>>;
  jobAmounts: TrimotorsJobAmountType;
  handleJobAmountChange: (
    key: keyof TrimotorsJobAmountType,
    value: number
  ) => void;
  jobTotal: number;
  setJobTotal?: (total: number) => void;
}

export default function TrimotorsJobRequest({
  jobRequest,
  setJobRequest,
  jobAmounts,
  handleJobAmountChange,
  jobTotal,
  setJobTotal,
}: TrimotorsJobRequestProps) {
  const firstColumnItems = trimotorsJobItems.slice(
    0,
    Math.ceil(trimotorsJobItems.length / 2)
  );
  const secondColumnItems = trimotorsJobItems
    .filter((item) => item.key !== "others")
    .slice(Math.ceil(trimotorsJobItems.length / 2));

  // Get others items from jobRequest
  const [othersItems, setOthersItems] = useState<OthersJobItem[]>(() => {
    return (jobRequest as any).othersItems || [];
  });

  const computedTotal = useMemo(() => {
    const standardTotal = Object.entries(jobAmounts)
      .filter(([key]) => key !== 'others')
      .reduce((sum, [, value]) => sum + (value || 0), 0);
    const othersTotal = othersItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    return standardTotal + othersTotal;
  }, [jobAmounts, othersItems]);

  const syncToParent = (items: OthersJobItem[]) => {
    const othersTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    handleJobAmountChange("others", othersTotal);
    setJobRequest((prev) => ({ ...prev, others: items.length > 0, othersItems: items as any }));
    if (setJobTotal) {
      const standardTotal = Object.entries(jobAmounts)
        .filter(([key]) => key !== 'others')
        .reduce((sum, [, value]) => sum + (value || 0), 0);
      setJobTotal(standardTotal + othersTotal);
    }
  };

  // Add new others item
  const addOthersItem = () => {
    const newItem: OthersJobItem = { id: Date.now().toString(), description: "", amount: 0 };
    const updated = [...othersItems, newItem];
    setOthersItems(updated);
    syncToParent(updated);
  };

  const removeOthersItem = (id: string) => {
    const updated = othersItems.filter(item => item.id !== id);
    setOthersItems(updated);
    syncToParent(updated);
  };

  const updateOthersDescription = (id: string, description: string) => {
    const updated = othersItems.map(item => item.id === id ? { ...item, description } : item);
    setOthersItems(updated);
    syncToParent(updated);
  };

  const updateOthersAmount = (id: string, amount: number) => {
    const updated = othersItems.map(item => item.id === id ? { ...item, amount } : item);
    setOthersItems(updated);
    syncToParent(updated);
  };

  const renderJobItem = (item: TrimotorsJobItem) => (
    <div
      key={item.key}
      className="flex items-center justify-between gap-4 mb-2"
    >
      <Label className="flex-1">
        <Input
          type="checkbox"
          checked={
            jobRequest[item.key as keyof TrimotorsJobRequestType] as boolean
          }
          onChange={(e) => {
            setJobRequest({
              ...jobRequest,
              [item.key]: e.target.checked,
            });
            if (!e.target.checked) {
              handleJobAmountChange(
                item.key as keyof TrimotorsJobAmountType,
                0
              );
            }
          }}
        />
        {item.label}
      </Label>
      {(jobRequest[item.key as keyof TrimotorsJobRequestType] as boolean) && (
        <div className="w-32 min-w-[8rem]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
              ₱
            </span>
            <Input
              type="number"
              placeholder="0.00"
              value={jobAmounts[item.key as keyof TrimotorsJobAmountType] || ""}
              onChange={(e) => {
                handleJobAmountChange(
                  item.key as keyof TrimotorsJobAmountType,
                  Number(e.target.value)
                );
              }}
              min="0"
              step="0.01"
              className="pl-8 pr-3 text-right text-sm"
              required
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
        <div className="space-y-2">{firstColumnItems.map(renderJobItem)}</div>

        {/* Second Column */}
        <div className="space-y-2">
          {secondColumnItems.map(renderJobItem)}

          {/* Multiple Others Fields Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 font-semibold text-gray-700">
                <Input
                  type="checkbox"
                  checked={othersItems.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (othersItems.length === 0) {
                        addOthersItem();
                      }
                    } else {
                      setOthersItems([]);
                      syncToParent([]);
                    }
                  }}
                />
                Others (Custom Jobs)
              </Label>
              {othersItems.length > 0 && (
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

            {othersItems.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-4">
                {/* No custom jobs added. Click "Add Job" to add. */}
              </div>
            ) : (
              othersItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateOthersDescription(item.id, e.target.value)}
                        placeholder="Enter job description"
                        className="flex-1 text-sm"
                      />
                      
                      {/* Amount Field */}
                      <div className="w-32">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                            ₱
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={item.amount || ""}
                            onChange={(e) => updateOthersAmount(item.id, Number(e.target.value))}
                            min="0"
                            step="0.01"
                            className="pl-8 pr-3 text-right text-sm"
                          />
                        </div>
                      </div>
                    </div>
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
        </div>
      </div>

      {/* Use computedTotal - this will update immediately when typing */}
      {(Object.values(jobRequest).some((val) => val === true) ||
        computedTotal > 0 ||
        othersItems.length > 0) && (
        <div className="pt-4 mt-6 border-t border-gray-300 col-span-full">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">
              TOTAL LABOR COST:
            </span>
            <span className="font-bold text-green-700 text-lg">
              {phpCurrency(computedTotal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}