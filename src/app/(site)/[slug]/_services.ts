import { prisma } from "@/libs/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
export const getBlocks = async () => {
  const type = await prisma.type.findFirst({
    where: { name: "Page" },
  });
  const data = await prisma.block.findMany({
    where: { type_id: type?.id },
  });
  return data;
};

export const getBlockComponentsBySlug = async (block_slug: string) => {
  const block = await prisma.block.findFirst({
    where: { slug: block_slug },
  });

  if (!block) return [];

  const type = await prisma.type.findFirst({
    where: { name: "Page" },
  });
  if (!type) return [];

  const blockComponent = await prisma.block_component.findMany({
    where: {
      block: {
        slug: block_slug,
        type_id: type.id,
      },
    },
    include: {
      component: {
        include: {
          tag: true,
          type: true,
        },
      },
      block: true,
      block_component_prop: {
        include: {
          prop: { include: { type: true } },
        },
      },
    },
  });

  const result = blockComponent.map((item) => {
    const block_component_prop = item.block_component_prop.map((propItem) => {
      return { prop: propItem.prop, value: propItem.value };
    });
    return {
      component: item.component,
      block: item.block,
      belong_block_component_code: item.belong_block_component_code,
      depth: item.depth,
      order: item.order,
      code: item.code,
      hasChildren: item.hasChildren,
      props: block_component_prop,
    };
  });

  return result;
};
