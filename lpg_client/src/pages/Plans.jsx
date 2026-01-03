// src/pages/Plans.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import razpyLoader from "@/utils/razpyLoader.js";

export default function Plans() {

    const handlePayment = async () => {
        // Load Razorpay script
        const loaded = await razpyLoader();
        if(!loaded){
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // create order on the server
        const mockOrder = {
            id: "order_9A33XWu170gUtm",
            amount: 49900, // amount in paise
            currency: "INR",
        };

        // Razorpay payment options
        const options = {
            key: "rzp_test_1DP5mmOlF5G5ag", // Enter the Key ID generated from the Dashboard
            amount: mockOrder.amount,
            currency: mockOrder.currency,
            name: "Polaris Learning",
            description: "Premium Plan Purchase", 
            order_id: mockOrder.id,
            handler: function (response) {
                alert("Payment Successful!");
            },
            prefill: {
                name: "John Doe",
                email: "john@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Polaris Learning Corporate Office",
            },
            theme: {
                color: "#1A535C",
            },
        };

        // Open Razorpay payment window
        const rzp = new window.Razorpay(options);
        rzp.open();
    }
  return (
    <div className="min-h-screen bg-[#F7F9F9] flex items-center justify-center px-6">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-semibold text-center text-[#2D3436] mb-10">
          Choose your Polaris plan
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-2">Free</h2>
              <p className="text-sm text-gray-600 mb-6">
                For exploring curated learning paths
              </p>

              <ul className="space-y-3 text-sm mb-6">
                <li>✔ Community learning paths</li>
                <li>✔ Limited AI generation</li>
                <li>✔ YouTube & GitHub resources</li>
              </ul>

              <Button variant="outline" className="w-full">
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="rounded-2xl shadow-md border border-[#F7B801]">
            <CardContent className="p-8">
              <Badge className="mb-3 bg-[#F7B801] text-black">
                Most Popular
              </Badge>

              <h2 className="text-xl font-semibold mb-2">Premium</h2>
              <p className="text-sm text-gray-600 mb-4">
                Personalized AI-powered learning
              </p>

              <div className="text-3xl font-bold mb-6 text-[#1A535C]">
                ₹499
                <span className="text-sm font-normal text-gray-500">
                  {" "}one-time
                </span>
              </div>

              <ul className="space-y-3 text-sm mb-8">
                <li>✔ Unlimited AI-generated paths</li>
                <li>✔ Advanced recommendations</li>
                <li>✔ Priority updates</li>
              </ul>

              <Button
                onClick={() => handlePayment()}
                className="cursor-pointer w-full bg-[#1A535C] hover:bg-[#163f45]"
              >
                Unlock Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
