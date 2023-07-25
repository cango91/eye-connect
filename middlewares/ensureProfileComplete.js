// Middleware to ensure an authenticated user's validation status is not 'Incomplete'
// Redirects to signup if 'Incomplete'
const usersService = require('../services/usersService');

const ensureProfileComplete = async(req,res,next)=>{
    try{
        const user = await usersService.getUserById(req.user.id);
        if(user.validationStatus === 'Incomplete'){
            return res.redirect('/portal/signup');
        }
        return next();
    }catch(err){
        next(err);
    }
}

module.exports = ensureProfileComplete;