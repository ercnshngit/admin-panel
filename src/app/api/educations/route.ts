import { prisma } from "@/libs/prisma";
import { ComponentService } from "@/services/component.service";
import cors from "@/utils/cors";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  try {
    const data = await prisma.planned_education.findMany({
      include: {
        education: {
          include: {
            education_instructor: {
              include: {
                instructor: true,
              },
            },
          },
        },
      },
    });

    const response = new Response(JSON.stringify(data), { status: 200 });
    return cors(req, response);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
