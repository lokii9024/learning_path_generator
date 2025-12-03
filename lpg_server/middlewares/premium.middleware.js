export const premiumMiddleware = (req, res, next) => {
    if(req.user && !req.user.isPremium){
        return res.status(403).json({ message: "Access denied. Premium membership required." });
    }
    next();
}