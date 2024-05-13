"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslate } from "@/langs";
import { UniqueIdentifier } from "@dnd-kit/core";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import Loading from "@/components/loading";
import { getTableItem } from "@/services/common-table-api";
import { changeMenuOrder, getMenuByTypeId } from "@/services/menu";
import { MENU_ITEM } from "@/types/menus";
import { menu } from "@prisma/client";
import { useRouter } from "next/navigation";
import MenuList from "../menu-list";
import { useEffect, useState } from "react";

export default function MenuType({ params }: { params: { id: string } }) {
  const id = params.id;
  const { data: menu_type, error: isError } = useQuery<menu, Error>(
    ["menu_type", id],
    () => getTableItem({ id: Number(id), tableName: "type" }),
    { enabled: !!id }
  );
  if (menu_type) {
    return <Menu menuTypeId={+id} />;
  } else {
    return (
      <div>
        <Loading />
      </div>
    );
  }
}

function Menu({ menuTypeId }: { menuTypeId: number }) {
  const [loading, setLoading] = useState(false);
  const { data, error } = useQuery<MENU_ITEM[], Error>(
    ["menus", menuTypeId],
    () => getMenuByTypeId({ typeId: menuTypeId })
  );

  const queryClient = useQueryClient();
  const updateMutation = useMutation(
    (data: { from: number; to: number }) => {
      setLoading(true);
      return changeMenuOrder(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["menus", menuTypeId]);
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
      },
    }
  );
  const router = useRouter();
  const { translate } = useTranslate();

  const handleUpdate = (data: { from: number; to: number }) => {
    updateMutation.mutate(data);
  };

  const handleRemove = (id: UniqueIdentifier) => {};

  return (
    <div className="container py-10 mx-auto">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">{translate("menu")}</h3>
        <div>
          <Button asChild>
            <Link
              href={{
                pathname: "/dashboard/menu/ekle",
                query: { type_id: menuTypeId },
              }}
            >
              <PlusCircledIcon className="w-4 h-4 mr-2" />
              Yeni {translate("menu")} ekle
            </Link>
          </Button>
        </div>
      </div>

      <Card className="min-h-[700px]">
        <CardContent>
          <div className="py-10">
            {data && data?.length > 0 ? (
              <MenuList
                loading={loading}
                data={data}
                handleUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ) : (
              <div>
                Menü yok,{" "}
                <Link href={"/dashboard/menu/ekle?type_id=" + menuTypeId}>
                  yeni menü eklemek için tıklayınız.
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
