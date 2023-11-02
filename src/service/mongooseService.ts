import mongoose from "mongoose";


let count = 1;

const connectWithRetry = async () => {
    const url = `${process.env.MONGODB_URI}`;
    console.log('MongoDB connection with retry')
    return mongoose.connect(url).then(()=>{
        console.log('MongoDB is connected')
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. '+err, ++count);
        setTimeout(connectWithRetry, 5000)        
    })
};
export {connectWithRetry,mongoose}