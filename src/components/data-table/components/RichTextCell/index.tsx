import { DataBaseTableColumnDto } from "@/services/dto/database-table-column.dto";
import React from "react";

export default function RichTextCell({
  value,
  column,
}: {
  value: any;
  column: DataBaseTableColumnDto;
}) {
  return (
    <div>
      <p
        className="line-clamp-4"
        dangerouslySetInnerHTML={{
          __html: value,
        }}
      ></p>
    </div>
  );
}
