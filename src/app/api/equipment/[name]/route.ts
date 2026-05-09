import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RouteParams } from "@/types/params";
import type { Equipment } from "@/types/equipment";

const getEquipment = (name: string) =>
    unstable_cache(
        async () => {
            return prisma.equipment.findFirst({
                where: {
                    name,
                },
            });
        },
        ["equipment", name],
        {
            tags: [`equipment-${name}`],
            revalidate: 86400,
        }
    )();

/**
 * @openapi
 * @response Equipment
 * @pathParams { name: string }
 */

export async function GET(request: Request, context: { params: Promise<RouteParams<"name">> }) {
    try {
        const { name } = await context.params;
        const equipment = await getEquipment(name);

        if (!equipment) {
            return NextResponse.json(
                { message: "Equipment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(equipment);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch Equipment" },
            { status: 500 }
        );
    }
}