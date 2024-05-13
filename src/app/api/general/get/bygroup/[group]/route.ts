import { GeneralService } from "@/services/general.service";
import cors from "@/utils/cors";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { group: string } }
) {
  const service = new GeneralService(req);
  try {
    await service.securiyCheck();
    const response = await service.getGeneralsByGroup(params.group);
    return cors(req, response);
  } catch (error) {
    return await service.createLogAndResolveError(error);
  }
}
