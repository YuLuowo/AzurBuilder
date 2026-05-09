import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { RouteParams } from "@/types/params";
import { ShipTransform } from "@/types/ship";

const getShipTransform = (name: string) =>
    unstable_cache(
        async () => {
            return prisma.shipTransform.findFirst({
                where: {
                    shipName: name,
                },
            });
        },
        ["ship-transform", name],
        {
            tags: [`ship-transform-${name}`],
            revalidate: 86400,
        }
    )();

/**
 * @openapi
 * @response ShipTransform
 * @pathParams { name: string }
 */

export async function GET(request: Request, context: { params: Promise<RouteParams<"name">> }) {
    try {
        const { name } = await context.params;
        const transform = await getShipTransform(name);

        if (!transform) {
            return NextResponse.json(
                { message: "Ship not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(transform);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch transform" },
            { status: 500 }
        );
    }
}