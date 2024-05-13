import { BlockService } from "@/services/block.service";
import cors from "@/utils/cors";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
/**
 * @swagger
 * /api/block/{id}:
 *   get:
 *     summary: Get block by ID
 *     description: This can be used to get a block by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The block ID.
 *     responses:
 *       200:
 *         description: Block retrieved successfully
 *       400:
 *         description: Bad request
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = params.id;
  const service = new BlockService(request);
  try {
    await service.securiyCheck();
    const response = await service.getBlock(id);
    return cors(request, response);
  } catch (error) {
    return await service.createLogAndResolveError(error);
  }
}
/**
 * @swagger
 * /api/block/{id}:
 *   post:
 *     summary: Update block by ID
 *     description: This can be used to update a block by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The block ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Add the properties of the block object here
 *     responses:
 *       200:
 *         description: Block updated successfully
 *       400:
 *         description: Bad request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = params.id;
  const service = new BlockService(request);
  try {
    await service.securiyCheck();
    const body = await request.json();
    const response = await service.updateBlock(Number(id), body);
    return cors(request, response);
  } catch (error) {
    return await service.createLogAndResolveError(error);
  }
}
