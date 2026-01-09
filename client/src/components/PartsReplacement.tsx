import Input from "./ui/input";
import Label from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import { PartsAmountsType, PartsReplacement } from "@/types/jobOrderFormType";
import { partsItems } from "@/constants/part-items";

interface PartsReplacementSectionProps {
  partsReplacement: PartsReplacement;
  setPartsReplacement: React.Dispatch<React.SetStateAction<PartsReplacement>>;
  partsAmounts: PartsAmountsType;
  handlePartsAmountChange: (key: keyof PartsAmountsType, value: number) => void;
  partsTotal: number;
}

export default function PartsReplacementSection({
  partsReplacement,
  setPartsReplacement,
  partsAmounts,
  handlePartsAmountChange,
  partsTotal,
}: PartsReplacementSectionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-semibold mb-3 text-blue-700 text-center">
        PARTS FOR REPLACEMENT
      </h3>
      <div className="space-y-2">
        {partsItems
          .filter((item) => item.key !== "partsOthers")
          .map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4"
            >
              <Label onCheck className="flex-1">
                <Input
                  type="checkbox"
                  checked={
                    partsReplacement[
                      item.key as keyof PartsReplacement
                    ] as boolean
                  }
                  onChange={(e) =>
                    setPartsReplacement({
                      ...partsReplacement,
                      [item.key]: e.target.checked,
                    })
                  }
                />
                {item.label}
              </Label>
              {(partsReplacement[
                item.key as keyof PartsReplacement
              ] as boolean) && (
                <div className="w-40">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      ₱
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={
                        partsAmounts[item.key as keyof PartsAmountsType] || ""
                      }
                      onChange={(e) =>
                        handlePartsAmountChange(
                          item.key as keyof PartsAmountsType,
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

        {/* Others field for parts */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Label onCheck>
              <Input
                type="checkbox"
                checked={partsReplacement.partsOthers}
                onChange={(e) =>
                  setPartsReplacement({
                    ...partsReplacement,
                    partsOthers: e.target.checked,
                  })
                }
              />
              Others
            </Label>
            {partsReplacement.partsOthers && (
              <Input
                type="text"
                value={partsReplacement.partsOthersText || ""}
                onChange={(e) =>
                  setPartsReplacement({
                    ...partsReplacement,
                    partsOthersText: e.target.value,
                  })
                }
                placeholder="Specify"
                className="flex-1"
                required
              />
            )}
          </div>
          {partsReplacement.partsOthers && (
            <div className="w-40">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  ₱
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={partsAmounts.partsOthers || ""}
                  onChange={(e) =>
                    handlePartsAmountChange(
                      "partsOthers",
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

        {/* Total section for parts */}
        {(Object.values(partsReplacement).some((val) => val === true) ||
          partsTotal > 0) && (
          <div className="pt-4 mt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">PARTS TOTAL:</span>
              <span className="font-bold text-blue-700">
                {phpCurrency(partsTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
