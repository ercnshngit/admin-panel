"use client";

import BaseForm from "@/components/base-form";
import { useLanguage } from "@/contexts/language-context";
import useSearchParams from "@/hooks/use-search-params";
import { queryClient } from "@/libs/react-query";
import { updateTableItem } from "@/services/common-table-api";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { UPDATE_TABLE_ITEM } from "@/types/common-table-api";
import {
  UpdateDataLanguage,
  useDataLanguageMutation,
} from "@/utils/use-data-language";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function UpdateFormBase({
  table,
  id,
  config,
  customUpdateMutation,
  goBackUrl,
}: {
  table: DatabaseTableDto;
  customUpdateMutation?: UseMutationResult<any, unknown, {}, unknown>;
  id: number;
  config?: {
    show?: string[];
    hidden?: string[];
    readonly?: string[];
    defaultValues?: { [key: string]: any };
  };
  goBackUrl?: string;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<any>();

  const searchParams = useSearchParams();

  const router = useRouter();
  const updateMutation = useMutation(
    (data: UPDATE_TABLE_ITEM) =>
      updateTableItem({
        tableName: table.name!,
        id: id,
        data: Object.entries(data)
          .map(([key, value]) =>
            value === ""
              ? {
                  key,
                  value: null,
                }
              : {
                  key,
                  value,
                }
          )
          .filter((item) => item !== null),
      }),
    {
      onSuccess: async (data) => {
        if (table.can_translate) {
          dataLanguageMutation.mutate({
            data_group: table.display_column?.name
              ? data?.[table.display_column.name] || data?.title || data?.name
              : data.id,
            data_id: data?.id as number,
            language_code: language,
          });
        }
        await queryClient.invalidateQueries({
          queryKey: [table.name, table.name + "/" + id],
        });
        toast.success("Kayıt başarıyla güncellendi");

        router.push(
          goBackUrl === null || goBackUrl === undefined || goBackUrl === ""
            ? "/dashboard/" +
                table.name +
                "/" +
                searchParams.createSearchParamsForUrlWithoutGoBackUrl()
            : goBackUrl
        );
      },
      onError: (error) => {
        console.log("error", error);
        toast.error("Kayıt güncellenirken bir hata oluştu");
      },
    }
  );
  const { language } = useLanguage();

  const { dataLanguageMutation } = useDataLanguageMutation({
    table_name: table.name,
  });

  const updateRelationMutation = useMutation(
    (data: UPDATE_TABLE_ITEM) =>
      updateTableItem({
        tableName: data.tableName,
        id: data.id,
        data: Object.entries(data).map(([key, value]) => ({ key, value })),
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [table.name],
        });
        toast.success("Kayıt başarıyla güncellendi");
        console.log("güncellendi");
      },
    }
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    if (
      table?.columns?.some((column) => column.input_type?.name === "relation")
    ) {
      console.log("adasdas");
      const relationData = Object.keys(data).filter(
        (key: any) => key.split("/")[0] === "relation"
      );

      // relationData.forEach((relation) => {
      //   const relationTableName = relation.split("/")[1];
      //   const relationTableItemId = Number(relation.split("/")[2]);
      //   const relationTableData = data[relation];
      //   const relationTableColumnName = relation.split("/")[3];
      //   updateRelationMutation.mutate({
      //     tableName: relationTableName,
      //     id: relationTableItemId,
      //     data: { [relationTableColumnName]: relationTableData },
      //   });
      // });
      const otherData = Object.keys(data).filter(
        (key) => key.split("/")[0] !== "relation"
      );
      const fullData: UPDATE_TABLE_ITEM = {} as UPDATE_TABLE_ITEM;
      otherData.forEach((key) => {
        // @ts-ignore
        fullData[key] = data[key];
      });
      updateMutation.mutate(fullData);
    } else {
      console.log("adasdas");
      if (customUpdateMutation) {
        customUpdateMutation.mutate(data);
        reset();
      } else {
        updateMutation.mutate(data);
      }
    }
  };

  return (
    <>
      <BaseForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        table={table}
        errors={errors}
        register={register}
        formType="update_crud_option"
        id={Number(id)}
        setValue={setValue}
      />
    </>
  );
}
