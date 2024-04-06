import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id :{
        type : "String"
    },
    username:{
        type:"String",
        required: true,
    }, 
    password:{
        type:"String",
        required:true,
        min : [6, "password must be atleast 6 characters size long."]
    },
    Bio:{
        type : "String",
        required : true

    },
     contestRating:{
        type : Number,
        default : 0
    }, 
    allContests:[
        {type : Number, 
        default : 0}
    ],
    passKeys:[{
        type:Number
    }],
    token : {
        type : "String",
    }
    
}, {
    timestamps : true
})


UserSchema.pre('save', async function(next){
    
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10)
    }
    next(); 

})

UserSchema.method('matchPassword', async function(givenPassword) {
    return  bcrypt.compare(givenPassword, this?.password);
})

export default mongoose.model("User", UserSchema);