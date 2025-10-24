import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.token || req.header['authorization']?.replace('Bearer ', '');

    if(!token){
        console.log("No token provided");
        return res.status(401).json({message: 'Access Denied. No token provided.'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({message: 'Invalid token. User not found.'});
        }

        req.user = user
        next();
    } catch (error) {
        res.status(400).json({message: 'Invalid token.'});
    }
}