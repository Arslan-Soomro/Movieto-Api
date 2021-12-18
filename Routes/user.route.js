require('dotenv').config({path: '../.env'});
const express = require('express');
const router = express.Router();
const { validateUserData, validateEmail, validatePass, validateName, hashEncrypt, verifyToken } = require('../Utils/utils');

const userModel = require('../Models/user.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { JWT_SECRET } = process.env;
const { USER_ATTRS } = require('../global');

router.get('/', (req, res) => {
    res.send("Welcome To Users Route");
});

//Get All The Users
/*
router.get('/all', async(req, res) => {
    //Get All Data
    const users = await userModel.findAll({attributes: USER_ATTRS});
    //Send Back All Data
    res.status(200).json(users);
})*/

//Creates a new User
router.post('/signup', async (req, res) => {
    let userData = req.body;

    try{

        //console.log(userData);
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

                        res.status(200).json({message: "Login Succesful", data: {token: accessToken}});
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

    if(req.body && req.body.token){
        try{
            let userData = {};

            let tokenData = verifyToken(req.body.token);
            //Verify Token
            if(!tokenData){
                res.status(401).json({message: 'Invalid Token'});
                return ;
            }

            let vData = await userModel.findOne({ where: { id: tokenData.id }, attributes: USER_ATTRS});
            //Basic Data Validation
            if(req.body.user_name){
                userData.user_name = req.body.user_name;
                if(userData.user_name == vData.user_name){
                    res.status(400).json({message: "Cannot update to same username"});
                    return ;
                }else if(validateName(userData.user_name)){
                    if(await userModel.findOne({where: {user_name: userData.user_name}}) != null){
                        res.status(400).json({message: 'Username Already exists'});
                        return ;
                    }
                }else{
                    res.status(400).json({message: 'Invalid Username'});
                    return ;
                }
            }   

            if(req.body.full_name){
                userData.full_name = req.body.full_name;
                if(userData.full_name == vData.full_name){
                    res.status(400).json("Cannot update to same name");
                    return ;
                }else if(!validateName(userData.full_name)){
                    res.status(400).json({message: 'Invalid Name'});
                    return ;
                }
            }

            if(req.body.email){
                userData.email = req.body.email;
                if(userData.email == vData.email){
                    res.status(400).json("Cannot update to same email");
                    return ;
                }else if(!validateEmail(userData.email)){
                    res.status(400).json({message: 'Invalid Email'});
                    return ;
                }
            }

            /* Should not update here becuase of security reasons
            if(req.body.password){
                userData.password = req.body.password;
                if(userData.password == vData.password){
                    res.status(400).json("Cannot update to same name");
                    return ;
                }else if(validatePass(user_data.password)){
                    //Encrypt password
                    userData.password = hashEncrypt(userData.password);
                }else{
                    res.status(400).json({message: 'Invalid Password'});
                    return ;
                }
            }
            */
           
            if(Object.keys(userData).length > 0){
                await userModel.update(userData, {where: { id : tokenData.id }})
                res.status(201).json({message: 'Update Succesful'});
            }else{
                res.status(400).json({message: 'Nothing to update'});
            }
        }catch(err){
            console.log('Error@Update@User: ' + err.message);
            res.status(500).json({message: "Unable to process the request"});
        }
    }else{
        res.status(400).json({message: "Bad Request"});
    }
})


router.post('/delete', async (req, res) => {
    //Verify Token
    if(req.body.token){
        try{

            const tokenData = verifyToken(req.body.token);
            if(!tokenData){
                res.status('401').json({message: 'Invalid Token'});
                return ;
            }

            await userModel.destroy({where: {id: tokenData.id}});
            res.status(201).json({message: 'User deleted Succesfully'});

        }catch(err){
            res.status(500).json({message: 'Unable to process the request'})
        }
    }else{
        res.status(400).json({message:'Token is missing'});
    }
    //Get User Id
    //Delete from database the user with given user id
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