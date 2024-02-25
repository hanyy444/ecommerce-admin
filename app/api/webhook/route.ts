import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get(
    "Stripe-Signature"
  ) as string;

  let event: Stripe.Event;

  console.log('Web Hook Run')

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(
      `WebHook Error: ${error.message}`,
      {
        status: 400,
      }
    );
  }

  const session = event.data
    .object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents
    .filter((c) => c !== null)
    .join(", ");

  if (event.type === "checkout.session.completed") {
    if (!session?.metadata?.orderItems) {
      return new NextResponse("Order items are required", {
        status: 400,
      });
    }

    const orderItemsArr: {
      productId: string;
      quantity: number;
    }[] = Array.from(
      JSON.parse(session?.metadata?.orderItems)
    );

    if (!session?.metadata?.storeId) {
      return new NextResponse("Store Id is required", {
        status: 400,
      });
    }

    const order = await prismadb.order.create({
      data: {
        id: session?.metadata?.orderId,
        storeId: session?.metadata?.storeId,
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
        totalPrice: Number(session?.metadata?.totalPrice),
        orderItems: {
          create: orderItemsArr.map(
            (orderItem: {
              productId: string;
              quantity: number;
            }) => ({
              product: {
                connect: {
                  id: orderItem.productId,
                },
              },
              quantity: orderItem.quantity,
            })
          ),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log("An order is created.");

    const orderItems = order.orderItems.map(
      (orderItem) => ({
        productId: orderItem.productId,
        quantity: orderItem.quantity,
      })
    );

    for (const orderItem of orderItems) {
      const product = await prismadb.product.findUnique({
        where: { id: orderItem.productId },
      });

      if (product) {
        // TODO: concurrency??
        const newStock = Math.max(
          product.stock - orderItem.quantity,
          0
        );

        await prismadb.product.update({
          where: {
            id: orderItem.productId,
          },
          data: {
            stock: newStock,
            isArchived: newStock === 0,
          },
        });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
