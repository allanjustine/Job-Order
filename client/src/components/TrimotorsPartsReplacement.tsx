// components/PartsReplacement.tsx
import Input from "./ui/input";
import { Label } from "./ui/label";
import phpCurrency from "@/utils/phpCurrency";
import { PartsAmountsType, TrimotorsPartsReplacement, TrimotorsPartsBrand, TrimotorsPartsNumber, TrimotorsPartsQuantity, TrimotorsPartsOthersItem, TrimotorsPartsAmountsType } from "@/types/jobOrderFormType";
import { trimotorsPartsItems } from "@/constants/trimotors-part-items";
import { useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";

interface TrimotorsPartsReplacementSectionProps {
  partsReplacement: TrimotorsPartsReplacement;
  setPartsReplacement: React.Dispatch<React.SetStateAction<TrimotorsPartsReplacement>>;
  partsAmounts: PartsAmountsType;
  handlePartsAmountChange: (key: keyof PartsAmountsType, value: number) => void;
  partsTotal: number;
  setPartsTotal?: (total: number) => void; 
  partsBrand: TrimotorsPartsBrand;
  setPartsBrand: React.Dispatch<React.SetStateAction<TrimotorsPartsBrand>>;
  partsNumber: TrimotorsPartsNumber;
  setPartsNumber: React.Dispatch<React.SetStateAction<TrimotorsPartsNumber>>;
  partsQuantity: TrimotorsPartsQuantity;
  setPartsQuantity: React.Dispatch<React.SetStateAction<TrimotorsPartsQuantity>>;
}
  
// Brand options
const brandChoices = ["Bajaj"," BG Powerstroke"];

export default function TrimotorsPartsReplacementSection({
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
}: TrimotorsPartsReplacementSectionProps) {
  
  // Get parts others items
  const partsOthersItems: TrimotorsPartsOthersItem[] = partsReplacement.partsOthersItems || [];
  
  // Calculate total whenever relevant data changes
  useEffect(() => {
    calculateAndUpdateTotal();
  }, [partsReplacement, partsAmounts, partsQuantity, partsOthersItems]);

const calculateAndUpdateTotal = useCallback(() => {
  let total = 0;
  
  // Calculate for each regular part item
  trimotorsPartsItems.forEach(item => {
    const key = item.key;
    if (key !== "partsOthers") {
      if (partsReplacement[key as keyof TrimotorsPartsReplacement]) {
        const quantity = partsQuantity[key as keyof TrimotorsPartsQuantity] || 0;
        const amount = partsAmounts[key as keyof TrimotorsPartsAmountsType] || 0;
        total += quantity * amount;
      }
    }
  });
  
  // Calculate for multiple "Others" 
  if (partsReplacement.partsOthers && partsOthersItems.length > 0) {
    partsOthersItems.forEach(item => {
      total += item.amount || 0;  // Direct amount na lang
    });
  }
  
  // Update parent if function provided
  if (setPartsTotal) {
    setPartsTotal(total);
  }
}, [partsReplacement, partsAmounts, partsQuantity, partsOthersItems, setPartsTotal]);

  const handleBrandChange = (key: keyof TrimotorsPartsBrand, value: string) => {
    setPartsBrand(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePartNumberChange = (key: keyof TrimotorsPartsNumber, value: string) => {
    setPartsNumber(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQuantityChange = (key: keyof TrimotorsPartsQuantity, value: number) => {
    setPartsQuantity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Wrapper for amount change to ensure total updates
  const handleAmountChangeWithTotal = (key: keyof PartsAmountsType, value: number) => {
    handlePartsAmountChange(key, value);
  };

  // Map partsItems keys to their corresponding type keys
  const getBrandKey = (itemKey: string): keyof TrimotorsPartsBrand => {
    if (itemKey === "partsOthers") return "partsOthers";
    return itemKey as keyof TrimotorsPartsBrand;
  };

  const getPartNumberKey = (itemKey: string): keyof TrimotorsPartsNumber => {
    if (itemKey === "partsOthers") return "partsOthers";
    return itemKey as keyof TrimotorsPartsNumber;
  };
  
  const getQuantityKey = (itemKey: string): keyof TrimotorsPartsQuantity => {
    if (itemKey === "partsOthers") return "partsOthers";
    return itemKey as keyof TrimotorsPartsQuantity;
  };

  // Parts Others functions
  const addPartsOthersItem = () => {
    const newItem: TrimotorsPartsOthersItem = {
      id: Date.now().toString(),
      description: "",
      brand: "",
      partNumber: "",
      quantity: 1,
      amount: 0,
    };
    const updatedItems = [...partsOthersItems, newItem];
    setPartsReplacement({
      ...partsReplacement,
      partsOthers: true,
      partsOthersItems: updatedItems,
    });
  };

  const removePartsOthersItem = (id: string) => {
    const updatedItems = partsOthersItems.filter(item => item.id !== id);
    setPartsReplacement({
      ...partsReplacement,
      partsOthersItems: updatedItems,
      partsOthers: updatedItems.length > 0,
    });
  };

  const updatePartsOthersDescription = (id: string, description: string) => {
    const updatedItems = partsOthersItems.map(item =>
      item.id === id ? { ...item, description } : item
    );
    setPartsReplacement({
      ...partsReplacement,
      partsOthersItems: updatedItems,
    });
  };

  const updatePartsOthersBrand = (id: string, brand: string) => {
    const updatedItems = partsOthersItems.map(item =>
      item.id === id ? { ...item, brand } : item
    );
    setPartsReplacement({
      ...partsReplacement,
      partsOthersItems: updatedItems,
    });
  };

  const updatePartsOthersPartNumber = (id: string, partNumber: string) => {
    const updatedItems = partsOthersItems.map(item =>
      item.id === id ? { ...item, partNumber } : item
    );
    setPartsReplacement({
      ...partsReplacement,
      partsOthersItems: updatedItems,
    });
  };

  const updatePartsOthersQuantity = (id: string, quantity: number) => {
    const updatedItems = partsOthersItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setPartsReplacement({
      ...partsReplacement,
      partsOthersItems: updatedItems,
    });
    // Total will be recalculated by useEffect
  };

  const updatePartsOthersAmount = (id: string, amount: number) => {
  const updatedItems = partsOthersItems.map(item =>
    item.id === id ? { ...item, amount } : item
  );
  setPartsReplacement({
    ...partsReplacement,
    partsOthersItems: updatedItems,
  });
  
  // Total ay sum ng amount lang, hindi na quantity * amount
  const totalOthersAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
  handlePartsAmountChange("partsOthers", totalOthersAmount);
};

  // Toggle parts others checkbox
  const togglePartsOthers = (checked: boolean) => {
    if (checked) {
      if (partsOthersItems.length === 0) {
        const newItem: TrimotorsPartsOthersItem = {
          id: Date.now().toString(),
          description: "",
          brand: "",
          partNumber: "",
          quantity: 1,
          amount: 0,
        };
        setPartsReplacement({
          ...partsReplacement,
          partsOthers: true,
          partsOthersItems: [newItem],
        });
      } else {
        setPartsReplacement({
          ...partsReplacement,
          partsOthers: true,
        });
      }
    } else {
      setPartsReplacement({
        ...partsReplacement,
        partsOthers: false,
        partsOthersItems: [],
      });
      handlePartsAmountChange("partsOthers", 0);
    }
  };

  // Split parts items into two columns
  const regularPartsItems = trimotorsPartsItems.filter((item) => item.key !== "partsOthers");
  const midpoint = Math.ceil(regularPartsItems.length / 2);
  const firstColumnParts = regularPartsItems.slice(0, midpoint);
  const secondColumnParts = regularPartsItems.slice(midpoint);

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-semibold mb-3 text-blue-700 text-center">
        PARTS USED
      </h3>
      <div className="space-y-2">
        {/* Two-column layout for regular part items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Column */}
          <div className="space-y-3">
            {firstColumnParts.map((item) => {
              const brandKey = getBrandKey(item.key);
              const partNumberKey = getPartNumberKey(item.key);
              const quantityKey = getQuantityKey(item.key);
              
              return (
                <div
                  key={item.key}
                  className="flex items-start gap-2 text-sm w-full"
                >
                  <div className="flex items-start gap-2 flex-1 flex-wrap">
                    <Label className="whitespace-nowrap min-w-20">
                      <Input
                        type="checkbox"
                        checked={
                          partsReplacement[
                            item.key as keyof TrimotorsPartsReplacement
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
                            handlePartNumberChange(partNumberKey, "");
                            handleQuantityChange(quantityKey, 1);
                            handleAmountChangeWithTotal(item.key as keyof PartsAmountsType, 0);
                          }
                        }}
                      />
                      {item.label}
                    </Label>
                    
                    {(partsReplacement[
                      item.key as keyof TrimotorsPartsReplacement
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
                              type="text"
                              placeholder="Part No."
                              value={partsNumber[partNumberKey] || ""}
                              onChange={(e) => handlePartNumberChange(partNumberKey, e.target.value)}
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
          </div>

          {/* Second Column */}
          <div className="space-y-3">
            {secondColumnParts.map((item) => {
              const brandKey = getBrandKey(item.key);
              const partNumberKey = getPartNumberKey(item.key);
              const quantityKey = getQuantityKey(item.key);
              
              return (
                <div
                  key={item.key}
                  className="flex items-start gap-2 text-sm w-full"
                >
                  <div className="flex items-start gap-2 flex-1 flex-wrap">
                    <Label className="whitespace-nowrap min-w-20">
                      <Input
                        type="checkbox"
                        checked={
                          partsReplacement[
                            item.key as keyof TrimotorsPartsReplacement
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
                            handlePartNumberChange(partNumberKey, "");
                            handleQuantityChange(quantityKey, 1);
                            handleAmountChangeWithTotal(item.key as keyof PartsAmountsType, 0);
                          }
                        }}
                      />
                      {item.label}
                    </Label>
                    
                    {(partsReplacement[
                      item.key as keyof TrimotorsPartsReplacement
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
                              type="text"
                              placeholder="Part No."
                              value={partsNumber[partNumberKey] || ""}
                              onChange={(e) => handlePartNumberChange(partNumberKey,e.target.value)}
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
          </div>
        </div>

        {/* Multiple Parts Others Fields */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 font-semibold text-gray-700">
              <Input
                type="checkbox"
                checked={partsReplacement.partsOthers}
                onChange={(e) => togglePartsOthers(e.target.checked)}
              />
              Others (Custom Parts)
            </Label>
            {partsReplacement.partsOthers && (
              <Button
                type="button"
                onClick={addPartsOthersItem}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Part
              </Button>
            )}
          </div>
          
          {partsReplacement.partsOthers && partsOthersItems.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4 border border-dashed border-gray-300 rounded-md">
              No custom parts added. Click "Add Part" to add.
            </div>
          ) : (
            partsReplacement.partsOthers && partsOthersItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-md">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => updatePartsOthersDescription(item.id, e.target.value)}
                      placeholder="Enter part description"
                      className="w-80"
                    />
                    
                    {/* Brand Dropdown */}
                    <select
                      value={item.brand || ""}
                      onChange={(e) => updatePartsOthersBrand(item.id, e.target.value)}
                      className="w-28 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select Brand</option>
                      {brandChoices.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>

                    {/* Part Number Field */}
                    {item.brand && (
                      <>
                        <Input
                          type="text"
                          placeholder="Part No."
                          value={item.partNumber || ""}
                          onChange={(e) => updatePartsOthersPartNumber(item.id, e.target.value)}
                          className="w-30 text-center"
                        />
                        
                        {/* Quantity Field */}
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => updatePartsOthersQuantity(item.id, Number(e.target.value))}
                            className="w-16 text-center"
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
                              value={item.amount || ""}
                              onChange={(e) => updatePartsOthersAmount(item.id, Number(e.target.value))}
                              min="0"
                              step="0.01"
                              className="pl-8 pr-3 text-right"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => removePartsOthersItem(item.id)}
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

        {/* Total section for parts */}
        {(Object.values(partsReplacement).some((val) => val === true) ||
          partsTotal > 0 ||
          partsOthersItems.length > 0) && (
          <div className="pt-4 mt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">PARTS TOTAL:</span>
              <span className="font-bold text-green-700">
                {phpCurrency(partsTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}