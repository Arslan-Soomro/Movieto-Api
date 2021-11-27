const express = require('express');
const router = express.Router();
const { validateUserData } = require('../Utils/utils');

const userModel = require('../Models/user.model');
const User = require('../Models/user.model');

//Encrypt The Password and Then Save It.

router.get('/', (req, res) => {
    res.send("Welcome To Users Route");
});

//Get All The Users
router.get('/all', async(req, res) => {
    //Get All Data
    const users = await userModel.findAll();

    //console.log(JSON.stringify(users, null, 2)); -- Formated
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

module.exports = router;
