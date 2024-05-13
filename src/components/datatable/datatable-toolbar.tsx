"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "./datatable-view-options";

import { DataTableFacetedFilter } from "./datatable-faceted-filter";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CalendarDateRangePicker } from "./date-range-picker";
import { useTranslate } from "@/langs";
import { DataBaseTableColumnDto } from "@/services/dto/database-table-column.dto";
import DeleteDialog from "../delete-dialog-base";
import { useState } from "react";
import { set } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DELETE_TABLE_ITEM } from "@/types/common-table-api";
import { deleteTableItem } from "@/services/dashboard";
import { toast } from "react-toastify";
import { useTable } from "@/hooks/use-database";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterables?: any[] | null;
  searchables?: any[] | null;
  tableName: string;
  databaseTableColumns: DataBaseTableColumnDto[];
}

export function DataTableToolbar<TData>({
  table,
  filterables,
  searchables,
  tableName,
  databaseTableColumns,
}: DataTableToolbarProps<TData>) {
  const { table: dbTable } = useTable(tableName);
  const { translate } = useTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const isFiltered = table.getState().columnFilters.length > 0;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    (deleteData: DELETE_TABLE_ITEM) => deleteTableItem(deleteData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([tableName]);
        table.resetRowSelection();
        setIsDialogOpen(false);
        setSelectedRows([]);
        toast.success(" Başarıyla silindi");
      },
      onError: (error) => {
        console.log(error);
        toast.error(" Bir hata oluştu. Lütfen tekrar deneyin. ");
      },
    }
  );

  const handleDelete = async () => {
    try {
      setIsDialogOpen(false);
      selectedRows.forEach((id) => {
        deleteMutation.mutate({
          id: id,
          tableName: tableName,
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col flex-wrap items-center flex-1 gap-2 space-x-2 md:flex-row max-md:space-y-2">
        {searchables?.map((searchable) => (
          <Input
            key={searchable.name}
            placeholder={translate(searchable.name) + " göre ara"}
            value={
              (table.getColumn(searchable.name)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(searchable.name)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px] bg-white"
          />
        ))}
        {filterables &&
          filterables?.map((filterable) => {
            if (!filterable) return;
            if (table.getColumn(filterable.name)) {
              return (
                <DataTableFacetedFilter
                  key={filterable.name}
                  column={table.getColumn(filterable.name)}
                  table={dbTable}
                  title={translate(filterable.name) + " göre filtrele"}
                  options={filterable.options}
                  filterable={filterable}
                />
              );
            }
          })}

        {/* {databaseTableColumns?.find(
          (column) => column.name === "created_at"
        ) && <CalendarDateRangePicker column={table.getColumn("created_at")} />} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Temizle
            <Cross2Icon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <DeleteDialog
        title="Seçili Kayıtları Sil"
        description="Seçili kayıtları silmek istediğinize emin misiniz?"
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        handleDelete={handleDelete}
      />
      <Button
        variant="destructive"
        onClick={() => {
          setIsDialogOpen(true);
          setSelectedRows(
            table
              .getFilteredSelectedRowModel()
              // @ts-ignore
              .rows.map((row) => row.original.id)
          );
        }}
        size="sm"
        className=" h-8 ml-auto lg:flex mr-2"
      >
        Toplu Sil
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
