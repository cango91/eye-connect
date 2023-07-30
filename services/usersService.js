/*
UsersService provides the following benefits:
+ Provide decoupling from db implementation
+ Keep controller relatively concise and clean (since our user signup flow is complicated)
 */
const cryptoService = require('./cryptoService');
const User = require('../models/user');

const initialLocalSignUp = async userData => {
    try {
        // Manually ensure uniqueness because we will circumvent mongoose schema enforcements
        if (! (await isEmailUnique(userData.email))) throw new Error('Email in use');
        // Enforce e-mail is not empty. Further validation can be added here, but since we are not actually
        // sending out an e-mail to verify it in MVP, we can treat it like a simple username
        if (!!!userData.email) throw new Error('Email is required!');
        // Enforce at least 3 characters in displayName, doesn't have to be unique
        if (!!!userData.displayName || userData.displayName.length <3) throw new Error('Display Name must be at least 3 characters long');
        // Enforce strong password
        if (!isStrongPassword(userData.password)) throw new Error('Weak password not allowed');
        const hashedPassword = await new Promise((resolve, reject) => {
            cryptoService.hashPassword(userData.password, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        // Create a new user with the hashed password and incomplete profile
        const user = new User({
            displayName: userData.displayName,
            email: userData.email,
            password: hashedPassword,
            validationStatus: 'Incomplete',
        });

        await user.save({validateBeforeSave:false});
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const initialOAuthSignUp = async userData => {
    try {
        if (!await isEmailUnique(userData.email)) throw new Error('Email in use');
        if (!!!userData.googleId) throw new Error('GoogleId not provided');
        // Create a new user with info returned from Google
        const user = new User({
            displayName: userData.displayName,
            email: userData.email,
            validationStatus: 'Incomplete',
            googleId: userData.googleId,
        });
        await user.save({validateBeforeSave:false});
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }

}

const completeProfile = async userData => {
    try {
        const user = await User.findById(userData.id);
        if (!user) throw new Error('User not found');
        if (!userData.name || !userData.institution || !userData.role) throw new Error('Missing personal data');
        if (userData.role === 'MedicalDirector') throw new Error('Medical Director role can not be assigned. Please contact your IT Department to be registered as director');
        if (!userData.role in ['FieldHCP','SpecialistHCP']) throw new Error('Invalid user role');
        user.name = userData.name;
        user.institution = userData.institution;
        user.role = userData.role
        user.validationStatus = 'PendingValidation';
        user.additionalInfo = userData.additionalInfo;
        await user.save({validateBeforeSave: true});
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const validateUser = async userId =>{
    try {
        const user = await User.findById(userId);
        if(!user) throw new Error('User not found');
        user.validationStatus = 'Validated';
        await user.save();
        return user;
    } catch (err) {
        console.error(err);
    }
}

const rejectUser = async user =>{
    try {
        const user = await User.findById(userId);
        if(!user) throw new Error('User not found');
        user.validationStatus = 'ValidationFailed';
        await user.save();
        return user;
    } catch (err) {
        console.error(err);
    }
}

const revokeUser = async user =>{
    try {
        const user = await User.findById(userId);
        if(!user) throw new Error('User not found');
        user.validationStatus = 'ValidationRevoked';
        await user.save();
        return user;
    } catch (err) {
        console.error(err);        
    }
}

const getUserById = async id => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (err) {
        console.error(err);
    }
}

const isEmailUnique = async email => {
    try {
        const user = await User.findOne({ email: email });
        return user ? false : true;
    } catch (err) {
        console.error(err);
    }
}

const isStrongPassword = password => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
}

const getUserByGoogleId = async googleId => {
    try {
        const user = await User.findOne({ googleId: googleId });
        return user;
    } catch (err) {
        console.error(err);
    }
}

const getUserByEmail = async email => {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (err) {
        console.error(err);
    }
}

const verifyUser = async (user, password) => {
    try {
        return await new Promise((resolve, reject) => {
            cryptoService.verifyPassword(password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const notifyUser = async (userId, notification) =>{
    try {
        const user = await User.findById(userId);
        if(!user) throw new Error('User not found');
        await user.updateOne({$push: {'notifications': notification}});
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    initialOAuthSignUp,
    initialLocalSignUp,
    verifyUser,
    completeProfile,
    getUserById,
    getUserByGoogleId,
    getUserByEmail,
    isEmailUnique,
    isStrongPassword,
    validateUser,
    notifyUser,
};