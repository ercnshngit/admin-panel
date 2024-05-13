"use client";
import { Button } from "@/components/ui/button";
import { useDesigner } from "@/contexts/designer-context";
import { BlockComponentDto } from "@/services/dto/block_component.dto";
import { memo, useMemo, useState } from "react";
import * as tags from "../components/tags";

const ErrorComponent = ({
  component,
}: {
  component?: BlockComponentDto;
  [key: string]: any;
}) => {
  const { removeElement } = useDesigner();

  return (
    <div className="text-center text-red-400 bg-red-100">
      {component?.component.tag.name}
      <p className="text-red-400">Desteklenmeyen bileşen lütfen silin</p>
      <Button
        variant={"destructive"}
        size={"sm"}
        onClick={(e) => {
          e.stopPropagation();
          if (component) removeElement && removeElement(component.code);
        }}
      >
        Sil
      </Button>
      <div className="w-full border-b border-red-400"></div>
      {component?.children?.map((child) => {
        return <ErrorComponent key={component.code} component={component} />;
      })}
    </div>
  );
};
ErrorComponent.displayName = "ErrorComponent";

function Component({
  component,
  children,
  ...rest
}: {
  component: BlockComponentDto;
  children?: any;
  [key: string]: any;
}) {
  const [isError, setIsError] = useState(false);

  const Component = useMemo(() => {
    const TheComponent = tags[
      component.component.tag.name as keyof typeof tags
    ] as any;
    if (!TheComponent) setIsError(true);
    return TheComponent;
  }, [component.component.tag.name]);

  if (isError) return <ErrorComponent component={component} />;
  if (!Component) return null;
  if (children) return <Component {...rest}>{children}</Component>;

  return <Component {...rest} />;
}
const Memo = memo(Component);

export { Memo as Component };

function ComponentBase({
  componentTag,
  children,
  ...rest
}: {
  componentTag: string;
  children?: any;
  [key: string]: any;
}) {
  const [isError, setIsError] = useState(false);

  const Component = useMemo(() => {
    const TheComponent = tags[componentTag as keyof typeof tags] as any;
    if (!TheComponent) setIsError(true);
    return TheComponent;
  }, [componentTag]);

  if (isError) return null;
  if (!Component) return null;
  if (children) return <Component {...rest}>{children}</Component>;

  return <Component {...rest} />;
}
const Memo2 = memo(ComponentBase);

export { Memo2 as ComponentBase };
