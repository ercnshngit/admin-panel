import { jsonParse, validateJson } from "@/block-renderer/utils/json-parse";
import FormInputFactory from "@/components/base-form/form-input-factory";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { PlusIcon, XIcon } from "lucide-react";
import React, { ChangeEvent } from "react";
import SidebarInputFactory from "../..";
import { set } from "date-fns";

export default function JsonInput({
  propKey,
  value,
  setValue,
  className,
  json,
  ...rest
}: {
  propKey: string;
  value: any;
  setValue: any;
  className?: string;
  json: Record<string, any>;
}) {
  const [values, setValues] = React.useState<any[]>(jsonParse(value) || []);
  const [isValid, setIsValid] = React.useState<true | string>(true);

  const handleInputChange = (index: number, key: string) => (value: string) => {
    const newValues = [...values];
    newValues[index][key] = value;
    setValues(newValues);
    setValue(JSON.stringify(newValues));
  };

  const handleAddInput = () => {
    const newValues = [...values];
    newValues.push(json.items.type === "object" ? {} : "");
    setValues(newValues);
    setValue(JSON.stringify(newValues));
  };

  const handleDeleteInput = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
    setValue(JSON.stringify(newValues));
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(JSON.stringify(jsonParse(e.target.value) || []));
          setValues(jsonParse(e.target.value) || []);
          const valid = validateJson(e.target.value);
          setIsValid(valid === true ? true : valid.error);
        }}
      />
      {isValid === true ? (
        <p className="text-green-500 text-sm">Geçerli JSON</p>
      ) : (
        <>
          <p className="text-red-500 text-sm">Geçerli bir JSON giriniz</p>
          <p className="text-gray-500 text-xs">{isValid}</p>
        </>
      )}
      <br />
      {json.type === "array" &&
        values.map((item, index: number) => {
          if (json.items.type === "object") {
            return (
              <div
                key={index}
                className="flex h-auto gap-1 items-stretch bg-white rounded-md p-4"
              >
                <div className="flex flex-col gap-1 w-full">
                  {Object.keys(json.items.properties).map((key) => (
                    <div className="grid grid-cols-[20%_1fr]" key={key}>
                      <label htmlFor={`${propKey}-${index}-${key}`}>
                        {key}
                      </label>

                      <SidebarInputFactory
                        propKey={`${propKey}-${index}-${key}`}
                        value={item[key]}
                        setValue={handleInputChange(index, key)}
                        className="text-black"
                        typeName={json.items.properties[key].type}
                        options={json.items.properties[key].options}
                        json={json.items.properties[key].json}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  className="flex items-center"
                  variant={"destructive"}
                  size={"sm"}
                  type="button"
                  onClick={() => handleDeleteInput(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            );
          } else {
            return (
              <div key={index} className="flex gap-1">
                <SidebarInputFactory
                  propKey={`${propKey}-${index}`}
                  value={item}
                  setValue={(value: string) => {
                    const newValues = [...values];
                    newValues[index] = value;
                    setValues(newValues);
                    setValue(JSON.stringify(newValues));
                  }}
                  className="text-black"
                  typeName={json.items.type}
                  options={json.items.options}
                  json={json.items.json}
                />
                <Button
                  className="flex items-center"
                  variant={"destructive"}
                  size={"sm"}
                  type="button"
                  onClick={() => handleDeleteInput(index)}
                >
                  <XIcon />
                </Button>
              </div>
            );
          }
        })}
      <Button
        variant="default"
        className="
      bg-primary text-primary-foreground gap-1 items-center flex shadow hover:bg-primary/90"
        size="sm"
        type="button"
        onClick={handleAddInput}
      >
        <PlusIcon className="w-4 h-4" /> Yeni Ekle
      </Button>
    </div>
  );
}
