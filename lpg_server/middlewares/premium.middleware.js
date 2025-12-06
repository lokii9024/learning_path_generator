import {User} from "../models/User.model.js";

export const premiumMiddleware = async (req, res, next) => {
    if(req.user && !req.user.isPremium){
        return res.status(403).json({ message: "Access denied. Premium membership required." });
    }
    //check if premium membership is expired (1 month validity)
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    if(req.user && req.user.premiumSince){
        const premiumExpiry = req.user.premiumSince + oneMonthInMs;
        if(now > premiumExpiry){
            const user = await User.findByIdAndUpdate(req.user._id,{
                isPremium: false,
                premiumSince: null
            },{ new: true });
            req.user = user; //update req.user
            return res.status(403).json({ message: "Access denied. Premium membership has expired." });
        }
    }
    next();
}

// Optional middleware to allow both premium and non-premium users
export const premiumMiddlewareOptional = async (req, res, next) => {
    if(req.user && req.user.isPremium){
        //check if premium membership is expired (1 month validity)
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        if(req.user.premiumSince){
            const premiumExpiry = req.user.premiumSince + oneMonthInMs;
            if(now > premiumExpiry){
                const user = await User.findByIdAndUpdate(req.user._id,{
                    isPremium: false,
                    premiumSince: null
                },{ new: true });
                req.user = user; //update req.user
            }
        }
    }
    next();
}