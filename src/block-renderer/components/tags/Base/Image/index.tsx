import EditableContent from "@/block-renderer/utils/editable-content";
import ImageWrapper from "@/libs/image-wrapper";
import { cn } from "@/libs/utils";
import React from "react";
import { z } from "zod";

export default function Image({
  className,
  src,
}: {
  className?: string;
  src: string;
}) {
  return (
    <EditableContent propName="src" typeName="image" propValue={src}>
      <ImageWrapper
        className={cn("w-full min-w-32 min-h-[600px] h-full", className)}
        imageClassName="object-contain"
        src={src}
        alt=""
      />
    </EditableContent>
  );
}
