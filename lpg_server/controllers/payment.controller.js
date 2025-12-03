import razorpayInstance from "../config/razorpay.js";
import Payment from "../models/Payment.model.js";
import crypto from "crypto";

export const createRazorpayOrder = async (req,res) => {
    const { amount } = req.body;
    if(!amount || amount <= 0){
        return res.status(400).json({ message: "Invalid amount" });
    }

    try {
        const amountInPaise = Math.round(amount * 100); // Convert to paise
        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`, 
            notes: {
                userId: req.user.id,
                purpose: "LPG premium subscription"
            }
        }

        const order = await razorpayInstance.orders.create(options);

        const newPayment = new Payment({
            userId: req.user.id,
            amount: amountInPaise,
            razorpayOrderId: order.id,
        })

        await newPayment.save();

        return res.status(201).json({
            message: "Razorpay order created successfully",
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            dbOrderId: newPayment._id
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const verifyRazorpayPayment = async (req,res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if(!razorpayOrderId || !razorpayPaymentId || !razorpaySignature){
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
        const generatedSignature = hmac.digest('hex');

        if(generatedSignature !== razorpaySignature){
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Update payment status in DB
        const paymentRecord = await Payment.findOne({ razorpayOrderId });
        if(!paymentRecord){
            return res.status(404).json({ message: "Payment record not found" });
        }

        paymentRecord.razorpayPaymentId = razorpayPaymentId;
        paymentRecord.razorpaySignature = razorpaySignature;
        paymentRecord.status = 'successful';
        await paymentRecord.save();

        const user = await User.findById(paymentRecord.userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        user.isPremium = true;
        await user.save();

        return res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const webhookHandler = async (req,res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    if(!signature){
        return res.status(400).json({ message: "Missing signature" });
    }
    const body = req.body;
    if(!body){
        return res.status(400).json({ message: "Missing body" });
    }

    try {
        // generate expected signature
        const hmac = crypto.createHmac('sha256', webhookSecret);
        hmac.update(body);
        const expectedSignature = hmac.digest('hex');

        if(expectedSignature !== signature){
            return res.status(400).json({ message: "Invalid signature" });
        }

        const payload = JSON.parse(body);
        // Handle different event types
        const event = payload.event;
        const entity = payload.payload?.payment?.entity || payload.payload?.order?.entity;

        if(event === 'payment.captured' || event === 'payment.authorized'){
            const razorpayOrderId = entity.order_id;
            const razorpayPaymentId = entity.id;
            const razorpaySignature = signature; // In webhook, we don't get signature like in client-side verification

            // Update payment status in DB
            const paymentRecord = await Payment.findOneAndUpdate(
                {razorpayOrderId},
                {
                    razorpayPaymentId,
                    razorpaySignature,
                    status: 'successful'
                },
                { new: true }
            );

            if(!paymentRecord){
                return res.status(404).json({ message: "Payment record not found" });
            }

            const user = await User.findById(paymentRecord.userId);
            if(!user){
                return res.status(404).json({ message: "User not found" });
            }

            user.isPremium = true;
            await user.save();

            paymentRecord.populate('userId');

            return res.status(200).json({ message: "Webhook processed: Payment successful" }, paymentRecord);
        }

        return res.status(200).json({ message: "Webhook received: No action taken" });
    } catch (error) {
        return res.status(500).json({ message: "error while validating webhook signature", error: error.message });
    }
}