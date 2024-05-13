"use client";
import { z } from "zod";
import EditableContent from "../../../../utils/editable-content";
import { motion } from "framer-motion";
import { cn } from "@/libs/utils";
type RichTextProps = z.infer<typeof propsSchema>;

export default function RichText({ className, content }: RichTextProps) {
  return (
    <motion.div className="w-full">
      <EditableContent
        typeName="richtext"
        propName={"content"}
        propValue={content}
      >
        <div
          className={cn("prose w-full", className)}
          dangerouslySetInnerHTML={{
            __html: content
              ?.replaceAll(
                /(<li\s+class="ql-indent-(\d+)">(.*?)<\/li>)/g,
                "<ul><li>$3</li></ul>"
              )
              .replaceAll("&nbsp;", ""),
          }}
        />
      </EditableContent>
    </motion.div>
  );
}
export const defaultProps = {
  className: "",
  content: "",
};
export const displayName = "Card Grid";
export const typeName = "Page Component";
export const iconName = "grid-icon";
export const propsSchema = z.object({
  className: z.string(),
  content: z.string(),
});
