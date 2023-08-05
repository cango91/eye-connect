// middleware to change status of notification from New to Acknowledged for a user
const userService = require('../services/usersService');

module.exports = async (req,res,next) =>{
    try {
        if(req.user){
            if(req.params?.id){
                await userService.acknowledgeNotificationForUser(req.user.id,req.params.id);
                res.locals.user.notifications = await userService.getNotificationsOfUser(req.user.id);
            }
        }
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
}