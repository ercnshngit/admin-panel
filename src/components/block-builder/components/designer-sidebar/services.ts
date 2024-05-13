"use server";
import { prisma } from "@/libs/prisma";

export const getBlocks = async () => {
  const data = await prisma.block.findMany({
    include: {
      type: true,
    },
  });
  return data;
};
