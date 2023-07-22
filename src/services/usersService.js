const cryptoService = require('./cryptoService');
const User = require('../models/user');

const initialLocalSignUp = async userData => {
    try {

        // Manually ensure uniqueness because we will circumvent mongoose schema enforcements
        if (!isEmailUnique(userData.email)) throw new Error('Email in use');
        // if (!isUsernameAvailable(userData.username)) throw new Error('Username already taken');
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

        user.validateBeforeSave = false;

        await user.save();
        return user;

    } catch (err) {
        console.error(err);
    }
}

const initialOAuthSignUp = async userData => {
    try {
        if (!isEmailUnique(userData.email)) throw new Error('Email in use');
        // if (!isUsernameAvailable(userData.username)) throw new Error('Username already taken');
        if (!!!userData.googleId) throw new Error('GoogleId not provided');

        // Create a new user with info returned from Google
        const user = new User({
            displayName: userData.displayName,
            email: userData.email,
            validationStatus: 'Incomplete',
        });

        user.validateBeforeSave = false;

        await user.save();
        return user;

    } catch (err) {
        console.error(err);
    }

}

const completeProfile = async userData => {
    try {
        const user = await User.findById(userData._id);
        if(!user) throw new Error('User not found');
        if(!userData.name || !userData.institution ||!userData.role) throw new Error('Missing personal data');
        user.name = userData.name;
        user.institution = userData.institution;
        user.role = userData.role
        user.validationStatus = 'PendingValidation';
        user.additionalInfo = userData.additionalInfo;
        user.validateBeforeSave = true;
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

// const isUsernameAvailable = async username => {
//     try {
//         const user = await User.find({ username: username });
//         return !!!user
//     } catch (err) {
//         console.error(err);
//     }
// }

const isEmailUnique = async email => {
    try {
        const user = await User.find({ email: email });
        return !!!user
    } catch (err) {
        console.error(err);
    }
}

const isStrongPassword = password => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
}

module.exports = {
    initialOAuthSignUp,
    initialLocalSignUp,
    completeProfile,
    getUserById,
    // isUsernameAvailable,
    isEmailUnique,
    isStrongPassword,
};