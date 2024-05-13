import Loading from "@/components/loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDesigner } from "@/contexts/designer-context";
import useSearchParams from "@/hooks/use-search-params";
import { useTranslate } from "@/langs";
import {
  getBlockComponentsBySlugAndType,
  getComponents,
  getTable,
  getTypes,
} from "@/services/dashboard";
import { BlockDto } from "@/services/dto/block.dto";
import { ComponentDto } from "@/services/dto/component.dto";
import { TypeDto } from "@/services/dto/type.dto";
import { slugify } from "@/utils/slugify";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import BlocksDropdown from "../blocks-dropdown";
import SidebarComponent from "../sidebar-component";
import ImagePickerInput from "../sidebar-input-factory/components/image-picker-input";
import TextInput from "../sidebar-input-factory/components/text-input";
import TextAreaInput from "../sidebar-input-factory/components/textarea-input";

import LanguageSettings from "../language-settings";
import { getBlocks } from "./services";
import { Prisma } from "@prisma/client";

export default function DesignerSidebar({ dragDrop }: { dragDrop: boolean }) {
  const { data: sidebarComponents } = useQuery<ComponentDto[]>(
    ["components"],
    () => getComponents()
  );
  const { block, selectedElement, setUpdateBlockData, addElement, elements } =
    useDesigner();

  const { data: blockTypes } = useQuery<TypeDto[]>(["blockTypes"], () =>
    getTypes("block")
  );

  const { translate } = useTranslate();

  const form = useForm();
  const langForm = useForm();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (block) {
      form.reset({
        status: block.status || 1,
        title: block.title,
        slug: block.slug,
        description: block.description,
        type_id: block.type_id || searchParams.getQueryString("type_id") || 0,
        image_url: block.image_url,
        background_image_url: block.background_image_url || "",
      });
    }
  }, [block, form.reset, form]);

  const onSubmit = (data: any) => {
    setUpdateBlockData({
      id: block?.id || 0,
      title: data.title || "İsimsiz",
      slug: data.slug || "isimsiz",
      description: data.description || "",
      status: Number(data.status || 1),
      type_id: Number(
        data.type_id || searchParams.getQueryString("type_id") || 0
      ),
      image_url: data.image_url || "",
      background_image_url: data.background_image_url || "",
    });
  };
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  const [tab, setTab] = useState<"components" | "block">("block");

  useEffect(() => {
    if (selectedElement && dragDrop) {
      setTab("components");
    } else {
      setTab("block");
    }
  }, [selectedElement]);

  const onTabChange = (value: string) => {
    setTab(value as any);
  };

  const { data: blocks } = useQuery<
    Prisma.blockGetPayload<{
      include: { type: true };
    }>[]
  >(["blocks"], () => getBlocks());

  const handleCopyBlock = async ({
    slug,
    type_id,
  }: {
    slug: string;
    type_id: number;
  }) => {
    const allComponentsOfBlock = await getBlockComponentsBySlugAndType(
      slug,
      type_id
    );
    //change block component codes
    const newCodes: { oldCode: string; newCode: string }[] = [];
    const elementLength = elements.length;
    allComponentsOfBlock.reverse().forEach((component) => {
      if (component.belong_block_component_code === null) {
        const newElement = {
          ...component,
          code: crypto.randomUUID(),
          block: {
            id: 0,
            title: "deneme block",
            type_id: 1,
          },
        };
        newCodes.push({ oldCode: component.code, newCode: newElement.code });

        addElement(elementLength, newElement);
      }
    });
    allComponentsOfBlock.reverse().forEach((component) => {
      if (component.belong_block_component_code !== null) {
        const newElement = {
          ...component,
          code: crypto.randomUUID(),
          belong_block_component_code:
            newCodes.find(
              (c) => c.oldCode === component.belong_block_component_code
            )?.newCode || crypto.randomUUID(),
          block: {
            id: 0,
            title: "deneme block",
            type_id: 1,
          },
        };
        newCodes.push({ oldCode: component.code, newCode: newElement.code });

        addElement(0, newElement);
      }
    });
  };
  return (
    <div className="fixed min-h-screen h-full top-5 w-3/12 right-0 bg-white px-4 py-10">
      <Tabs
        value={tab}
        onValueChange={onTabChange}
        defaultValue={"block"}
        className="w-full"
      >
        <TabsList>
          {dragDrop && <TabsTrigger value="components">Component</TabsTrigger>}
          <TabsTrigger value="block">Block Settings</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
        </TabsList>
        {dragDrop && (
          <TabsContent value="components" className="relative">
            <div className="mb-4">
              <BlocksDropdown
                setValue={(value: string, type_id: number) =>
                  handleCopyBlock({ slug: value, type_id })
                }
                blocks={
                  blocks?.map((block) => ({
                    label: block.title,
                    value: block.slug || "",
                    type_id: block.type_id,
                    type_name: block.type?.name || "",
                  })) || []
                }
              />
            </div>
            <div className="fixed">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="my-2 w-full border px-2 py-1"
              />
              <div className="grid grid-cols-2 gap-2 items-start h-[70vh] overflow-auto">
                {sidebarComponents &&
                  sidebarComponents
                    ?.filter((component) => {
                      if (searchTerm === "") return true;
                      return (
                        component.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        component.tag.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      );
                    })
                    .sort((a, b) => a.name.localeCompare(b.name, "tr"))
                    .map((component) => {
                      return (
                        <SidebarComponent
                          component={component}
                          key={component.id}
                        />
                      );
                    })}
              </div>
            </div>
          </TabsContent>
        )}
        <TabsContent value="block">
          <div className="flex flex-col w-full gap-2">
            <h1 className="text-2xl font-bold">Properties</h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={form.control}
                  name={"title"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate(field.name)}</FormLabel>
                      <p className="text-xs text-gray-400">{field.name}</p>

                      <FormControl>
                        <TextInput
                          propKey={field.name}
                          value={field.value}
                          setValue={(value: string) => {
                            field.onChange(value);
                            form.setValue("slug", slugify(value));
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"slug"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate(field.name)}</FormLabel>
                      <p className="text-xs text-gray-400">{field.name}</p>

                      <FormControl>
                        <TextInput
                          propKey={field.name}
                          value={slugify(field.value ? field.value : "")}
                          setValue={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"description"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate(field.name)}</FormLabel>
                      <p className="text-xs text-gray-400">{field.name}</p>

                      <FormControl>
                        <TextAreaInput
                          propKey={field.name}
                          value={field.value}
                          setValue={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"status"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate(field.name)}</FormLabel>
                      <p className="text-xs text-gray-400">{field.name}</p>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value || 1)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={String(0)}>Draft</SelectItem>
                          <SelectItem value={String(1)}>Publish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"type_id"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate(field.name)}</FormLabel>
                      <p className="text-xs text-gray-400">{field.name}</p>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(
                          field.value ||
                            searchParams.getQueryString("type_id") ||
                            1
                        )}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {blockTypes?.map((item) => (
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

                <FormField
                  control={form.control}
                  name={"image_url"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate(field.name)}</FormLabel>
                      <p className="text-xs text-gray-400">{field.name}</p>

                      <FormControl>
                        <Suspense key={field.name} fallback={<Loading />}>
                          <ImagePickerInput
                            propKey={field.name}
                            value={field.value}
                            setValue={field.onChange}
                          />
                        </Suspense>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"background_image_url"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate(field.name)}</FormLabel>
                      <p className="text-xs text-gray-400">{field.name}</p>

                      <FormControl>
                        <Suspense key={field.name} fallback={<Loading />}>
                          <ImagePickerInput
                            propKey={field.name}
                            value={field.value}
                            setValue={field.onChange}
                          />
                        </Suspense>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </TabsContent>
        <TabsContent value="language" className="relative">
          <LanguageSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
