const express = require('express');
const router = express.Router();
const { validateUserData, hashEncrypt } = require('../Utils/utils');

const userModel = require('../Models/user.model');

const db = require('../Utils/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const { USER_ATTRS } = require('../global');

//TODO Users should be able to update their data

router.get('/', (req, res) => {
    res.send("Welcome To Users Route");
});

//Get All The Users
router.get('/all', async(req, res) => {
    //Get All Data
    const users = await userModel.findAll({attributes: USER_ATTRS});
    //Send Back All Data
    res.status(200).json(users);
})

//Creates a new User
router.post('/signup', async (req, res) => {
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

router.post('/login', async (req, res) => {
    if(req.body){
        try{

            let userData;

            if(req.body.token){
                
                let tokenData = verifyToken(req.body.token);

                if(!tokenData){
                    res.status(401).json({message: "Invalid Token"});
                    return ;
                }

                //Return Back Data
                userData = await userModel.findOne({ where: { id: tokenData.id }, attributes: USER_ATTRS});
                res.status(200).json({message: "Token Autheticated, Access Granted", data: userData});
                return ;
                

            //User should submit a username and password
            }else if(req.body.user_name && req.body.password){
                userData = await userModel.findOne({where: { user_name: req.body.user_name}});

                if(userData){//User with such username exists
                    //Compare passwords
                    if(await bcrypt.compare(req.body.password, userData.password)){
                        //Generate JWT Token,Expires in 24 hours
                        const accessToken = jwt.sign({id: userData.id, user_name: userData.user_name}, JWT_SECRET, {expiresIn: '24h'});

                        res.json({message: "Login Succesful", data: {token: accessToken}});
                        return ;
                    }
                }
            }
            //If username and password doesn't match
            res.status(400).json({message: "Invalid Username or Password"});
        }catch(err){
            console.log("Error@login@user: " + err.message);
            res.status(500).json({message: "Unable to process the request"})
        }
    }
});

router.post('/update', async (req, res) => {
    //Update a user's details
    //Verify the token
    //Validate the received data
    //Pick out attributes that are sent for updation
    //Update that user in database
    if(req.body){
        try{
            let userData = {};
            if(req.body.token){
                if('user_name' in req.body){
                    userData.user_name = req.body.user_name;
                }
                if('full_name' in req.body){
                    userData.full_name = req.body.full_name;
                }
                if('email' in req.body){
                    userData.email = req.body.email;
                }
                if('password' in req.body){
                    userData.password = req.body.password;
                }
            }
            if(Object.keys(userData).length > 0){
                res.status(200).json({message: 'Attributes Received'});
            }else{
                res.status(400).json({message: 'No Attributes Received'});
            }
        }catch(err){

        }
    }else{

    }
})



router.get('/destroy', async (req, res) => {
    /*
    try{
        
    }catch(err){
        console.log("Error, " + err.message);
    }*/
    res.status(200).json({message: "This Route is no longer available"});
})

module.exports = router;