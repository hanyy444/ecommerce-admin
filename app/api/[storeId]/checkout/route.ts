import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400"
}

export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });;
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}
){
    const { productIds } = await req.json()

    if(!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 })
    }

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach(product => {
        line_items.push({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: product.name
                },
                unit_amount: Number(product.price) * 100
            }
        })
    })

    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                // NOTE: ??
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: {
                            id: productId
                        }
                    }
                }))
            }
        }
    })

    const sessions = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
            orderId: order.id
        }        
    })

    return NextResponse.json({ url: sessions.url }, {
        headers: corsHeaders
    })

}