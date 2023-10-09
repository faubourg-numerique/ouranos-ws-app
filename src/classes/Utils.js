import CryptoJS from "crypto-js";
import uuid4 from "uuid4";

export default class Utils {
    static isInteger(integer) {
        return Number.isInteger(integer);
    }

    static isString(string) {
        return typeof string === "string" || string instanceof String;
    }

    static isArray(array) {
        return Array.isArray(array);
    }

    static isObject(object) {
        return typeof object === "object" && object !== null && !Utils.isArray(object) && Object.getPrototypeOf(object) === Object.prototype;
    }

    static isNull(element) {
        return element === null;
    }

    static isUndefined(element) {
        return typeof element === "undefined";
    }

    static isEmpty(element) {
        if (Utils.isNull(element) || Utils.isUndefined(element)) {
            return true;
        } else if (Utils.isString(element) || Utils.isArray(element)) {
            return element.length === 0;
        } else if (Utils.isObject(element)) {
            return Object.keys(element).length === 0;
        } else {
            return false;
        }
    }

    static toInteger(element) {
        return parseInt(element);
    }

    static capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static md5(string) {
        return CryptoJS.MD5(string).toString();
    }

    static regexMatch(pattern, subject) {
        const regex = new RegExp(pattern, "i");
        if (!regex) return false;
        return regex.test(subject);
    }

    static timeToIsoString(time) {
        if (!Utils.isInteger(time)) return;
        return new Date(time * 1000).toISOString();
    }

    static isoString() {
        return new Date().toISOString();
    }

    static generateUniqueNgsiLdUrn(type = null) {
        const uuid = uuid4();
        return "urn:ngsi-ld:" + (type ? type + ":" : null) + uuid;
    }

    static sortEntitiesByName(entities) {
        entities.sort(function (a, b) {
            if (!a.name || !b.name || !Utils.isString(a.name) || !Utils.isString(b.name)) return 0;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
        return entities;
    }

    static buildUrl(scheme, host, port, path) {
        return `${scheme}://${host}:${port}${path ?? ""}`;
    }
}
