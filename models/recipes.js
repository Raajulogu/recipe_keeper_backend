import mongoose from 'mongoose';

let {ObjectId}=mongoose.Schema;
let recipeSchema=new mongoose.Schema(
    {
        recipename:{
            type:String,
            required:true
        },
        ingredients:{
            type:Array,
            default:[]
        },
        instructions:{
            type:String,
            required:true
        },
        cookingtime:{
            type:Number,
            required:true
        },
        rating:{
            type:Array,
            default:[0,0]
        },
        image:{
            type:String,
            required:true
        },
        date:{
            type:String,
            default:Date.now()
        },
        comments:{
            type:Array,
            default:[]
        },
        type:{
            type:String,
            required:true
        },
        tags:{
            type:Array,
            default:[]
        },
        user:{
            type:String,
            required:true
        }
    }
);

let Recipe = mongoose.model("recipe", recipeSchema);
export { Recipe};