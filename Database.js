import mongoose, { connect } from "mongoose";

const Database = async () => {
    try{
    mongoose.set('strictQuery', true);
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongo database is connected!!! ${connect.connection.host} `)
    }catch(e){
        console.log(e);
       }
}

export default Database;