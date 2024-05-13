import { axiosFileClient, axiosMailClient } from "@/libs/axios";
import { prisma } from "@/libs/prisma";
import { createTableItem } from "@/services/common-table-api";
import { MailService } from "@/services/mail.service";
import { uploadMediaToServer } from "@/services/media";
import cors from "@/utils/cors";
import { Prisma, contact, cv, education_attendee } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// const limiter = rateLimit({
//   interval: 60 * 1000, // 60 seconds
//   uniqueTokenPerInterval: 500, // Max 500 users per second
// });

export async function POST(req: NextRequest, response: NextResponse) {
  const service = new MailService(req);
  try {
    // await limiter.check(response, 10, "CACHE_TOKEN"); // 10 requests per minute

    const body = (await req.json()) as
      | (cv & { form_slug: "cv" })
      | contact
      | (education_attendee & { form_slug: string });

    const response = await service.sendMail({ body });

    return cors(req, response);
  } catch (error) {
    console.log(error);
    return await service.createLogAndResolveError(error);
  }
}
