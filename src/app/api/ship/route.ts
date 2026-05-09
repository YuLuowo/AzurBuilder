import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import type { Ship } from "@/types/ship";

const getShips = unstable_cache(
    async () => {
        return prisma.ship.findMany({
            orderBy: {
                rarity: "desc",
            },
        });
    },
    ["ships"],
    {
        revalidate: 86400,
    }
);

/**
 * @openapi
 * @response Ship
 */

export async function GET() {
    try {
        const ships = await getShips();

        return NextResponse.json(ships);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch ships" },
            { status: 500 }
        );
    }
}