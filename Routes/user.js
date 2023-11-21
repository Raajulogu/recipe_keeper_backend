import express from 'express';
import bcrypt from 'bcrypt';
import { User, generateJwtToken } from '../models/user.js';

let router =express.Router();

//SignUp
router.post("/signup", async(req,res)=>{
    try {
        //Find User is already exist
        let user=await User.findOne({email:req.body.email});
        if(user) return res.status(400).json({message:"Email already exist"});

        //genaerate hashed password
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(req.body.password,salt);
        //new user updation
        user = await new User({
            name:req.body.name,
            email:req.body.email,
            contact:req.body.contact,
            password:hashedPassword
        }).save();

        //generate token
        let token = generateJwtToken(user._id);
        res.status(201).json({message:"SignUp Successfully", token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
        
    }
})

//Login
router.post("/login", async(req,res)=>{
    try {
        //Find user is available
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"})

        //Validate password
        let validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if(!validatePassword) return res.status(400).json({message:"Invalid Credentials"})
        //generating token
        let token = generateJwtToken(user._id);
        res.status(201).json({message:"Logged in Successfully",token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

//Add a favourites
router.put("/favourite",async(req,res)=>{
    try {
        let recipe=req.body.val.id;
        let email=req.body.val.email;
        //find the User
        let val = await User.findOne({email:email});
        let fav=[...val.favourites]
        fav.push(recipe);
        //Adding the Favourite to the DB
        let addFavourit = await User.findOneAndUpdate(
            { email: email },
            { $set:{favourites: fav} }
        );
        res.status(200).json({message:"Favourite Recipe added Successfully",data:addFavourit});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
})

// Add the Favourite to the DB
router.put("/get-favourites", async(req,res)=>{
    try {
        //Find user is available
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"})

        let data=user.favourites
        res.status(201).json({message:"Logged in Successfully",data});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

//Reset Password
router.put("/reset",async(req,res)=>{
    try {
        //generate hashed password
        let salt=await bcrypt.genSalt(10);
        let hashedPassword=await bcrypt.hash(req.body.password,salt);
        let user=await User.findOneAndUpdate(
            {email:req.body.email},
            {$set:{password:hashedPassword}},
            {new:true}
        );
       
        res.status(201).json({message:"Password Updated Successfully"});
    } catch (error) {
        console.log("Error",error)
        res.status(500).json({message:"Internal Server Error"})
    }
})


export const userRouter = router;