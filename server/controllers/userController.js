import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register user: /api/user/register

export const register = async (req, res) => {
    try{
    const { name, email, password } = req.body;

    if(!name  || !email  || !password){
        return res.json({success: false, message: "Please fill all the fields"});
    }

    const existingUser = await User.findOne({email: email});

    if(existingUser){
        return res.json({success: false, message: "User already exists"});
    }

     const hashedPassword = await bcryptjs.hash(password, 10);

    const user =await User.create({name, email, password: hashedPassword});

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('token', token, {
        httpOnly: true,  //prevent javascript to access cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // SameSite policy (CSRF Protection)
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

    })

    return res.json({success: true, user: {email:user.email, name: user.name}});

    }catch(error){
        console.error("Error in user registration:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}


//Login User: /api/user/login

export const login = async (req, res) => {
    try{

        const { email, password } = req.body;

        if(!email || !password){
            return res.json({success: false, message: "Please fill all the fields"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.json({success: false, message: "Invalid email or password"});
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: "Invalid email or password"});
        }

         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
 
         res.cookie('token', token, {
        httpOnly: true,  //prevent javascript to access cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // SameSite policy (CSRF Protection)
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

        })

        return res.json({success: true, user: {email:user.email, name: user.name}});



    }catch(error){
        console.error("Error in user login:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}


//check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
    try{
        const { userId } = req;
        const user = await User.findById(userId).select('-password');
        return res.json({success: true, user});

    }catch(error){
        console.error("Error in isAuth:", error.message);
        return res.status(500).json({success: false, message: error.message});// Return the error message from the catch block
    }
}


//Logout User: /api/user/logout

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,  //prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // SameSite policy (CSRF Protection)
            maxAge: 0 // Set maxAge to 0 to delete the cookie
        });
        return res.json({success: true, message: "User logged out successfully"});

    }catch(error){
        console.error("Error in user logout:", error);
        return res.status(500).json({success: false, message: error.message});// Return the error message from the catch block
    }
}