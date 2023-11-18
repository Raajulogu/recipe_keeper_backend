import mongoose from "mongoose";

export function dbconnection(){
    const params={
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.connect("mongodb+srv://rajesh:rajesh145@cluster0.563jw0h.mongodb.net/Recipe_Keeper?retryWrites=true&w=majority",params);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting DB ---", error);
    }
}