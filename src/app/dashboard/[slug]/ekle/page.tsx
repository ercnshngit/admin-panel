"use client";
import CreatePage from "@/components/dynamic-crud-layouts/create-page";
import { useTable } from "@/hooks/use-database";
import useSearchParams from "@/hooks/use-search-params";
import CreateFormBase from "../../../../components/base-form/create-form-base";
import LanguageSwitcher from "@/components/language-switcher";

export default function Ekle({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { table } = useTable(slug);
  const tableName = table?.name || "";
  const searchParams = useSearchParams();
  const goBackUrl = searchParams.getQueryString("goBackUrl") || undefined;

  return (
    <CreatePage tableName={tableName} goBackUrl={goBackUrl}>
      {table?.can_translate && <LanguageSwitcher />}
      {table && <CreateFormBase table={table} goBackUrl={goBackUrl} />}
    </CreatePage>
  );
}
