const uuid = require('uuid').v4;
const eventService = require('./eventService');

class ResourceLockService {
    static hasAutoResponse = false;
    static correlationIdHandleDict = {};
    static lockDict = {}
    static shouldRespondDict = {}
    static resourceLocatorDict = {}
    static onLockDict = {}
    static onReleaseDict = {}

    static isLocked = (handle, id) => ResourceLockService.lockDict[handle].has(id);

    static lockResource = (handle, id) => {
        if (!ResourceLockService.lockDict[handle])
            ResourceLockService.lockDict[handle] = new Set();
        ResourceLockService.lockDict[handle].add(id);
    }
    static unlockResource = (handle, id) => ResourceLockService.lockDict[handle].delete(id);

    static autoRespond = (handle, shouldRespondCb, resourceLocatorCb, onLockCb, onReleaseCb) => {
        ResourceLockService.shouldRespondDict[handle] = shouldRespondCb;
        ResourceLockService.resourceLocatorDict[handle] = resourceLocatorCb;
        // ResourceLockService.onLockCb[handle] = onLockCb;
        // ResourceLockService.onLockCb[handle] = onReleaseCb;
        ResourceLockService.startListening();
    }

    static stopAutoRespond = (handle) => {
        ResourceLockService.shouldRespondDict[handle] = null;
        ResourceLockService.resourceLocatorDict[handle] = null;
        ResourceLockService.stopListening();
    }

    static stopListening = () => {
        if (Object.keys(this.shouldRespondDict).length) return;
        eventService.off('resourceLockRequest', ResourceLockService.onResourceLockRequest);
        eventService.off('resourceLockRelease', ResourceLockService.onResourceRelease);
        ResourceLockService.hasAutoResponse = false;
    }

    static startListening = () => {
        if (ResourceLockService.hasAutoResponse) return;
        eventService.on('resourceLockRequest', ResourceLockService.onResourceLockRequest);
        eventService.on('resourceLockRelease', ResourceLockService.onResourceRelease);
        ResourceLockService.hasAutoResponse = true;
    }

    static onResourceLockRequest = async ({ correlationId, eventData }) => {
        for (let key in ResourceLockService.shouldRespondDict) {
            if (ResourceLockService.shouldRespondDict[key](eventData)) {
                try {
                    const resourceId = await ResourceLockService.resourceLocatorDict[key]({
                        eventData,
                        releaseRequest: false,
                        lockedIds: ResourceLockService.lockDict[key]
                    });
                    if (!resourceId && !(typeof resourceId === 'number' && resourceId === 0)) throw new ResourceNotFound();
                } catch (error) {
                    eventService.handleEventResponse('resourceLockRequest', { failure: error });
                    throw error;
                }

                if (!ResourceLockService.isLocked(key, resourceId)) {
                    ResourceLockService.lockResource(key, resourceId);
                }
                eventService.handleEventResponse('resourceLockRequest', { success: true });
                if (!ResourceLockService.correlationIdHandleDict[key][resourceId]) {
                    ResourceLockService.correlationIdHandleDict[key][resourceId] = new Set();
                }
                ResourceLockService.correlationIdHandleDict[key][resourceId].add(correlationId);
                return;
            }
        }
    }

    static onResourceRelease = async (eventData) => {
        for (let key in ResourceLockService.shouldRespondDict) {
            if (ResourceLockService.shouldRespondDict[key](eventData)) {
                try {
                    const resourceId = await ResourceLockService.resourceLocatorDict[key]({
                        eventData,
                        releaseRequest: true,
                        lockedIds: ResourceLockService.lockDict[key]
                    });
                    if (!resourceId && !(typeof resourceId === 'number' && resourceId === 0)) throw new ResourceNotFound();
                } catch (error) {
                    console.error(error);
                    throw error;
                }
                if (ResourceLockService.isLocked(key, resourceId)) {
                    ResourceLockService.unlockResource(key,resourceId);
                    ResourceLockService.correlationIdHandleDict[key][resourceId].delete(correlationId);
                    if(!ResourceLockService.correlationIdHandleDict[key][resourceId].size){
                        ResourceLockService.correlationIdHandleDict[key][resourceId] = null;
                    }
                }
                return;
            }
        }
    }

    constructor() {
        this.handle = uuid();
    }

    isLocked(resId) {
        return ResourceLockService.isLocked(this.handle, resId);
    }

    isFree(resId) {
        return !ResourceLockService.isLocked(this.handle, resId);
    }

    lock(resId) {
        ResourceLockService.lockResource(this.handle, resId);
    }

    unlock(resId) {
        ResourceLockService.unlockResource(this.handle, resId);
    }

    autoRespond(shouldRespondCb, resourceLocatorCb) {
        ResourceLockService.autoRespond(this.handle, shouldRespondCb, resourceLocatorCb);
    }
}

class ResourceNotFound extends Error {
    constructor(msg = 'Resource not found') {
        super(msg);
        this.name = 'ResourceNotFoundError';
    }
}

module.exports = new ResourceLockService();