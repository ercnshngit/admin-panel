import EditPane from "@/block-renderer/utils/components/edit-pane";
import React from "react";

export default function Padding({ size }: { size: string }) {
  return (
    <EditPane
      fields={[
        {
          propName: "size",
          propValue: size,
          typeName: "string",
        },
      ]}
    >
      <div
        style={{
          width: (size || "10") + "px",
          height: (size || "10") + "px",
        }}
      ></div>
    </EditPane>
  );
}
