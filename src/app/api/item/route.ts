import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import type { Item } from "@/types/item";

const getItems = unstable_cache(
    async () => {
        return prisma.item.findMany({
            orderBy: {
                rarity: "desc",
            },
        });
    },
    ["items"],
    {
        revalidate: 86400,
    }
);

/**
 * @openapi
 * @response Item
 */

export async function GET() {
    try {
        const items = await getItems();

        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch items" },
            { status: 500 }
        );
    }
}