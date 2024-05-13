"use client";
import { Button } from "@/components/ui/button";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import { columns } from "@/components/data-table/columns";
import { useTable } from "@/hooks/use-database";
import { useTranslate } from "@/langs";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useSearchParams from "@/hooks/use-search-params";
import { useDataLanguageOfTable } from "@/utils/use-data-language";
import { Row } from "@tanstack/react-table";
import { DataTable } from "../../data-table/data-table";
import LanguageSwitcher from "@/components/language-switcher";
import { getCookie } from "@/utils/cookie";

export default function ListPage<T extends { id: number }>({
  slug,
  data,
  addButtonHref,
  buttons,
  goBackUrl,
}: {
  slug: string;
  data: T[];
  addButtonHref?: any;
  goBackUrl?: string;
  buttons?: (row: Row<any>) => React.ReactNode;
}) {
  const [noLangMode, setNoLangMode] = useState(false);
  const searchParams = useSearchParams();
  const allParams = searchParams.getAllQueryString();
  const page = Number(allParams?.["page"]) || 1;
  const { table, filterables, searchables } = useTable(slug);
  const { translate } = useTranslate();
  const tableName = table?.name || "";
  const tableColumns = columns(
    slug,
    table?.columns || [],
    buttons,
    table,
    translate,
    goBackUrl
  );

  const user = getCookie("user");

  const { dataIds, language, allDataIds } = useDataLanguageOfTable({
    table_name: slug,
  });
  const [tableData, setTableData] = useState(data);
  useEffect(() => {
    if (dataIds && table?.can_translate) {
      setTableData((p) => {
        if (!table?.can_translate) {
          return data;
        } else {
          return data.filter((row) =>
            noLangMode ? !allDataIds.includes(row.id) : dataIds.includes(row.id)
          );
        }
      });
    } else {
      setTableData(data);
    }
  }, [data, language, noLangMode]);

  useEffect(() => {
    setTableData(data);
  }, []);

  //TODO roleller degisebilir
  const isSuperAdmin = user?.role_id === 3;

  const filterablesData = filterables?.map((filterable) => {
    if (data && Array.isArray(data)) {
      return {
        ...filterable,
        options: Array.from(
          new Set(data?.map((row: any) => row[filterable.name]))
        ).map((option) => {
          return {
            label: option,
            value: option,
            icon: null,
          };
        }),
      };
    }
  });

  const searchablesData = searchables;
  return (
    <Card className="p-8">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">{translate(tableName)}</h3>
        {(table?.can_create !== false || isSuperAdmin) && (
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link
                href={
                  addButtonHref
                    ? addButtonHref
                    : {
                        pathname: "/dashboard/" + tableName + "/ekle",
                        query: searchParams.getAllQueryString(),
                      }
                }
              >
                <PlusCircledIcon className="w-4 h-4 mr-2" />
                Yeni {translate(tableName)} ekle
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="w-full py-10">
        {table?.can_translate && (
          <>
            <div className="flex items-center justify-between py-2 mb-2 border-b border-border">
              <Label htmlFor="noLang-mode" className="text-base font-normal">
                Dil belirlenmemis verileri goster
              </Label>
              <Switch
                id="noLang-mode"
                checked={noLangMode}
                onCheckedChange={() => setNoLangMode((p) => !p)}
              />
            </div>
            <LanguageSwitcher />
          </>
        )}
        {tableData && (
          <DataTable
            tableName={tableName}
            columns={tableColumns}
            data={
              Object.keys(allParams).length > 0
                ? tableData.filter((data: any) =>
                    Object.keys(allParams).every((key) =>
                      data.hasOwnProperty(key)
                        ? String(data[key as any]) ===
                          String(allParams[key as any])
                        : true
                    )
                  )
                : tableData
            }
            page={page ? page : 1}
            filterables={filterablesData}
            searchables={searchablesData}
            databaseTableColumns={table?.columns || []}
          />
        )}
      </div>
    </Card>
  );
}
