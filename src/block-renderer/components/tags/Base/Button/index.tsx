import EditPane from "@/block-renderer/utils/components/edit-pane";
import { useDesigner } from "@/contexts/designer-context";
import clsx from "clsx";
import Link from "next/link";

export default function Button({
  href,
  variant,
  text,
  className,
  icon,
}: {
  href?: string;
  variant?: keyof typeof variants;
  text?: string;
  className?: string;
  icon?: {
    right?: React.ReactNode;
    left?: React.ReactNode;
  };
}) {
  const variants = {
    moreRounded: "rounded-full bg-icon-blue px-4 py-2 text-white lg:px-14 ",
    default: " rounded-xl bg-primary-blue text-white",
    secondary:
      "rounded-xl bg-text-black text-white transition-all hover:bg-icon-blue",
    outline: "text-secondary-blue rounded-xl border border-primary-blue",
  } as const;
  const { contextActive } = useDesigner();
  return (
    <EditPane
      fields={[
        {
          propName: "href",
          propValue: href,
          typeName: "string",
        },
        {
          propName: "variant",
          propValue: variant,
          typeName: "select",
          options: Object.keys(variants).map((key) => ({
            label: key,
            value: key,
          })),
        },
        {
          propName: "text",
          propValue: text,
          typeName: "string",
        },
      ]}
    >
      <Link
        href={!contextActive ? href || "" : ""}
        className={clsx(
          "inline-block w-fit select-none px-2 py-1 text-center text-sm lg:px-10 lg:text-lg",
          variants[variant || "default"],
          className
        )}
      >
        {icon?.left}
        {text || "Button"}

        {icon?.right}
      </Link>
    </EditPane>
  );
}
