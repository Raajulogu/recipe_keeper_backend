import express from 'express';
import { Recipe } from '../models/recipes.js';


let router = express.Router();

//Find all Recipe
router.get("/get-all",async (req,res)=>{
    try {
        let data = await Recipe.find()
        //Check data is Available
        if(!data) return res.status(400).json({message:"Data Unavailable"});
        let temp=[];
        let temprec=[];
        let tempval
        for(let i=0; i<data.length; i++){
            if(!temp.includes(data[i].type.toLowerCase())){
                tempval=data[i].type.toLowerCase();
                temp.push(tempval)
                temprec.push([]);
            }
            temprec[temp.indexOf(tempval)].push(data[i])
        }
        let rec={
            temp,temprec,data
        }
        res.status(200).json({
            message:"Successfully got Data",
            data:rec
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})

//Find Recipe by user
router.post("/user-recipes", async (req, res) => {
    try {
        let data = await Recipe.find({ user: req.body.email })
        //Check data is Available
        if (!data) return res.status(400).json({ message: "No Data Found" })
        console.log(data);
        res.status(200).json({ message: "Sucessfully got your data", data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

//Get a particular Recipe
router.get("/recipe-by-id", async (req, res) => {
    try {
        let data = await Recipe
            .find({ _id: req.body.id })
        //Check data is Available
        if (!data) {
            return res.status(400).json({ message: "Couldn't find any Document" })
        }
        res.status(200).json({ message: "Sucessfully got your data", data:data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

//Adding a Recipe
router.post("/post-recipe", async (req, res) => {
    try {
        let postedDate = new Date().toJSON().slice(0, 10);
        let data = await new Recipe(
            {
                ...req.body,
                date: postedDate
            }
        ).save()
        //Check data is Available
        if (!data) {
            return res.status(400).json({ message: "Error in posting a Recipe" })
        }
        res.status(200).json({ message: "Recipe Posted Successfully", data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

//Add a Comment
router.put("/comment/:id", async (req, res) => {
    try {
        let id=req.params.id
        let data = await Recipe.find({_id:id})
        let comment=data[0].comments
        comment.push(req.body.comment)
        
        let addComment = await Recipe.findOneAndUpdate(
            { _id: id },
            { $set:{comments: comment} }
        );
        if (!addComment) {
            return res
                .status(400)
                .json({ message: "Error Occured" })
        }
        res.status(200).json({ message: "Comment Posted Sucessfully", data: addComment })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

//Edit Recipe
router.put("/editrecipe", async (req, res) => {
    try {
        let id=req.body.id;
        let rec=req.body.rec;
        const editRecipe = await Recipe.findOneAndUpdate(
            { _id: id },
            { $set:{
                recipename:rec.recipename,
                ingredients:rec.ingredients,
                instructions:rec.instructions,
                cookingtime:rec.cookingtime,
                image:rec.image,
                type:rec.type,
                tags:rec.tags,
                user:rec.user
            } }
        );
        console.log(rec.cookingtime);
        console.log(rec);
        if (!editRecipe) {
            return res.status(400).json({ message: "Error in Editing" })
        }
        res.status(200).json({ message: "Recipe Edited Successfully", data: editRecipe })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

//Rating
router.put("/ratings", async (req, res) => {
    try {
        let id=req.body.data.id;
        let rating=req.body.data.rating
        let recipe = await Recipe.find({ _id:id })
        let val=recipe[0].rating[0];
        let count=recipe[0].rating[1];
        //Calculation for Overall Rating
        val*=count;
        count++;
        val+=rating
        val=val/count;
        //Ratings and no of rating stored in newRating 
        let newRating=[val,count]
        const addRating = await Recipe.findOneAndUpdate(
            { _id: id },
            { $set:{rating: newRating} }
        );
        if (!addRating) {
            return res.status(400).json({ message: "Error in Rating" })
        }
        res.status(200).json({ message: "Rating added Successfully", data: addRating })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

//Delete a Recipe
router.delete("/delete-recipe/:id", async(req,res)=>{
    try {
        let id=req.params.id
        console.log(id);
        let recipe= await Recipe.findByIdAndDelete({_id:id})
        
        res.status(201).json({message:"Deleted in Successfully",recipe})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

export const recipeRouter = router;