import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RouteParams } from "@/types/params";
import type { Item } from "@/types/item";

const getItem = (id: number) =>
    unstable_cache(
        async () => {
            return prisma.item.findFirst({
                where: {
                    id,
                },
            });
        },
        ["item", String(id)],
        {
            tags: [`item-${id}`],
            revalidate: 86400,
        }
    )();

/**
 * @openapi
 * @response Item
 * @pathParams { id: string }
 */

export async function GET(request: Request, context: { params: Promise<RouteParams<"id">> }) {
    try {
        const { id } = await context.params;

        if (isNaN(Number(id))) {
            return NextResponse.json(
                { message: "Invalid item id" },
                { status: 400 }
            );
        }

        const item = await getItem(Number(id));

        if (!item) {
            return NextResponse.json(
                { message: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch Item" },
            { status: 500 }
        );
    }
}