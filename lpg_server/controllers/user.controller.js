import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// password validation function
// min length 8, at least one uppercase, one lowercase, one digit, one special character
/* const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const isPasswordValid = (password) => {
    return passwordRegex.test(password);
} */

//signup controller
export const signup = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const userWithEmail = await User.findOne({email});
        if(userWithEmail){
            return res.status(400).json({message: "User with this email already exists"});
        }

        const userWithUsername = await User.findOne({username});
        if(userWithUsername){
            return res.status(400).json({message: "Username is already taken"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email, 
            password : hashedPassword
        });

        const savedUser = await newUser.save().select('-password');
        const token = jwt.sign(
            {id: savedUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        }

        res
        .cookie('token', token, options)
        .status(201)
        .json({
            message: 'User registered successfully',
            user: savedUser,
        });
    } catch (error) {
        res.status(500).json({message: 'Something went wrong while creating user', error: error.message});
    }
}