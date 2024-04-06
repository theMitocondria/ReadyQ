import User from "../models/User.js";

export const register = async(req, res) =>{
    try{
        
        const {username, password} = req.body;
       
        const usernameFound = await User.findOne({username});

       
        if(!username || !password ){
            return res.status(400).json({
                message:"fields cannot be empty"
            })
        }
        
        if(usernameFound){
            return res.status(400).json({
                message:"username already exists"
            })
        }


        var passKeys = [];
        for(let i = 0; i < 2; i++){
            let otp = Math.ceil(Math.random() * 1000);
         
            while(otp<1000){
                otp+=1000;
            }

            passKeys.push(otp);
        }


        const usr = await User.create({
            username, password, passKeys
        });

        console.log(username, password);
          
        await usr.save();

        console.log(username, password);

        return res.status(200).json({
            message:"user created success",
            success: true,
            Notification: "please save this passkey in case you forget your password.",
            usr,
        })

    }catch(e){

        return res.status(500).json({
            message : e.message,
            success : false,
        })
    }
}

export const signIn = async(req, res) =>{
    try{
        
        const {username, password} = req.body;

        if(!username || !password ){
            return res.status(400).json({
                message:"fields cannot be empty"
            })
        }
    
        const user = await User.findOne({username, password});

    
        if(!user){
            return res.status(400).json({
                message:"username or password is incorrect"
            })
        }

        res.status(200).json({
            message: "login sucess",
            success: true,
            user
        })

    }catch(e){

        return res.status(500).json({
            message : e.message,
            success : false,
        })
    }
}

export const forgetPass = async(req, res) =>{
    try{
        
        const {username, password, newpassword} = req.body;

        if(!username || !password || !newpassword){
            return res.status(400).json({
                message:"fields cannot be empty"
            })
        }
        
        const userNow = await User.findOne({username});
        console.log(userNow);

        for(let i = 0 ; i < 2 ; i++){
            if(password == userNow.passKeys[i]){
                await User.findOneAndUpdate({username}, {password : password})
                res.status(200).json({
                    message: "password reset sucessfully",
                    success: true,
                    userNow
                })
            }
        }
      
        
        return res.status(400).json({
            message:"PassKey or username is incorrect"
        })
                
    }catch(e){

        return res.status(500).json({
            message : e.message,
            success : false,
        })
    }
}