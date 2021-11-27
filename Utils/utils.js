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

exports.validateUserData = validateUserData;