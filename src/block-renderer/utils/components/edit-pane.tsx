import { useDesigner } from "@/contexts/designer-context";
import { useTableDataByColumnAndValue } from "@/hooks/use-database";
import React, { useEffect } from "react";
import { cn } from "@/libs/utils";
import SidebarInputFactory from "@/components/block-builder/components/sidebar-input-factory";
import EditableData from "./editable-data";
import { Button } from "@/components/ui/button";

export default function EditPane<T extends { id: number }>({
  fields,
  hasChildren,
  dataFields,
  className,
  children,
  refreshData,
}: {
  refreshData?: () => void;
  hasChildren?: React.ReactNode;
  children?: React.ReactNode;
  fields?: {
    propName: string;
    propValue: any;
    typeName: string;
    options?: { label: string; value: any }[];
    json?: Record<string, any>;
  }[];
  dataFields?: {
    description: string;
    tableName: string;
    data: T[];
    queryKey?: string[];
    formConfig?: {
      show?: string[];
      hidden?: string[];
      readonly?: string[];
      defaultValues?: { [key: string]: any };
    };
  }[];
  className?: string;
}) {
  const { updateElement, selectedElement, contextActive, setSelectedElement } =
    useDesigner();
  if (!contextActive || !selectedElement) {
    return children;
  } else {
    return (
      <div className={cn("z-30 py-10", className)}>
        {refreshData && (
          <Button
            className="mb-3"
            onClick={() => {
              setSelectedElement(null);
              refreshData();
            }}
          >
            Sayfadan Çek
          </Button>
        )}
        {fields?.map(({ propName, typeName, options, propValue, ...rest }) => (
          <SidebarInputFactory
            key={propName}
            propKey={propName}
            className="text-black"
            typeName={typeName}
            options={options}
            setValue={(value: string) => {
              updateElement(selectedElement.code, {
                ...selectedElement,
                props: selectedElement.props.map((p) => {
                  if (p.prop.key === propName) {
                    return {
                      ...p,
                      value: value,
                    };
                  }
                  return p;
                }),
              });
            }}
            value={propValue}
            {...rest}
          />
        ))}
        {dataFields?.map((dataField) => (
          <EditableData<T> key={dataField.queryKey?.join("-")} {...dataField} />
        ))}
        {hasChildren || hasChildren}
      </div>
    );
  }
}
