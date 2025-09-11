import jwt from 'jsonwebtoken';

//Login Seller : /api/seller/login

export const sellerLogin =async (req, res) => {
   try {

     const { email, password } = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){

        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({success: true, message: "Seller logged in successfully"});
}else{
        return res.json({success: false, message: "Invalid email or password"});
    }

   }catch (error) {
       console.error("Error in seller login:", error.message);
       return res.status(500).json({success: false, message: error.message});
   }
}


//isSellerAuth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
    try{
        return res.json({success: true});

    }catch(error){
        console.error("Error in isSellerAuth:", error.message);
        return res.status(500).json({success: false, message: error.message});// Return the error message from the catch block
    }
}



//Logout seller: /api/seller/logout

export const SellerLogout = async (req, res) => {
    try{
        res.clearCookie('sellerToken', {
            httpOnly: true,  //prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // SameSite policy (CSRF Protection)
        });
        return res.json({success: true, message: "Seller logged out successfully"});

    }catch(error){
        console.error("Error in user logout:", error);
        return res.status(500).json({success: false, message: error.message});// Return the error message from the catch block
    }
}