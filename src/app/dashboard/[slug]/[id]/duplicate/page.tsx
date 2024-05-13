"use client";
import UpdateFormBase from "@/components/base-form/update-form-base";
import UpdatePage from "@/components/dynamic-crud-layouts/update-page";
import { useTable } from "@/hooks/use-database";
import useSearchParams from "@/hooks/use-search-params";
import { createTableItem } from "@/services/common-table-api";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { useDataLanguageMutation } from "@/utils/use-data-language";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Update({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const { id, slug } = params;
  const { table } = useTable(slug);
  const tableName = table?.name || "";

  const { dataLanguageMutation } = useDataLanguageMutation({
    table_name: tableName,
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const createMutation = useMutation(
    (data: {}) =>
      createTableItem({
        tableName: tableName,
        data: Object.entries({ ...data, id: undefined })
          .map(([key, value]) =>
            value === ""
              ? null
              : {
                  key,
                  value,
                }
          )
          .filter((item) => item !== null),
      }),
    {
      onSuccess: (data) => {
        if (table?.can_translate) {
          dataLanguageMutation.mutate({
            data_group: table.display_column?.name
              ? data.data?.[table.display_column.name] ||
                data.data?.title ||
                data.data?.name
              : data.data.id,
            data_id: data.data?.id as number,
          });
        }
        queryClient.invalidateQueries([tableName]);
        toast.success("Kayıt başarıyla oluşturuldu");
        router.push(`/dashboard/${slug}`);
      },
      onError: (error) => {
        //@ts-ignore
        toast.error(error.message);
      },
    }
  );
  const searchParams = useSearchParams();
  const goBackUrl = searchParams.getQueryString("goBackUrl") || undefined;

  return (
    <UpdatePage id={id} tableName={tableName} goBackUrl={goBackUrl}>
      <UpdateFormBase
        id={Number(id)}
        table={table as DatabaseTableDto}
        customUpdateMutation={createMutation}
      />
    </UpdatePage>
  );
}
