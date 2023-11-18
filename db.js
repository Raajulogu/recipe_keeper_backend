import mongoose from "mongoose";

export function dbconnection(){
    const params={
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/recipe_keeper",params);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting DB ---", error);
    }
}