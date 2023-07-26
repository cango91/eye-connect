const EventEmitter = require('events');

class EventService extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
    }
    async emitEvent(eventName, data) {
        setImmediate(() => {
            this.emit(eventName, data);
        });
    }
}

module.exports = new EventService();