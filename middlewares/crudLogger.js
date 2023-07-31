const CRUDLog = require('../models/log');
const DO_NOT_LOG = ['email','password','notes','image'];
const User = require('../models/user');

const crudLogger = (action, paramsFn = () => ({})) => {
    return async (req, res, next) => {
        try {
            let actionString = req.user.id ? (await User.findById(req.user.id)).name + ':' : 'SYSTEM:';
            actionString += action;
            const params = paramsFn(req);
            if (Object.keys(params).length) {
                actionString += "\nparams:\n";
                for (const key in params) {
                    if(DO_NOT_LOG.includes(key)) continue;
                    actionString += `${key}: ${params[key]}\n`;
                }
            }
            
            try {
                const log = new CRUDLog({ action: actionString, userId: req.user.id });
                await log.save({ validateBeforeSave: false });
                next();
            } catch (error) {
                console.log(error);
                res.redirect('/portal/home');
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

module.exports = crudLogger;