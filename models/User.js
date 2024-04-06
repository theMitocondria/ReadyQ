import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  
   
    username:{
        type:"String",
        required: true,
    }, 

    password:{
        type:"String",
        required:true,
        min : [6, "password must be atleast 6 characters size long."]
    },

    contestRating:{
        type : Number,
        default : 0
    }, 

    allContests:[
        {type : Number}
    ],
    passKeys:[{
        type:Number
    }],

    githubQuestions:[
        {
            type:"String",
        }
    ], 

    githubAnswers:[
        {
            type : "String",
        }
    ]


    
})

export default mongoose.model("User", UserSchema);