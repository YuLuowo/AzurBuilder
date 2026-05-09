import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import type { Equipment } from "@/types/equipment";

const getEquipments = unstable_cache(
    async () => {
        return prisma.equipment.findMany({
            orderBy: {
                rarity: "desc",
            },
        });
    },
    ["equipments"],
    {
        revalidate: 86400,
    }
);

/**
 * @openapi
 * @response Equipment
 */

export async function GET() {
    try {
        const equipments = await getEquipments();

        return NextResponse.json(equipments);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch equipments" },
            { status: 500 }
        );
    }
}