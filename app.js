const { response } = require('express');
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');

const Role = require('./middleware/role');
const User  = require('./model/user');
const vaccineCenter = require('./model/vaccinationCenter');

require("dotenv").config(); 
require("./config/database").connect();

app.use(express.json());
app.use(cookieParser()); 

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Vaccination Slot Booking System!!");
})

app.post("/register", async (req, res) => {
    try {
     const {email, password, number, role} = req.body;
 
     if(!(email && password)){
         res.status(400).send("All fields are required");
     }
 
     const existingUser = await User.findOne({email});
 
     if(existingUser){
         res.status(401).send("User is already registered");
     }
 
     const myEncPassword = await bcrypt.hash(password, 10)
     
     const user  = await User.create({
         email: email.toLowerCase(),
         password: myEncPassword,
         number,
         role,
     });
 
     const token = jwt.sign(
         {user_id: user._id, email},
         process.env.SECRET_KEY, 
         {
             expiresIn: "2h"
         }
     )
     user.token = token;
 
     user.password = undefined
 
     
     res.status(201).json(user)
 
    }catch(error) {
        console.log(error);
    }
 
 });
 
 app.post("/login", async(req, res) => {
     try{
         const {email, password, role} = req.body
 
         if(!(email && password && role)){
             res.status(400).send("Field is missing")
         }
 
         const user = await User.findOne({email})
 
         if(!user){
             res.status(400).send("You are not registered in our app")
         }
 
         if(user && (await bcrypt.compare(password, user.password))){
             const token = jwt.sign(
                 {user_id: user._id, email},
                 process.env.SECRET_KEY,
                 {
                     expiresIn: "2h"
                 }
             )
             user.token = token;
             user.password = undefined;
             // res.status(200).json(user)
 
             // if you want to use cookies
             const options = {
                 expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                 httpOnly: true,
             };
             res.status(200).cookie('token', token, options).json(
                 {
                     success: true,
                     token,
                     user
                 }
             )
         }
 
     
         res.send(400).send("email or password is incorrect")
 
     }catch(error){
         console.log(error);
     }
 });


 app.post("/addVaccinationCenter", Role.roleAccess, async(req, res) => {
    try{
        const {name, number, slots} = req.body;

        const center = await vaccineCenter.create({
            name,
            number,
            slots
        })

        console.log("Vaccination Center added successfully!")

    }catch(error){
        console.log(error);
    }
 })

 app.get('/getDetails', Role.roleAccess, async(req, res) => {
    const center = await vaccineCenter.find({});
    res.json(center);
 })

 app.delete('/:id/delete', Role.roleAccess, async(req, res) => {
    const center = await vaccineCenter.findById(req.params.id);
    await center.remove();
    console.log("Vaccination Center deleted successfully!");
 })
 
app.put('/apply/:id', async (req, res) => {
    const center = await vaccineCenter.findById(req.params.id);
    if (center) {
        center.slots = center.slots - req.body.slots;
    }

    const updatedCenter = await center.save();
    console.log("Slot Booked");
})

app.get('/vaccinationCenterById/:id', async (req, res) => {
    const center = await vaccineCenter.findById(req.params.id);
    res.json(center);
})

module.exports = app;

