import EditableContent from "@/block-renderer/utils/editable-content";
import { cn } from "@/libs/utils";
import React from "react";

export default function Description({
  className,
  text,
}: {
  className?: string;
  text: string | React.ReactNode;
}) {
  return (
    <EditableContent typeName="richtext" propName={"text"} propValue={text}>
      {typeof text === "string" ? (
        <p
          className={cn(
            "mb-[1em] prose text-justify text-lg font-light text-text-black lg:text-xl",
            className
          )}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ) : (
        <div
          className={cn(
            "mb-[1em] prose text-justify  text-lg font-light text-text-black lg:text-xl",
            className
          )}
        >
          {text}
        </div>
      )}
    </EditableContent>
  );
}
