import { CartItem } from "@/lib/types/cart.types";

type ShippingAddress = {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
};

// Cart → Order payload
const buildOrderPayload = (
    items: CartItem[],
    shippingAddress: ShippingAddress,
) => {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return {
        items: items.map((item) => ({
            productItemId: item.id,
            price: item.price,
            total: item.price * item.quantity,
        })),
        shippingAddress,
        subtotal,
        total: subtotal,
        paymentMethod: "Bkash",
    };
};
