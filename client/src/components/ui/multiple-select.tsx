import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Dispatch, SetStateAction } from "react";
import { UserData } from "@/app/admin/components/target-income/add-target-income";

export function MultipleSelect({
  value,
  setValue,
  userLists,
  ...props
}: {
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
  userLists: UserData[];
  placeholder?: string;
}) {
  const foundItem = (item: string) => {
    const chip = userLists.find((user) => String(user.id) === item);

    return `(${chip?.code}) ${chip?.name}`;
  };

  return (
    <Combobox
      items={userLists}
      multiple
      value={value}
      onValueChange={(e) => setValue(e.map((item) => String(item)))}
    >
      <ComboboxChips>
        <ComboboxTrigger className="h-9" />
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{foundItem(item)}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput {...props} />
      </ComboboxChips>
      <ComboboxContent className="w-full">
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item.id}>
              {`(${item.code}) ${item.name}`}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
