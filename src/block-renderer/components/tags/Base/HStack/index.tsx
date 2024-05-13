import EditPane from "@/block-renderer/utils/components/edit-pane";
import { cn } from "@/libs/utils";
import { z } from "zod";

export default function HStack({
  className,
  children,
  justify,
  align,
}: {
  className?: string;
  children: React.ReactNode;
  justify?: keyof typeof justifyContents;
  align?: keyof typeof alignItemses;
}) {
  const justifyContents = {
    start: "md:justify-start",
    end: "md:justify-end",
    center: "md:justify-center",
    between: "md:justify-between",
    around: "md:justify-around",
  };

  const justifyContent = justifyContents[justify || "start"];

  const alignItemses = {
    start: "md:items-start",
    end: "md:items-end",
    center: "md:items-center",
    stretch: "md:items-stretch",
  };

  const alignItems = alignItemses[align || "start"];

  return (
    <EditPane
      fields={[
        {
          propName: "justify",
          propValue: justify || "start",
          typeName: "select",
          options: [
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
            { label: "Between", value: "between" },
            { label: "Around", value: "around" },
          ],
        },
        {
          propName: "align",
          propValue: align || "start",
          typeName: "select",
          options: [
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
            { label: "Stretch", value: "stretch" },
          ],
        },
      ]}
      hasChildren={children}
    >
      <div
        className={cn(
          "w-full flex flex-col md:flex-row gap-6 items-center justify-center md:items-start md:justify-start md:flex-wrap lg:flex-nowrap",
          justifyContent,
          alignItems,
          className
        )}
      >
        {children}
      </div>
    </EditPane>
  );
}
