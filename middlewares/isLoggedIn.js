import User from "../models/User.js";

const isLoggedIn = async (req,res,next) =>{
    const {token}=req.headers;
    console.log(token);
    if(!token){
        res.status(401).json({
            success:false,
            message:"please login first"
        });
    }else{
        const user = await User.findOne({token});
        if(!user){
           return  res.status(404).json({
                success:false,
                message:"unauthorizzed"
            });
        }

        next();
    }
}

export default isLoggedIn;