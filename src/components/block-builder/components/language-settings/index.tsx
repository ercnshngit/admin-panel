import { useLanguage } from "@/contexts/language-context";
import { getDataLanguagesByTable, getTable } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UI from "./ui";
import { useDesigner } from "@/contexts/designer-context";
import { BlockDto } from "@/services/dto/block.dto";
import { useForm } from "react-hook-form";
import { getBlocks } from "../designer-sidebar/services";
import { Prisma } from "@prisma/client";

export default function LanguageSettings() {
  const { language } = useLanguage();
  const { data: languages } = useQuery(["languages"], () =>
    getTable({ tableName: "language" })
  );
  const { data: data_language } = useQuery(["data_language"], () =>
    getDataLanguagesByTable({
      table_name: "block",
    })
  );
  const { data: blocks } = useQuery<
    Prisma.blockGetPayload<{
      include: { type: true };
    }>[]
  >(["blocks"], () => getBlocks());
  const { block } = useDesigner();

  const pageLanguage = languages?.find((l: any) => l.code === language)?.name;

  const onSubmit = (data: any) => {
    console.log(data);
  };
  if (!languages || !data_language || !block || !blocks) {
    return null;
  }

  return (
    <UI
      data_language={data_language}
      languages={languages}
      pageLanguage={pageLanguage}
      block={block}
      blocks={blocks}
      languageCode={language}
      onSubmit={onSubmit}
    />
  );
}
