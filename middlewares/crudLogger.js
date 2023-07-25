const CRUDLog = require('../models/log');

const crudLogger = (action, paramsFn = ()=>({})) => {
    return async (req,res,next) => {
        try {
            let actionString = action;
            const params = paramsFn(req);
            if(Object.keys(params).length){
                actionString += "\nparams:\n";
                for(const key in params){
                    actionString += `${key}: ${params[key]}\n`;
                }
            }
            await CRUDLog.create({action: actionString,userId: req.user.id});
            next();
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

module.exports = crudLogger;