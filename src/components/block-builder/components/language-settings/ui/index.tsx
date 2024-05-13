"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslate } from "@/langs";
import { cn } from "@/libs/utils";
import { BlockDto } from "@/services/dto/block.dto";
import { DataLanguageDto } from "@/services/dto/data_language.dto";
import { LanguageDto } from "@/services/dto/language.dto";
import {
  UpdateDataLanguage,
  useDataLanguageMutation,
} from "@/utils/use-data-language";
import { Prisma } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function UI({
  languages,
  languageCode,
  block,
  blocks,
  onSubmit,
  data_language,
  pageLanguage,
}: {
  languages: LanguageDto[];
  languageCode: string;
  block: BlockDto;
  blocks: Prisma.blockGetPayload<{
    include: { type: true };
  }>[];
  data_language: DataLanguageDto[];
  onSubmit: any;
  pageLanguage: string;
}) {
  const { translate } = useTranslate();
  const [value, setValue] = React.useState<{
    label: string;
    value: number;
  } | null>(null);
  const [open, setOpen] = React.useState(false);

  const { dataLanguageMutation } = useDataLanguageMutation({
    table_name: "block",
  });
  const queryClient = useQueryClient();
  const handleDataLangGroupChange = (data: UpdateDataLanguage) => {
    console.log(data);
    dataLanguageMutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Language</h1>
      <Label>Bu sayfanin dili:</Label>
      {pageLanguage}

      {languages
        .filter((l) => l.code !== languageCode)
        .map((language) => {
          return (
            <>
              <Label>{translate(language.name)} sayfayı ayarla:</Label>
              <p className="text-xs text-gray-400">{language.name}</p>

              <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("w-full justify-between")}
                    >
                      {value?.label || "Select block"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                      />
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup className=" h-60 overflow-y-scroll">
                        {blocks?.map((b) => (
                          <CommandItem
                            value={b.title}
                            key={b.id}
                            onSelect={() => {
                              setValue({ label: b.title, value: b.id });
                              setOpen(false);
                            }}
                          >
                            {b.title}
                            <span className="ml-2 font-bold text-sm">
                              {b.type?.name}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={() => {
                    if (value?.value) {
                      handleDataLangGroupChange({
                        data_id: value.value,
                        language_code: language.code,
                        from_data_id: block.id,
                        from_data_language_code: languageCode,
                        data_group:
                          data_language.find((d) => d.data_id === block.id)
                            ?.data_group || "",
                      });
                    }
                  }}
                >
                  <span>Kaydet</span>
                </Button>
              </div>
            </>
          );
        })}

      <Label>Tüm diller:</Label>
      {languages.map((language) => (
        <div key={language.code} className="">
          <Label>{language.name}</Label>

          {blocks
            ?.filter((b) =>
              data_language
                ?.filter(
                  (d) =>
                    d.language_code === language.code &&
                    d.data_group ===
                      data_language.find((d) => d.data_id === block.id)
                        ?.data_group
                )
                ?.map((d) => d.data_id)
                ?.includes(b.id)
            )
            .map((b) => (
              <Link
                className="bg-gray-100 block py-1 px-2 rounded-xl"
                href={"/dashboard/block/" + b.id + "/update"}
                key={b.id}
              >
                {b.title}
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
}
