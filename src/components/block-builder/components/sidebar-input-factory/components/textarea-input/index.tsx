import { cn } from "@/libs/utils";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { ComponentPropDto } from "@/services/dto/prop.dto";
import React from "react";

export default function TextAreaInput({
  propKey,
  value,
  setValue,
  className,
  ...rest
}: {
  propKey: string;
  value: any;
  setValue: any;
  className?: string;
}) {
  return (
    <textarea
      className={cn(
        "w-full p-2 border border-gray-300 text-black rounded-md",
        className
      )}
      id={propKey}
      defaultValue={value}
      onChange={(e) => setValue(e.target.value)}
      {...rest}
    />
  );
}
