import { prisma } from "@/libs/prisma";
import cors from "@/utils/cors";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    let res;

    const block = await prisma.block.findFirst({
      where: { slug, type_id: 14 },
    });
    const language = req.cookies.get("language")?.value || "en";
    const dataLanguage = await prisma.data_language.findFirst({
      where: { data_id: block?.id },
    });

    if (dataLanguage?.data_group && language !== dataLanguage?.language_code) {
      const languageDataLanguage = await prisma.data_language.findFirst({
        where: {
          data_group: dataLanguage?.data_group,
          language_code: language,
        },
      });
      const langBlock = await prisma.block.findFirst({
        where: { id: languageDataLanguage?.data_id },
      });

      res = new Response(JSON.stringify({ data: langBlock }), {
        status: 200,
      });
    } else {
      res = new Response(JSON.stringify({ data: block }), {
        status: 200,
      });
    }
    return cors(req, res);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: (error as any).message == null ? error : (error as any).message,
      }),
      {
        status: 500,
      }
    );
  }
}
