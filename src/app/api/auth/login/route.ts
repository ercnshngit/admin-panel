import { AuthService } from "@/services/auth/auth.service";
import cors from "@/utils/cors";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: This can be used to login a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request, body is null
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: object
 *                   properties:
 *                     TR:
 *                       type: string
 *                     EN:
 *                       type: string
 *         examples:
 *           WrongPassword:
 *             value:
 *               status: "error"
 *               message:
 *                 TR: "Girdiğiniz şifre yanlış."
 *                 EN: "The password you entered is incorrect."
 */
export async function POST(request: NextRequest) {
  const service = new AuthService(request);
  try {
    await service.securiyCheck();
    const body = await request.json();
    if (body == null) {
      return cors(
        request,
        new Response(
          JSON.stringify({ status: "error", message: "body is null" }),
          {
            status: 400,
          }
        )
      );
    }
    return cors(request, await service.login(body, false));
  } catch (error: any) {
    return await service.createLogAndResolveError(error);
  }
}

export async function OPTIONS(request: Request) {
  return cors(
    request,
    new Response(null, {
      status: 204,
    })
  );
}
