"use server";

import { prisma } from "@/database/db";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/generated/prisma/enums";
import { stripe } from "@/lib/stripe";
import { createOrder } from "@/server-actions/order/order.user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  console.log("A Request is came:", body, "Signature:", signature);

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  // construct stripe webhook with signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Signature Error:", error);
    return NextResponse.json({ error: "Invalid signature!" }, { status: 400 });
  }

  // check if the payment was successful
  try {
    console.log("Event type:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.payment_status !== "paid") break;

        const metadata = session.metadata;

        if (!metadata) throw new Error("Missing metadata!");
        if (metadata.appName !== "Fashion")
          throw new Error("Invalid application metadata!");

        // prevent duplicate
        const orderExists = await prisma.order.findUnique({
          where: {
            stripeSessionId: session.id,
          },
        });

        if (orderExists) break;

        await createOrder({
          userId: metadata.userId,
          paymentMethod: PaymentMethod.STRIPE,
          paymentStatus: PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
          stripeSessionId: session.id,
          shippingAddress: JSON.parse(metadata.shippingAddress),
          cartItems: JSON.parse(metadata.cartItems),
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Error!" }, { status: 500 });
  }
}
