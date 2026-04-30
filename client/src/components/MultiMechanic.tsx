"use client";

import React, { SetStateAction } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./ui/combobox";

export function MultiMechanic({
  mechanics,
  setMechanic,
  mechanic,
}: {
  mechanics: any;
  setMechanic: React.Dispatch<SetStateAction<any>>;
  mechanic: any;
}) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      multiple
      autoHighlight
      items={mechanics}
      onValueChange={setMechanic}
      value={mechanic}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {(items) => (
            <React.Fragment>
              {mechanics
                .filter((mechanic: any) => items.includes(mechanic.id))
                .map((mechanic: any) => (
                  <ComboboxChip key={mechanic.id}>
                    {mechanic?.name}
                  </ComboboxChip>
                ))}
              <ComboboxChipsInput />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No mechanics found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item.id}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
