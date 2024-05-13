import EditPane from "@/block-renderer/utils/components/edit-pane";
import { cn } from "@/libs/utils";

export default function VStack({
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
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
  };

  const justifyContent = justifyContents[justify || "start"];

  const alignItemses = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    stretch: "items-stretch",
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
          "w-full flex flex-col",
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
