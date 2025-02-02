import { ReactQuillWrapper } from "@/libs/react-quill";
import { DataBaseTableColumnDto } from "@/services/dto/database-table-column.dto";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import Label from "../Label";
import { useEffect } from "react";

const RichTextBox = ({
  field,
  table,
  register,
  errors,
  control,
  defaultValue,
  setValue,
  ...props
}: {
  field: DataBaseTableColumnDto;
  table: DatabaseTableDto;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  defaultValue?: any;
  setValue: (value: any) => void;
  control: any;
}) => {
  useEffect(() => {
    console.log("defaultValue", defaultValue);
    defaultValue && setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="flex flex-col w-full gap-2 pb-4 border-b border-gray-200">
      <Label field={field} table={table} />

      <Controller
        name={field.name}
        control={control}
        render={({ field }) => (
          <div className="min-h-[400px] ">
            <ReactQuillWrapper value={field.value} setValue={field.onChange} />
          </div>
        )}
      />
      {errors[field.name] && <span>Bu alan gereklidir</span>}
    </div>
  );
};

export default RichTextBox;
