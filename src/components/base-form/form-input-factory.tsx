import React from "react";
import { FieldErrors, SetValueConfig, UseFormRegister } from "react-hook-form";
import Checkbox from "./components/Checkbox";
import Date from "./components/Date";
import Hidden from "./components/Hidden";
import ImagePicker from "./components/ImagePicker";
import MultiSelect from "./components/MultiSelect";
import Number from "./components/Number";
import Relation from "./components/Relation";
import RichTextBox from "./components/RichTextBox";
import Select from "./components/Select";
import String from "./components/String";
import TextArea from "./components/TextArea";
import { DatabaseTableDto } from "@/services/dto/database-table.dto";
import { DataBaseTableColumnDto } from "@/services/dto/database-table-column.dto";
import IconSelect from "./components/IconSelect";
import Slugify from "./components/Slugify";
import Readonly from "./components/Readonly";
import FilePicker from "./components/FilePicker";

type FormInputFactoryProps = {
  field: DataBaseTableColumnDto;
  table: DatabaseTableDto;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  formType: "create_crud_option" | "update_crud_option";
  id?: number;
  setValue: (value: any) => void;
  watch?: any;
  control: any;
  readOnly?: boolean;
  customInput?: {
    for: string;
    component: React.FC<any>;
  }[];
};

export default function FormInputFactory({
  formType,
  id,
  customInput,
  ...props
}: FormInputFactoryProps) {
  const inputType = props.field?.input_type?.name || "text";

  if (customInput) {
    const CustomInputItem = customInput.find(
      (item) => item.for === inputType
    )?.component;
    if (CustomInputItem) {
      return <CustomInputItem {...props} />;
    }
  }

  switch (inputType.toLowerCase()) {
    case "checkbox":
      return <Checkbox {...props} />;
    case "date":
      return <Date {...props} />;
    case "hidden":
      return <Hidden {...props} />;
    case "slugify":
      return <Slugify {...props} />;
    case "image":
      return <ImagePicker {...props} />;
    case "file":
      return <FilePicker {...props} />;
    case "multi-select":
      return <MultiSelect {...props} />;
    case "number":
      return <Number {...props} />;
    case "relation":
      return <Select {...props} />;
    case "select":
      return <Select {...props} />;
    case "icon-select":
      return <IconSelect {...props} />;
    case "textarea":
      return (
        <>
          <TextArea {...props} />
        </>
      );
    case "readonly":
      return (
        <>
          <Readonly {...props} />
        </>
      );
    case "richtext":
      return (
        <>
          <RichTextBox {...props} />
        </>
      );

    default:
      return (
        <>
          <String {...props} />
        </>
      );
  }
}
