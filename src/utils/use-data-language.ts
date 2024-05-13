import { useLanguage } from "@/contexts/language-context";
import {
  createDataLanguage,
  getDataLanguagesByTable,
  getTable,
  getTableConfig,
} from "@/services/dashboard";
import { DataLanguageDto } from "@/services/dto/data_language.dto";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type UpdateDataLanguage = {
  language_code?: string;
  data_id: number;
  data_group: string;
  from_data_id?: number;
  from_data_language_code?: string;
};

export function useDataLanguageMutation({
  table_name,
}: {
  table_name: string;
}) {
  const table = useQuery(["database_table", table_name], () =>
    getTableConfig({ table_name })
  );

  const { language } = useLanguage();

  const queryClient = useQueryClient();

  const dataLanguageMutation = useMutation({
    mutationFn: (data: UpdateDataLanguage) =>
      createDataLanguage({
        language_code: data?.language_code || language,
        database_table_id: table.data?.id || 0,
        data_id: data.data_id,
        data_group: data?.data_group ? String(data.data_group) : "",
        from_data_id: data?.from_data_id,
        from_data_language_code: data?.from_data_language_code,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["dataLanguage", table_name]);
      queryClient.invalidateQueries(["blocks"]);
      queryClient.invalidateQueries(["data_language"]);
    },
  });

  return {
    dataLanguageMutation,
  };
}

export function useDataLanguageOfTable({ table_name }: { table_name: string }) {
  const { language } = useLanguage();

  const dataLanguage = useQuery(["dataLanguage", table_name], () =>
    getDataLanguagesByTable({ table_name })
  );

  const dataIds =
    dataLanguage.data
      ?.filter((data) => language === data.language_code)
      .map((data: DataLanguageDto) => data.data_id) || [];

  const allDataIds =
    dataLanguage.data?.map((data: DataLanguageDto) => data.data_id) || [];

  return { dataIds, language, allDataIds };
}
