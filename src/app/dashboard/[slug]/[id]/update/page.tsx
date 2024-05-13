"use client";
import UpdateFormBase from "@/components/base-form/update-form-base";
import UpdatePage from "@/components/dynamic-crud-layouts/update-page";
import LanguageSwitcher from "@/components/language-switcher";
import { useTable } from "@/hooks/use-database";
import useSearchParams from "@/hooks/use-search-params";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";

export default function Update({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const { id, slug } = params;
  const { table } = useTable(slug);
  const tableName = table?.name || "";
  const searchParams = useSearchParams();
  const goBackUrl = searchParams.getQueryString("goBackUrl") || undefined;

  return (
    <UpdatePage id={id} tableName={tableName} goBackUrl={goBackUrl}>
      {table?.can_translate && <LanguageSwitcher />}

      <UpdateFormBase
        id={Number(id)}
        table={table as DatabaseTableDto}
        goBackUrl={goBackUrl}
      />
    </UpdatePage>
  );
}
