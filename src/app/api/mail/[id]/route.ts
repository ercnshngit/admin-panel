import { MailService } from "@/services/mail.service";
import cors from "@/utils/cors";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const body = await req.json();
  const id = Number(params.id);
  const service = new MailService(req);
  try {
    await service.securiyCheck();
    const res = await service.updateMail({ id, body });
    return cors(req, res);
  } catch (error) {
    return await service.createLogAndResolveError(error);
  }
}
