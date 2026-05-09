import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { RouteParams } from "@/types/params";
import type { ShipSkill } from "@/types/ship";

const getShipSkill = (name: string) =>
    unstable_cache(
        async () => {
            return prisma.shipSkill.findFirst({
                where: {
                    shipName: name,
                },
            });
        },
        ["ship-skill", name],
        {
            tags: [`ship-skill-${name}`],
            revalidate: 86400,
        }
    )();

/**
 * @openapi
 * @response ShipSkill
 * @pathParams { name: string }
 */

export async function GET(request: Request, context: { params: Promise<RouteParams<"name">> }) {
    try {
        const { name } = await context.params;
        const skill = await getShipSkill(name);

        if (!skill) {
            return NextResponse.json(
                { message: "Ship not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(skill);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch skill" },
            { status: 500 }
        );
    }
}