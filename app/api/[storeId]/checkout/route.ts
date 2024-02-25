import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import ObjectId from "bson-objectid";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { orderItems } = await req.json();

  if (!orderItems || orderItems.length === 0) {
    return new NextResponse("Order items are required", {
      status: 400,
    });
  }

  if(!params.storeId){
    return new NextResponse("Store Id is required", {
      status: 400,
    });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    [];

  // TODO: handle order, product quanity and stock
  let totalPrice = 0;
  
  for (const orderItem of orderItems) {
    const product = await prismadb.product.findUnique({
      where: { id: orderItem.productId },
    });

    if (!product) {
      return new NextResponse("Invalid product id.", {
        status: 400,
      });
    }

    if (product.stock < orderItem.quanity) {
      return new NextResponse("Stock is limited.", {
        status: 400,
      });
    }

    const price = Number(
      product.price * orderItem.quantity
    );

    line_items.push({
      quantity: orderItem.quantity,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
    });

    totalPrice += price;
  }

  const orderId = new ObjectId().toHexString();

  try {
    const sessions = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: orderId,
        storeId: params.storeId,
        totalPrice,
        orderItems: JSON.stringify(orderItems)
      },
    });

    // await prismadb.order.create({
    //   data: {
    //     id: orderId,
    //     storeId: params.storeId,
    //     isPaid: false,
    //     totalPrice,
    //     orderItems: {
    //       // NOTE: ??
    //       create: orderItems.map(
    //         (orderItem: {
    //           productId: string;
    //           quantity: number;
    //         }) => ({
    //           product: {
    //             connect: {
    //               id: orderItem.productId,
    //             },
    //           },
    //           quantity: orderItem.quantity,
    //         })
    //       ),
    //     },
    //   },
    // });

    return NextResponse.json(
      { url: sessions.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log("[STORE_CHECKOUT]", error);
    return new NextResponse("INTERNAL ERROR!", {
      status: 500,
    });
  }
}
