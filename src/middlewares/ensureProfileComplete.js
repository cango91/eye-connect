const usersService = require('../services/usersService');


const ensureProfileComplete = async(req,res,next)=>{
    try{
        const user = await usersService.getUserById(req.user.id);
        if(user.validationStatus === 'Incomplete'){
            return res.redirect('/portal/signup');
        }
    }catch(err){
        next(err);
    }
}

module.exports = ensureProfileComplete;