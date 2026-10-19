"use server";

import { prisma } from "@/database/db";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/generated/prisma/enums";
import {
  CreateOrderInput,
  PlaceOrderInput,
  StripeCheckoutSessionInput,
} from "./order.inputs";
import { getCurrentUser } from "../auth/getCurrentClient";
import { stripe } from "@/lib/stripe";

/**
 * Function that generates random order IDs
 *
 * @returns Generate Order ID
 */
function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `ORD-${year}-${random}`;
}

/**
 * Function that fetches the products by their IDs
 *
 * @param cartItems List of items that should be Ordered
 * @returns List of the specific Products
 */
async function findProductsByIds(
  cartItems: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[],
) {
  const productIds = [...new Set(cartItems.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products no longer available!");
  }

  return products;
}

/**
 * Function that create a new order
 *
 * @param data order data
 * @returns the created order
 */
export async function createOrder(data: CreateOrderInput) {
  const products = await findProductsByIds(data.cartItems);

  let subtotal = 0;

  const orderItems = data.cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) throw new Error("Product not found!");
    if (product.stock < item.quantity)
      throw new Error(`${product.name} is out of stock!`);

    const price = Number(product.price);

    subtotal += price * item.quantity;

    return {
      productId: product.id,
      quantity: item.quantity,
      price,
      size: item.size,
      color: item.color,
    };
  });

  const shipping = 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const order = await prisma.$transaction(async (tx) => {
    let address = await tx.address.findFirst({
      where: { userId: data.userId, isDefault: true },
    });

    if (!address) {
      address = await tx.address.create({
        data: {
          firstName: data.shippingAddress.firstName,
          lastName: data.shippingAddress.lastName,
          phone: data.shippingAddress.phone,
          street: data.shippingAddress.street,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          country: data.shippingAddress.country,
          userId: data.userId,
          isDefault: true,
        },
      });
    }

    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        stripeSessionId: data.stripeSessionId,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        status: data.status ?? OrderStatus.PENDING,
        addressId: address.id,
        userId: data.userId,
        items: {
          create: orderItems,
        },
      },
    });

    return createdOrder;
  });

  return order;
}

/**
 * Function that places user's order
 *
 * @param data Order data
 * @returns the operation result { success: boolean, message: string }
 */
export async function placeOrder(data: PlaceOrderInput) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "Please login first!",
      };
    }

    // create order
    const order = await createOrder({
      userId: currentUser.id,
      paymentMethod: data.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      shippingAddress: data.shippingAddress,
      cartItems: data.cartItems,
    });

    return {
      success: true,
      orderNumber: order.orderNumber,
      message: "Order placed successfully",
    };
  } catch (error) {
    console.error("Error while placing an order:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to place order!",
    };
  }
}

/**
 * Function that creates Stripe Checkout Session.
 *
 * @returns the operation result { success: boolean, message: string }
 */
export async function createStripeCheckoutSession(
  data: StripeCheckoutSessionInput,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "Please login first!",
      };
    }

    if (data.cartItems.length === 0) {
      return {
        success: false,
        message: "Your cart is empty!",
      };
    }

    const products = await findProductsByIds(data.cartItems);

    let subtotal = 0;
    const lineItems = data.cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error("Product not found!");
      if (product.stock < item.quantity)
        throw new Error(`${product.name} is out of stock!`);

      const price = Number(product.price);
      subtotal += price * item.quantity;

      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: product.name,
          },
        },
      };
    });

    const tax = subtotal * 0.05;
    const stripeLineItems = [
      ...lineItems,
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(tax * 100),
          product_data: {
            name: "Tax",
          },
        },
      },
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/checkout`,
      metadata: {
        appName: "Fashion",
        userId: currentUser.id,
        shippingAddress: JSON.stringify(data.shippingAddress),
        cartItems: JSON.stringify(data.cartItems),
      },
    });

    await createOrder({
      cartItems: data.cartItems,
      paymentMethod: PaymentMethod.STRIPE,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: data.shippingAddress,
      userId: currentUser.id,
      status: "PENDING",
      stripeSessionId: session.id,
    });

    return {
      success: true,
      url: session.url,
    };
  } catch (error) {
    console.error(
      "Error occurred during the creation of stripe checkout session:",
      error,
    );

    return {
      success: false,
      message: "Unable to create a stripe checkout session!",
    };
  }
}

/**
 * Function that fetches the order using its session ID
 *
 * @param sessionId string session ID
 * @returns order
 */
export async function getOrderByStripeSessionId(stripeSessionId: string) {
  const order = await prisma.order.findUnique({
    where: { stripeSessionId },
    select: { id: true, orderNumber: true },
  });

  console.log("Order found:", order);

  return order;
}

/**
 * Function that fetches the orders.
 *
 * @returns List of orders
 */
export async function getOrders() {
  try {
    const user = await getCurrentUser();

    if (!user) return [];

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        createAt: true,
        subtotal: true,
        shipping: true,
        tax: true,
        total: true,
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                images: {
                  select: {
                    imageUrl: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createAt,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      tax: Number(order.tax),
      total: Number(order.total),
      totalItems: order.items.reduce((total, item) => total + item.quantity, 0),
      image: order.items[0]?.product.images[0]?.imageUrl ?? "",
    }));
  } catch (error) {
    console.log("Error occurred while fetching the orders:", error);
    return [];
  }
}

/**
 * Function that fetches an order using its number.
 *
 * @param orderNumber The order number
 * @returns A specific order using its number
 */
export async function getOrder(orderNumber: string) {
  try {
    const user = await getCurrentUser();

    if (!user) return null;

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
        userId: user.id,
      },
      include: {
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) return null;

    const {
      address,
      items,
      subtotal,
      shipping,
      tax,
      total,
      createAt,
      ...rest
    } = order;

    return {
      ...rest,
      createdAt: createAt,
      subtotal: Number(subtotal),
      shipping: Number(shipping),
      tax: Number(tax),
      total: Number(total),
      address,
      items: items.map(({ product, price, ...item }) => ({
        ...item,
        name: product.name,
        image: product.images[0]?.imageUrl ?? "",
        price: Number(price),
      })),
    };
  } catch (error) {
    console.log("Error occurred while fetching an order using its ID:", error);
    return null;
  }
}
