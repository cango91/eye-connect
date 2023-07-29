const EventEmitter = require('events');
const uuid = require('uuid').v4;

class EventService extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
        this.promiseResolvers = {};
    }
    async emitEvent(eventName, data) {
        setImmediate(() => {
            this.emit(eventName, data);
        });
    }

    async emitEventWithResponse(eventName, eventData) {
        if(!this.listenerCount(eventName)) throw new Error('No listeners');
        const correlationId = uuid();
        const promise = new Promise((resolve, reject) => {
            this.promiseResolvers[correlationId] = { resolve, reject };
        });
        this.emit(eventName, { correlationId, eventData });
        return promise;
    }

    handleEventResponse(eventName, responseData){
        const {correlationId, success, failure} = responseData;
        const promiseResolver = this.promiseResolvers[correlationId];
        if(promiseResolver){
            if(success){
                promiseResolver.resolve();
            }else{
                promiseResolver.reject(failure);
            }
            delete this.promiseResolvers[correlationId];
        }
    }


}

module.exports = new EventService();