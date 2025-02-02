"use client";
import {
  Component,
  ComponentBase,
} from "@/block-renderer/utils/component-tags";
import UpdatePage from "@/components/dynamic-crud-layouts/update-page";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTable } from "@/hooks/use-database";
import IconSelect from "@/libs/lucide-icons";
import { getComponent, getTypes, updateComponent } from "@/services/dashboard";
import { ComponentDto, CreateComponentDto } from "@/services/dto/component.dto";
import { TypeDto } from "@/services/dto/type.dto";
import { parseProperties } from "@/utils/component-helper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusCircle, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function UpdateComponentPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params?.id);
  const { data: component } = useQuery<ComponentDto>(["component", id], () =>
    getComponent(id)
  );
  const { table } = useTable("component");
  const tableName = table?.name || "";

  const { data: componentTypes } = useQuery<TypeDto[]>(["componentTypes"], () =>
    getTypes("component")
  );
  const { data: propTypes } = useQuery<TypeDto[]>(["propTypes"], () =>
    getTypes("prop")
  );

  useEffect(() => {
    document.addEventListener("paste", function (event) {
      const clipText = event.clipboardData?.getData("Text");
      if (!clipText) return;
      const properties = parseProperties(clipText);

      properties.forEach((property) => {
        const type = propTypes?.find((item) => item.name === property.type);
        if (type) {
          if (
            !form.getValues().props.some((item) => item.key === property.name)
          ) {
            insert(
              form.getValues().props.length,
              {
                key: property.name,
                type: {
                  id: type.id,
                  name: type.name,
                },
              },
              { shouldFocus: false }
            );
          }
        }
      });
    });
    return () => {
      document.removeEventListener("paste", function (event) {
        const clipText = event.clipboardData?.getData("Text");
      });
    };
  }, []);

  const componentMutation = useMutation(
    (data: CreateComponentDto) => {
      return updateComponent({
        id: id,
        data: data,
      });
    },
    {
      onSuccess: () => {
        toast.success("Bileşen guncellendi");
      },
    }
  );

  const initialValues = {
    name: component?.name || "",
    tag: {
      name: component?.tag.name || "",
    },
    type: {
      id: component?.type.id || null,
      name: component?.type.name || "",
      table_id: component?.type.table_id || null,
    },
    icon: component?.icon || "",
    props:
      component?.props.map((prop) => ({
        key: prop.key,
        type: {
          id: prop.type.id,
          name: prop.type.name,
          table_id: prop.type.table_id,
        },
      })) || [],
  };

  const form = useForm<DefaultValues>({
    defaultValues: initialValues,
  });

  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name: "props",
  });

  type DefaultValues = {
    name: string;
    tag: {
      name: string;
    };
    type: {
      id: number | null;
      name: string;
      table_id?: number | null;
    };
    icon: string;
    props: {
      key: string;
      type: {
        id: number | null;
        name: string;
        table_id?: number | null;
      };
    }[];
  };

  const onSubmit = (data: DefaultValues) => {
    componentMutation.mutate({
      id: 0,
      name: data.name,
      tag: {
        id: 0,
        name: data.tag.name,
      },
      type: {
        id: Number(data.type.id),
        name: data.type.name,
        table_id: Number(data.type.table_id),
      },
      icon: data.icon,
      props: data.props.map((prop) => ({
        prop: {
          id: 0,
          key: prop.key,
          type: {
            id: Number(prop.type.id),
            name: prop.type.name,
            table_id: Number(prop.type.table_id),
          },
        },
        value: "",
      })),
    });
  };

  return (
    <UpdatePage id={String(id)} tableName={tableName}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>İsim</FormLabel>

                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"tag.name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Component İsmi</FormLabel>

                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"icon"}
            render={({ field }) => (
              <FormItem className="flex-col flex ">
                <FormLabel>Icon</FormLabel>

                <IconSelect form={form} field={field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"type.id"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tip</FormLabel>

                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                    if (componentTypes) {
                      const type = componentTypes.find(
                        (item) => item.id === Number(e)
                      );
                      if (!type) return;
                      form.setValue(`type.name`, type.name);
                      form.setValue(`type.table_id`, type.table_id);
                    }
                  }}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {componentTypes?.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel>Props</FormLabel>
          <ul className="flex gap-2 flex-col">
            {fields.map((item, index) => {
              return (
                <li key={item.id} className="flex gap-4 items-center">
                  <FormField
                    control={form.control}
                    name={`props.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`props.${index}.type.id`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e);
                            if (propTypes) {
                              const prop = propTypes.find(
                                (item) => item.id === Number(e)
                              );
                              if (!prop) return;
                              form.setValue(
                                `props.${index}.type.name`,
                                prop.name
                              );
                              form.setValue(
                                `props.${index}.type.table_id`,
                                prop.table_id
                              );
                            }
                          }}
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propTypes?.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={() => remove(index)}
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
          <Button
            className="mt-2 flex items-center bg-green-500 hover:bg-green-600"
            variant={"default"}
            type="button"
            onClick={() => append({ key: "", type: { id: null, name: "" } })}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Append
          </Button>

          <Button className="mt-10" variant={"default"}>
            Update
          </Button>
        </form>
      </Form>

      <div className="m-2">
        <h1>Örnek:</h1>
        <hr />
        {component && (
          <ComponentBase
            componentTag={component?.tag.name}
            {...component?.props.reduce(
              (acc, prop) => ({
                ...acc,
                [prop.key]: "Deneme",
              }),
              {}
            )}
          />
        )}
      </div>
    </UpdatePage>
  );
}
