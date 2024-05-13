import { CaretSortIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/libs/utils";
import { useState } from "react";
export default function BlocksDropdown({
  blocks,
  setValue,
}: {
  blocks: {
    label: string;
    value: string;
    type_id: number;
    type_name: string;
  }[];
  setValue: (value: string, type_id: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full justify-between")}
        >
          Select block
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup className=" h-60 overflow-y-scroll">
            {blocks.map((block) => (
              <CommandItem
                value={block.label}
                key={block.value}
                onSelect={() => {
                  setOpen(false);
                  setValue(block.value, block.type_id);
                }}
              >
                {block.label}
                <span className="ml-2 font-bold text-sm">
                  {block.type_name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
