import Utils from "./Utils";

export class Subscription {
    constructor(object) {
        this.data = {};
        if (object) {
            Object.assign(this.data, object);
        }
        this.data.type = "Subscription";
    }

    getId() {
        return this.data.id;
    }

    getSubscriptionName() {
        return this.data.subscriptionName;
    }

    getDescription() {
        return this.data.description;
    }

    getEntities() {
        return this.data.entities;
    }

    getWatchedAttributes() {
        return this.data.watchedAttributes;
    }

    getTimeInterval() {
        return this.data.timeInterval;
    }

    getQuery() {
        return this.data.q;
    }

    getGeoQuery() {
        return this.data.geoQ;
    }

    getIsActive() {
        return this.data.isActive;
    }

    getNotificationAttributes() {
        if (!this.data.notification) {
            return null;
        }
        if(Utils.isString(this.data.notification.attributes)) {
            return [this.data.notification.attributes];
        }
        return this.data.notification.attributes;
    }

    getNotificationFormat() {
        if (!this.data.notification) {
            return null;
        }
        return this.data.notification.format;
    }

    getNotificationEndpoint() {
        if (!this.data.notification) {
            return null;
        }
        return this.data.notification.endpoint;
    }

    getExpiresAt() {
        return this.data.expiresAt;
    }

    getThrottling() {
        return this.data.throttling;
    }

    getLang() {
        return this.data.lang;
    }

    getTimesSent() {
        if (!this.data.notification) {
            return null;
        }
        return this.data.notification.timesSent;
    }

    getLastNotification() {
        if (!this.data.notification) {
            return null;
        }
        return this.data.notification.lastNotification;
    }

    getLastSuccess() {
        if (!this.data.notification) {
            return null;
        }
        return this.data.notification.lastSuccess;
    }

    getLastFailure() {
        if (!this.data.notification) {
            return null;
        }
        return this.data.notification.lastFailure;
    }

    setId(id) {
        this.data.id = id;
    }

    setSubscriptionName(subscriptionName) {
        this.data.subscriptionName = subscriptionName;
    }

    setDescription(description) {
        this.data.description = description;
    }

    addEntity(id, idPattern, type) {
        if (!this.data.entities) {
            this.data.entities = [];
        }

        const entity = {};
        if (id) {
            entity.id = id;
        }
        if (idPattern) {
            entity.idPattern = idPattern;
        }
        if (type) {
            entity.type = type;
        }

        this.data.entities.push(entity);
    }

    addWatchedAttribute(watchedAttribute) {
        if (!this.data.watchedAttributes) {
            this.data.watchedAttributes = [];
        }

        this.data.watchedAttributes.push(watchedAttribute);
    }

    setTimeInterval(timeInterval) {
        this.data.timeInterval = timeInterval;
    }

    setQuery(query) {
        this.data.q = query;
    }

    setGeoQuery(geometry, coordinates, georel, geoproperty) {
        this.data.geoQ = {};
        if (geometry) {
            this.data.geoQ.geometry = geometry;
        }
        if (coordinates) {
            this.data.geoQ.coordinates = coordinates;
        }
        if (georel) {
            this.data.geoQ.georel = georel;
        }
        if (geoproperty) {
            this.data.geoQ.geoproperty = geoproperty;
        }
    }

    setIsActive(isActive) {
        this.data.isActive = isActive;
    }

    addNotificationAttribute(notificationAttribute) {
        if (!this.data.notification) {
            this.data.notification = {};
        }
        if (!this.data.notification.attributes) {
            this.data.notification.attributes = [];
        }

        this.data.notification.attributes.push(notificationAttribute);
    }

    setNotificationFormat(notificationFormat) {
        if (!this.data.notification) {
            this.data.notification = {};
        }
        this.data.notification.format = notificationFormat;
    }

    setNotificationEndpoint(uri, accept, receiverInfo, notifierInfo) {
        if (!this.data.notification) {
            this.data.notification = {};
        }

        this.data.notification.endpoint = { uri };

        if (accept) {
            this.data.notification.endpoint.accept = accept;
        }
        if (receiverInfo) {
            this.data.notification.endpoint.receiverInfo = receiverInfo;
        }
        if (notifierInfo) {
            this.data.notification.endpoint.notifierInfo = notifierInfo;
        }
    }

    setExpiresAt(expiresAt) {
        this.data.expiresAt = expiresAt;
    }

    setThrottling(throttling) {
        this.data.throttling = throttling;
    }

    setLang(lang) {
        this.data.lang = lang;
    }

    toObject() {
        return Object.assign({}, this.data);
    }
}
