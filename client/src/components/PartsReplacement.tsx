import Input from "./ui/input";
import Label from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import { PartsAmountsType, PartsReplacement, PartsBrand, PartsNumber, PartsQuantity } from "@/types/jobOrderFormType";
import { partsItems } from "@/constants/part-items";
import { useEffect, useCallback } from "react";

interface PartsReplacementSectionProps {
  partsReplacement: PartsReplacement;
  setPartsReplacement: React.Dispatch<React.SetStateAction<PartsReplacement>>;
  partsAmounts: PartsAmountsType;
  handlePartsAmountChange: (key: keyof PartsAmountsType, value: number) => void;
  partsTotal: number;
  setPartsTotal?: (total: number) => void; 
  partsBrand: PartsBrand;
  setPartsBrand: React.Dispatch<React.SetStateAction<PartsBrand>>;
  partsNumber: PartsNumber;
  setPartsNumber: React.Dispatch<React.SetStateAction<PartsNumber>>;
  partsQuantity: PartsQuantity;
  setPartsQuantity: React.Dispatch<React.SetStateAction<PartsQuantity>>;
}

// Brand options
const brandChoices = ["Honda", "Yamaha", "Kawasaki", "Suzuki", "Bajaj", "Hatatsu"];

export default function PartsReplacementSection({
  partsReplacement,
  setPartsReplacement,
  partsAmounts,
  handlePartsAmountChange,
  partsTotal,
  setPartsTotal,
  partsBrand,
  setPartsBrand,
  partsNumber,
  setPartsNumber,
  partsQuantity, 
  setPartsQuantity, 
}: PartsReplacementSectionProps) {
  
  // Calculate total whenever relevant data changes
  useEffect(() => {
    calculateAndUpdateTotal();
  }, [partsReplacement, partsAmounts, partsQuantity]);

  const calculateAndUpdateTotal = useCallback(() => {
    let total = 0;
    
    // Calculate for each part item
    partsItems.forEach(item => {
      const key = item.key;
      if (key !== "partsOthers") {
        if (partsReplacement[key as keyof PartsReplacement]) {
          const quantity = partsQuantity[key as keyof PartsQuantity] || 0;
          const amount = partsAmounts[key as keyof PartsAmountsType] || 0;
          total += quantity * amount;
        }
      }
    });
    
    // Calculate for "Others" if checked
    if (partsReplacement.partsOthers) {
      const quantity = partsQuantity.partsOthers || 0;
      const amount = partsAmounts.partsOthers || 0;
      total += quantity * amount;
    }
    
    // Update parent if function provided
    if (setPartsTotal) {
      setPartsTotal(total);
    }
  }, [partsReplacement, partsAmounts, partsQuantity, setPartsTotal]);

  const handleBrandChange = (key: keyof PartsBrand, value: string) => {
    setPartsBrand(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePartNumberChange = (key: keyof PartsNumber, value: number) => {
    setPartsNumber(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleQuantityChange = (key: keyof PartsQuantity, value: number) => {
    setPartsQuantity(prev => ({
      ...prev,
      [key]: value
    }));
    // Total will be recalculated by useEffect
  };

  // Wrapper for amount change to ensure total updates
  const handleAmountChangeWithTotal = (key: keyof PartsAmountsType, value: number) => {
    handlePartsAmountChange(key, value);
  };

  // Map partsItems keys to their corresponding type keys
  const getBrandKey = (itemKey: string): keyof PartsBrand => {
    if (itemKey === "partsOthers") return "partsOthers";
    return itemKey as keyof PartsBrand;
  };

  const getPartNumberKey = (itemKey: string): keyof PartsNumber => {
    if (itemKey === "partsOthers") return "partsOthers";
    return itemKey as keyof PartsNumber;
  };
  
  const getQuantityKey = (itemKey: string): keyof PartsQuantity => {
    if (itemKey === "partsOthers") return "partsOthers";
    return itemKey as keyof PartsQuantity;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-semibold mb-3 text-blue-700 text-center">
        PARTS USED
      </h3>
      <div className="space-y-2">
        {partsItems
          .filter((item) => item.key !== "partsOthers")
          .map((item) => {
            const brandKey = getBrandKey(item.key);
            const partNumberKey = getPartNumberKey(item.key);
            const quantityKey = getQuantityKey(item.key);
            
            return (
              <div
                key={item.key}
                className="flex items-center gap-4 text-sm"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Label onCheck className="whitespace-nowrap">
                    <Input
                      type="checkbox"
                      checked={
                        partsReplacement[
                          item.key as keyof PartsReplacement
                        ] as boolean
                      }
                      onChange={(e) => {
                        setPartsReplacement({
                          ...partsReplacement,
                          [item.key]: e.target.checked,
                        });
                        // Reset brand, part number, quantity, and amount when unchecked
                        if (!e.target.checked) {
                          handleBrandChange(brandKey, "");
                          handlePartNumberChange(partNumberKey, 0);
                          handleQuantityChange(quantityKey, 1);
                          handleAmountChangeWithTotal(item.key as keyof PartsAmountsType, 0);
                        }
                      }}
                    />
                    {item.label}
                  </Label>
                  
                  {(partsReplacement[
                    item.key as keyof PartsReplacement
                  ] as boolean) && (
                    <>
                      {/* Brand Dropdown */}
                      <select
                        value={partsBrand[brandKey] || ""}
                        onChange={(e) => handleBrandChange(brandKey, e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>Select Brand</option>
                        {brandChoices.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>

                      {/* Part Number Field - shows when brand is selected */}
                      {partsBrand[brandKey] && (
                        <>
                          <Input
                            type="number"
                            placeholder="Part No."
                            value={partsNumber[partNumberKey] || ""}
                            onChange={(e) => handlePartNumberChange(partNumberKey, Number(e.target.value))}
                            className="w-28 text-center"
                            required
                          />
                          
                          {/* Quantity Field */}
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Qty:</span>
                            <Input
                              type="number"
                              min="1"
                              value={partsQuantity[quantityKey] || 1}
                              onChange={(e) => handleQuantityChange(quantityKey, Number(e.target.value))}
                              className="w-16 text-center"
                              required
                            />
                          </div>

                          {/* Unit Price Field */}
                          <div className="w-32">
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
                                  handleAmountChangeWithTotal(
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
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

        {/* Others field for parts */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Label onCheck className="whitespace-nowrap">
              <Input
                type="checkbox"
                checked={partsReplacement.partsOthers}
                onChange={(e) => {
                  setPartsReplacement({
                    ...partsReplacement,
                    partsOthers: e.target.checked,
                  });
                  // Reset brand, part number, quantity, and amount when unchecked
                  if (!e.target.checked) {
                    handleBrandChange("partsOthers", "");
                    handlePartNumberChange("partsOthers", 0);
                    handleQuantityChange("partsOthers", 1);
                    handleAmountChangeWithTotal("partsOthers", 0);
                  }
                }}
              />
              Others
            </Label>
            
            {partsReplacement.partsOthers && (
              <>
                {/* Description input for Others */}
                <Input
                  type="text"
                  value={partsReplacement.partsOthersText || ""}
                  onChange={(e) =>
                    setPartsReplacement({
                      ...partsReplacement,
                      partsOthersText: e.target.value,
                    })
                  }
                  placeholder="Specify part"
                  className="w-28"
                  required
                />

                {/* Brand Dropdown for Others */}
                <select
                  value={partsBrand.partsOthers || ""}
                  onChange={(e) => handleBrandChange("partsOthers", e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Brand</option>
                  {brandChoices.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                {/* Part Number Field for Others - shows when brand is selected */}
                {partsBrand.partsOthers && (
                  <>
                    <Input
                      type="number"
                      placeholder="Part No."
                      value={partsNumber.partsOthers || ""}
                      onChange={(e) => handlePartNumberChange("partsOthers", Number(e.target.value))}
                      className="w-28 text-center"
                      required
                    />
                    
                    {/* Quantity Field for Others */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <Input
                        type="number"
                        min="1"
                        value={partsQuantity.partsOthers || 1}
                        onChange={(e) => handleQuantityChange("partsOthers", Number(e.target.value))}
                        className="w-16 text-center"
                        required
                      />
                    </div>

                    {/* Unit Price Field for Others */}
                    <div className="w-32">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                          ₱
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={partsAmounts.partsOthers || ""}
                          onChange={(e) =>
                            handleAmountChangeWithTotal(
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
                  </>
                )}
              </>
            )}
          </div>
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
