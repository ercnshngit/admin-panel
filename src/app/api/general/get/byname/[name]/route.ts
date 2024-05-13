import { GeneralService } from "@/services/general.service";
import cors from "@/utils/cors";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const service = new GeneralService(req);
  try {
    await service.securiyCheck();
    const response = await service.getGeneralsByName(params.name);
    return cors(req, response);
  } catch (error) {
    return await service.createLogAndResolveError(error);
  }
}
