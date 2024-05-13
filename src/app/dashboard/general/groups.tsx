import UpdateFormBase from "@/components/base-form/update-form-base";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { general } from "@prisma/client";

export const customWidgetsByGroup: Record<
  string,
  ({
    value,
    table,
  }: {
    value: general;
    table?: DatabaseTableDto | undefined;
  }) => JSX.Element
> = {};

function ServerGeneralWidget({
  value,
  table,
}: {
  value: general;
  table?: DatabaseTableDto;
}) {
  return (
    <div className="p-2 bg-gray-100 rounded-xl">
      <UpdateFormBase
        id={Number(value.id)}
        table={
          {
            ...table,
            columns: table?.columns?.filter((column) => {
              return !(
                value[column.name as keyof general] === undefined ||
                value[column.name as keyof general] === null ||
                value[column.name as keyof general] === "" ||
                column.name === "group_name" ||
                column.name === "slug"
              );
            }),
          } as DatabaseTableDto
        }
      />
    </div>
  );
}
