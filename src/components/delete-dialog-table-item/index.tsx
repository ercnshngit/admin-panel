import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BsFillTrashFill } from "react-icons/bs";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslate } from "@/langs";
import { DELETE_TABLE_ITEM } from "@/types/common-table-api";
import { deleteTableItem } from "@/services/dashboard";
import DeleteDialog from "../delete-dialog-base";
import { toast } from "react-toastify";
export default function DeleteItem({
  open,
  setOpen,
  tableName,
  goBackUrl,
  id,
}: any) {
  const { translate } = useTranslate();

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    (deleteData: DELETE_TABLE_ITEM) => {
      console.log("deleteData", deleteData);
      return deleteTableItem(deleteData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([tableName]);
        console.log("deleteMutation");
        if (goBackUrl && goBackUrl === pathname) {
        } else {
          router.push(goBackUrl ? goBackUrl : "/dashboard/" + tableName);
        }
        toast.success("Başarıyla silindi");
      },
      onError: (error) => {
        console.log(error);
        toast.error(" Bir hata oluştu. Lütfen tekrar deneyin. ");
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate({
      id: id,
      tableName: tableName,
    });
  };
  return (
    <DeleteDialog
      title={translate("MENU_DELETE_ALERT_TITLE")}
      open={open}
      setOpen={setOpen}
      description={translate("MENU_DELETE_ALERT_DESCRIPTION")}
      handleDelete={handleDelete}
    />
  );
}
