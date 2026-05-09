import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Ship } from "@/types/ship";
import { RouteParams } from "@/types/params";

const getShip = (name: string) =>
    unstable_cache(
        async () => {
            return prisma.ship.findFirst({
                where: {
                    name,
                },
            });
        },
        ["ship", name],
        {
            tags: [`ship-${name}`],
            revalidate: 86400,
        }
    )();

/**
 * @openapi
 * @response Ship
 * @pathParams { name: string }
 */

export async function GET(request: Request, context: { params: Promise<RouteParams<"name">> }) {
    try {
        const { name } = await context.params;
        const ship = await getShip(name);

        if (!ship) {
            return NextResponse.json(
                { message: "Ship not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(ship);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch ship" },
            { status: 500 }
        );
    }
}