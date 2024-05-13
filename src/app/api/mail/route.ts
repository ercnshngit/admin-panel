import { MailService } from "@/services/mail.service";
import cors from "@/utils/cors";
import { contact, cv, education_attendee } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, response: NextResponse) {
  const service = new MailService(req);
  try {
    const response = await service.getMails();

    return cors(req, response);
  } catch (error) {
    console.log(error);
    return await service.createLogAndResolveError(error);
  }
}
