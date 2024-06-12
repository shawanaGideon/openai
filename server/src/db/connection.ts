import { connect, disconnect } from "mongoose";

async function connectTodatabase() {
    try {
        await connect(process.env.MONGODB_URL);
    } catch(error){
        console.log(error);
        throw new Error ("Could not connect to MongoDB");
    }
}

async function disconnectFromDatabase() {
    try{
        await disconnect();
    } catch (error){
        console.log(error);
        throw new Error ("Could not disconnect from MongoDB");
    }
    
}

export { connectTodatabase, disconnectFromDatabase}
