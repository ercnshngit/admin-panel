"use client";
import UpdateFormBase from "@/components/base-form/update-form-base";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTable } from "@/hooks/use-database";
import useSearchParams from "@/hooks/use-search-params";
import { useTranslate } from "@/langs";
import { getTable } from "@/services/dashboard";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { general } from "@prisma/client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense, useState } from "react";
import { customWidgetsByGroup } from "./groups";
import ContactMails from "./contact-mails";
import DeleteDialog from "@/components/delete-dialog-base";
import DeleteItem from "@/components/delete-dialog-table-item";

export default function General() {
  const { data, error } = useQuery<general[], Error>(["general"], () =>
    getTable({ tableName: "general" })
  );

  const searchParams = useSearchParams();
  const allParams = searchParams.getAllQueryString();
  const { table, filterables, searchables } = useTable("general");
  const { translate } = useTranslate();

  const tableName = table?.name || "";

  const groupedData = data?.reduce((acc: Record<string, general[]>, item) => {
    if (!acc[item.group_name || "Other"]) {
      acc[item.group_name || "Other"] = [];
    }
    acc[item.group_name || "Other"].push(item);
    return acc;
  }, {});

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (error) return null;

  return (
    <Card className="p-8">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">{translate(tableName)}</h3>
        {table?.can_create !== false && (
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link
                href={{
                  pathname: "/dashboard/" + tableName + "/ekle",
                  query: searchParams.getAllQueryString(),
                }}
              >
                <PlusCircledIcon className="w-4 h-4 mr-2" />
                Yeni {translate(tableName)} ekle
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="w-full ">
        <ContactMails />
        {groupedData &&
          (Object.entries(groupedData) as [string, general[]][]).map(
            ([key, values]) => {
              return (
                <div key={key}>
                  <h4 className="text-lg font-medium">{key}</h4>
                  <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
                    {values.map((value, index) => {
                      console.log(value);

                      return (
                        <Suspense
                          fallback={<Loading />}
                          key={`${key}-${index}`}
                        >
                          <div className="p-2 bg-gray-100 rounded-xl">
                            <p className="text-gray-400 text-sm">
                              {"#" + value.id + "-" + value.slug}
                            </p>
                            <UpdateFormBase
                              id={Number(value.id)}
                              table={
                                {
                                  ...table,
                                  columns: table?.columns?.filter((column) => {
                                    return !(
                                      value[column.name as keyof general] ===
                                        undefined ||
                                      value[column.name as keyof general] ===
                                        null ||
                                      value[column.name as keyof general] ===
                                        "" ||
                                      column.name === "group_name" ||
                                      column.name === "slug"
                                    );
                                  }),
                                } as DatabaseTableDto
                              }
                            />

                            <Button
                              className="mt-2"
                              variant={"destructive"}
                              onClick={() => {
                                setDeleteOpen(true);
                                setDeleteId(Number(value.id));
                              }}
                            >
                              Sil
                            </Button>
                          </div>
                        </Suspense>
                      );
                    })}
                  </div>
                  <DeleteItem
                    goBackUrl={"/dashboard/general"}
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    tableName={tableName}
                    id={deleteId}
                  />
                </div>
              );
            }
          )}
      </div>
    </Card>
  );
}
