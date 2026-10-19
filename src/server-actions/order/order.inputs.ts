import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/generated/prisma/enums";

export interface CreateOrderInput {
  userId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status?: OrderStatus;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    street: string;
    state: string;
  };
  cartItems: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[];
  stripeSessionId?: string | null;
}

export interface StripeCheckoutSessionInput {
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    street: string;
    state: string;
  };
  cartItems: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[];
}

export interface PlaceOrderInput extends StripeCheckoutSessionInput {
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderStatusInput {
  orderId: number;
  status: OrderStatus;
}
