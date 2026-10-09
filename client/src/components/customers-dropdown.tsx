"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
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

export function CustomersDropdown({
  customers,
  setCustomerName,
  setContact,
  setAddress,
  customer,
  inputError,
}: {
  customers: any;
  setCustomerName: Dispatch<SetStateAction<string>>;
  setContact: Dispatch<SetStateAction<string>>;
  setAddress: Dispatch<SetStateAction<string>>;
  customer?: any;
  inputError?: string;
}) {
  const anchor = useComboboxAnchor();

  const MEM_CUST = useMemo(() => {
    return customers.map((item: any) => item);
  }, [customers]);

  useEffect(() => {
    const selectedCustomer = MEM_CUST.find(
      (item: any) => item.name === customer,
    );

    if (!selectedCustomer) {
      setContact("");
      setAddress("");
    }
  }, [customer, MEM_CUST]);

  const handleChange = useCallback(
    (value: string) => {
      const selectedCustomer = MEM_CUST.find(
        (item: any) => item.name === value,
      );
      setCustomerName(selectedCustomer?.name || "");
      setContact(selectedCustomer?.contact_number || "");
      setAddress(selectedCustomer?.address || "");
    },
    [MEM_CUST, setCustomerName, setContact, setAddress],
  );

  return (
    <div className="flex flex-col w-full">
      <Combobox
        autoHighlight
        items={MEM_CUST}
        onValueChange={handleChange}
        value={customer}
      >
        <ComboboxChips
          ref={anchor}
          className={`w-full ${inputError ? "border-red-500" : "border-gray-300"} border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        >
          <ComboboxValue>
            <React.Fragment>
              <ComboboxChipsInput
                placeholder="Enter customer name"
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </React.Fragment>
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor} className="w-fit">
          <ComboboxEmpty>No customers found.</ComboboxEmpty>
          <ComboboxList>
            {(item, index) => (
              <ComboboxItem key={index} value={item.name}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {inputError && <p className="text-red-500 text-xs mt-1">{inputError}</p>}
    </div>
  );
}
