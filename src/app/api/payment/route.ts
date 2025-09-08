
import { NextResponse } from "next/server";
import { z } from "zod";

// This is a mocked Rezopay client. In a real-world scenario, you would
// import and use the official Rezopay Node.js SDK here.
// e.g., import Rezopay from 'rezopay';
const rezopay = {
  orders: {
    create: async (options: { amount: number, currency: string, receipt: string }) => {
      // Mocking the SDK call
      return Promise.resolve({
        id: `order_${Math.random().toString(36).substring(7)}`,
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created',
        attempts: 0,
        notes: [],
        created_at: Date.now() / 1000
      });
    }
  }
};


const createOrderSchema = z.object({
    amount: z.number().positive("Amount must be a positive number."),
});


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount } = createOrderSchema.parse(body);
        
        const options = {
            amount: amount * 100, // Amount in the smallest currency unit (e.g., paise for INR)
            currency: "INR",
            receipt: `receipt_order_${Math.random().toString(36).substring(7)}`
        };

        // In a real application, you would initialize the Rezopay client with your keys
        // const rzp = new Rezopay({
        //     key_id: process.env.NEXT_PUBLIC_REZOPAY_KEY_ID!,
        //     key_secret: process.env.REZOPAY_KEY_SECRET!,
        // });
        // const order = await rzp.orders.create(options);

        // Using the mocked client for this example
        const order = await rezopay.orders.create(options);

        if (!order) {
            return NextResponse.json({ error: "Order creation failed." }, { status: 500 });
        }
        
        return NextResponse.json(order, { status: 200 });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
        }
        console.error("Rezopay API Error:", error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
