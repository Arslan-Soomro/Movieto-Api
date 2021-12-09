const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const validateEmail = (email) => {
    const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

const validateName = (name) => (name.length > 1);

const validatePassword = (pass) => pass.length >= 8;

const validateUserData = (uData) => {
    if(uData){
        if(uData.full_name && uData.user_name && uData.password && uData.email){
            if(uData.full_name.length > 1){
                const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(emailRegex.test(uData.email)){
                    if(uData.password.length >= 8){
                        if(uData.user_name.length > 1){
                            return ({message: 'All Entries are filled properly', isValid: true})
                        }else{
                            return ({message: 'User name must contain more than 8 characters', isValid: false })
                        }
                    }else{
                        return ({message: 'Password must contain more than 8 characters', isValid: false});
                    }
                }else{
                    return ({message: "Invalid Email Address", isValid: false});
                }
            }else{
                return ({message: 'Full name must contain more than 1', isValid: false});
            }
        }else{
            return ({message: 'One of the entries is missing.', isValid: false})
        }
    }
    return ({message: 'User Data not Provided', isValid: false});
}

const hashEncrypt = async (strToEncrypt) => {
    const saltRounds = 10;
    const encryptedStr = await bcrypt.hash(strToEncrypt, saltRounds);
    return encryptedStr;
}

const formatDate = (dateStr) => {
    //Pass in a date String

    //Create a date object
    let oldDate = new Date(dateStr);

    let monthSeperator = '-';
    let dateSeperator = '-';

    if(oldDate.getMonth()+1 < 10){// +1 because month returns 0-11 number
        monthSeperator = '-0';
    }

    if(oldDate.getDate() < 10){
        dateSeperator = '-0';
    }
    
    return oldDate.getFullYear() + monthSeperator + (oldDate.getMonth()+1) + dateSeperator + oldDate.getDate();
}

const formatMD = (data) => {
    data.forEach((item, ind) => {
        item.name = item.title;
        delete item.title;
        item.url = item.link;
        delete item.link;
        item.img_url = item.imgSrc;
        delete item.imgSrc;
        item.launch_date = formatDate(item.date);//Convert into valid date format
        delete item.date;
    })
};

const verifyToken = (token) => {
    try{
        const data = jwt.verify(token, JWT_SECRET);
        console.log(data);
        return data;
    }catch(err){
        console.log("Error@TokenAuthentication: " + err.message);  
    }
    return null;
}

exports.validateUserData = validateUserData;
exports.hashEncrypt = hashEncrypt;
exports.formatDate = formatDate;
exports.formatMD = formatMD;
exports.verifyToken = verifyToken;