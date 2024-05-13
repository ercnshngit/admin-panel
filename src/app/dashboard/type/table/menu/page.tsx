"use client";
import ListPage from "@/components/dynamic-crud-layouts/list-page";
import { Button } from "@/components/ui/button";
import { getTypes } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";

export default function Type() {
  const { data: types } = useQuery(["types", "menu"], () => getTypes("menu"));

  const router = useRouter();

  return (
    <ListPage
      slug={"type"}
      data={types || []}
      goBackUrl="/dashboard/type/table/menu"
      addButtonHref={{
        pathname: "/dashboard/type/ekle",
        query: {
          goBackUrl: "/dashboard/type/table/menu",
          table_id: types?.[0]?.table_id,
        },
      }}
      buttons={(row: Row<any>) => {
        return (
          <>
            <Button
              className="bg-blue-500"
              onClick={() => {
                router.push("/dashboard/menu_type/" + row.original.id);
              }}
            >
              Menüyü Düzenle
            </Button>
            <Button
              className="bg-gray-500"
              onClick={() => {
                router.push(
                  "/dashboard/type/" +
                    row.original.id +
                    "/update?goBackUrl=/dashboard/type/table/menu"
                );
              }}
            >
              Düzenle
            </Button>
          </>
        );
      }}
    />
  );
}
