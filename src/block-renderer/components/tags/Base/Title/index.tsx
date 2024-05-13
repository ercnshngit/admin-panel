import EditPane from "@/block-renderer/utils/components/edit-pane";
import { cn } from "@/libs/utils";

export default function Title({
  className,
  text,
  customFontSize,
}: {
  className?: string;
  text: string;
  customFontSize?: number;
}) {
  return (
    <EditPane
      fields={[
        {
          propName: "text",
          propValue: text,
          typeName: "text",
        },
      ]}
    >
      <h1
        className={cn(
          "mb-[0.5em] text-3xl font-bold leading-none text-secondary-blue lg:text-5xl",
          className
        )}
        style={{ fontSize: customFontSize ? `${customFontSize}px` : "" }}
      >
        {text}
      </h1>
    </EditPane>
  );
}
