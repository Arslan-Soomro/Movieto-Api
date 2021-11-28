const express = require('express');
const router = express.Router();
const { validateUserData, hashEncrypt } = require('../Utils/utils');

const userModel = require('../Models/user.model');
const db = require('../Utils/database');

//Let the user login

router.get('/', (req, res) => {
    res.send("Welcome To Users Route");
});

//Get All The Users
router.get('/all', async(req, res) => {
    //Get All Data
    const users = await userModel.findAll();
    //Send Back All Data
    res.status(200).json(users);
})

//Creates a new User
router.post('/', async (req, res) => {
    let userData = req.body;

    try{
        //Performs Basic Validation on User Data
        const  validationResult = validateUserData(userData);

        if(validationResult.isValid){
            //Encrypt Password
            userData.password = await hashEncrypt(userData.password);

            // creates a new user if a user with same username doesn't exist already
            const [newUser, created] = await userModel.findOrCreate({
                where: { user_name: userData.user_name },
                defaults : userData,
            });
            
            if(created){
                res.status(201).json({message: "New User Created Succesfully"});
            }else{
                res.status(400).json({message: "Username already exists"});
            }

        }else{
            res.status(400).json({message: validationResult.message});
        }

    }catch(err){
        console.log("Error: " + err.message);
        res.status(500).json({message: 'Unable to Processs The Request'});
    }
});

router.get('/destroy', async (req, res) => {
    /*
    try{
        
    }catch(err){
        console.log("Error, " + err.message);
    }*/
    res.status(200).json({message: "This Route is no longer available"});
})

module.exports = router;