import useSearchParams from "@/hooks/use-search-params";
import { useTranslate } from "@/langs";
import { getTableItem } from "@/services/common-table-api";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormInputFactory from "./form-input-factory";

export default function BaseForm(props: {
  handleSubmit: any;
  onSubmit: any;
  table: DatabaseTableDto;
  errors: FieldErrors;
  register: UseFormRegister<any>;
  formType: "create_crud_option" | "update_crud_option";
  id?: number;
  setValue: any;
  watch?: any;
  control: any;
  onSubmitAndGoBack?: any;
  customInput?: {
    for: string;
    component: React.FC<any>;
  }[];
  config?: {
    show?: string[];
    hidden?: string[];
    readonly?: string[];
    defaultValues?: { [key: string]: any };
  };
}) {
  const { translate } = useTranslate();

  const {
    handleSubmit,
    onSubmit,
    onSubmitAndGoBack,
    table,
    errors,
    register,
    formType,
    id,
    setValue,
    customInput,
    watch,
    control,
    config,
  } = props;

  const { data, error } = useQuery(
    [table.name + "/" + id],
    () => getTableItem({ tableName: table.name, id: Number(id) }),
    {
      enabled: formType === "update_crud_option" && !!id,
      suspense: true,
    }
  );
  const searchParams = useSearchParams();
  const allParams = searchParams.getAllQueryString();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap w-full gap-4"
    >
      {table?.columns &&
        table.columns
          .filter((field) => (field.is_hidden ? false : true))
          .filter((field) => {
            if (config?.show) {
              return config.show.includes(field.name);
            }
            if (config?.hidden) {
              return !config.hidden.includes(field.name);
            }
            return true;
          })
          .map((field) => (
            <FormInputFactory
              key={field.name}
              formType={formType}
              errors={errors}
              field={field}
              register={register}
              table={table}
              id={id}
              watch={watch}
              setValue={(value) => setValue(field.name, value)}
              customInput={customInput}
              control={control}
              readOnly={config?.readonly?.includes(field.name)}
              {...(config?.defaultValues
                ? { defaultValue: config.defaultValues[field.name] }
                : formType === "update_crud_option"
                ? {
                    defaultValue: data?.[0]?.[field.name] || "",
                  }
                : { defaultValue: allParams[field.name] || "" })}
            />
          ))}

      <button
        type="submit"
        className="w-full px-2 py-1 text-white bg-blue-500 rounded-md"
      >
        {translate("FORM_SUBMIT_" + formType?.toUpperCase())}
      </button>
      {onSubmitAndGoBack && (
        <button
          type="button"
          onClick={handleSubmit(onSubmitAndGoBack)}
          className="w-full px-2 py-1 text-white bg-blue-500 rounded-md"
        >
          {translate("FORM_SUBMIT_" + formType?.toUpperCase() + "_AND_GO_BACK")}
        </button>
      )}
    </form>
  );
}
