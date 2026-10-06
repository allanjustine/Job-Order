"use client";

import React, { SetStateAction } from "react";

import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./ui/combobox";
import { PartsNumber, TrimotorsPartsNumber } from "@/types/jobOrderFormType";

export function PartNumbersDropdown({
  partNumbers,
  handlePartNumberChange,
  partNumber,
  partNumberKey,
  inputError,
  isRequired = false,
}: {
  partNumbers: any;
  handlePartNumberChange: (
    key: keyof PartsNumber | keyof TrimotorsPartsNumber,
    value: string,
  ) => void;
  partNumber?: any;
  partNumberKey: keyof PartsNumber | keyof TrimotorsPartsNumber;
  inputError?: string;
  isRequired?: boolean;
}) {
  const anchor = useComboboxAnchor();

  return (
    <>
      <Combobox
        autoHighlight
        items={partNumbers}
        onValueChange={(value) => handlePartNumberChange(partNumberKey, value)}
        value={partNumber}
      >
        <ComboboxChips
          ref={anchor}
          className={`w-28 ${inputError ? "border-red-500" : "border-gray-300"} border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        >
          <ComboboxValue>
            <React.Fragment>
              <ComboboxChipsInput
                required={isRequired}
                placeholder="Part No."
                onChange={(e) =>
                  handlePartNumberChange(partNumberKey, e.target.value)
                }
              />
            </React.Fragment>
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor} className="w-fit">
          <ComboboxEmpty>No part numbers found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {inputError && <p className="text-red-500 text-xs mt-1">{inputError}</p>}
    </>
  );
}
