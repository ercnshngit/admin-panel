import React from "react";

import { Label } from "@/components/ui/label";
import { useTranslate } from "@/langs";
import { ImSpinner2 } from "react-icons/im";
import DataInput from "./components/data-input";
import ImagePickerInput from "./components/image-picker-input";
import RichTextEditor from "./components/rich-text";
import SelectInput from "./components/select";
import TextInput from "./components/text-input";
import TextAreaInput from "./components/textarea-input";
import JsonInput from "./components/json-input";

type SidebarInputFactoryProps = {
  value: any;
  propKey: string;
  typeName: string;
  setValue: any;
  className?: string;
  options?: {
    label: string;
    value: any;
  }[];
  customInput?: {
    for: string;
    component: React.FC<any>;
  }[];
  json?: Record<string, any>;
};

export default function SidebarInputFactory({
  customInput,
  propKey,
  typeName,
  options,
  ...props
}: SidebarInputFactoryProps) {
  const { translate } = useTranslate();

  const getInputComponent = (type: string) => {
    switch (type) {
      case "text":
        return <TextInput propKey={propKey} {...props} />;
      case "textarea":
        return <TextAreaInput propKey={propKey} {...props} />;
      case "image":
        return <ImagePickerInput propKey={propKey} {...props} />;
      case "richtext":
        return <RichTextEditor propKey={propKey} {...props} />;
      case "data":
        return <DataInput propKey={propKey} {...props} />;
      case "select":
        return <SelectInput propKey={propKey} {...props} options={options} />;
      case "json":
        if (props.json)
          return <JsonInput propKey={propKey} json={props.json} {...props} />;
      default:
        return <TextInput propKey={propKey} {...props} />;
    }
  };

  if (customInput) {
    const CustomInputItem = customInput.find(
      (item) => item.for === propKey
    )?.component;
    if (CustomInputItem) {
      return <CustomInputItem {...props} />;
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 border-b border-gray-200 pb-4">
      <Label htmlFor={propKey}>{translate(propKey)}</Label>
      <p className="text-xs text-gray-400">{propKey}</p>
      {!typeName && (
        <div className="flex items-center justify-center">
          <ImSpinner2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      {typeName && getInputComponent(typeName)}
    </div>
  );
}
