"use client";

import React, { Dispatch, SetStateAction } from "react";
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

export function DealersNamesDropdown({
  dealersNames,
  onChange,
  dealerName,
  inputError,
}: {
  dealersNames: any;
  onChange: Dispatch<SetStateAction<string>>;
  dealerName?: any;
  inputError?: string;
  isRequired?: boolean;
}) {
  const anchor = useComboboxAnchor();

  return (
    <div className="w-full flex flex-col">
      <Combobox
        autoHighlight
        items={dealersNames}
        onValueChange={onChange}
        value={dealerName}
      >
        <ComboboxChips
          ref={anchor}
          className={`w-full ${inputError ? "border-red-500" : "border-gray-300"} border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        >
          <ComboboxValue>
            <React.Fragment>
              <ComboboxChipsInput
                placeholder="Dealers Name"
                onChange={(e) => onChange(e.target.value)}
              />
            </React.Fragment>
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor} className="w-fit">
          <ComboboxEmpty>No dealers found.</ComboboxEmpty>
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
    </div>
  );
}
