import Utils from "@/classes/Utils";

export class Entity {
    constructor(object) {
        this.data = {};
        if (object) {
            Object.assign(this.data, object);
        }
    }

    getId() {
        return this.data.id;
    }

    getType() {
        return this.data.type;
    }

    setId(id) {
        this.data.id = id;
    }

    setType(type) {
        this.data.type = type;
    }

    isAttributeValid(attribute) {
        if (!attribute) {
            return false;
        }
        if (Utils.isArray(attribute)) {
            return true;
        }
        if (!Utils.isObject(attribute)) {
            return false;
        }
        if (!Utils.isString(attribute.type)) {
            return false;
        }
        switch (attribute.type) {
            case "Property": {
                if (Utils.isUndefined(attribute.value)) {
                    return false;
                }
                break;
            }
            case "GeoProperty": {
                if (!Utils.isObject(attribute.value)) {
                    return false;
                }
                if (!Utils.isString(attribute.value.type)) {
                    return false;
                }
                switch (attribute.value.type) {
                    case "Point":
                    case "MultiPoint":
                    case "LineString":
                    case "MultiLineString":
                    case "Polygon":
                    case "MultiPolygon": {
                        break;
                    }
                    default: {
                        return false;
                    }
                }
                if (!Utils.isArray(attribute.value.coordinates)) {
                    return false;
                }
                break;
            }
            case "Relationship": {
                if (!Utils.isString(attribute.object)) {
                    return false;
                }
                break;
            }
            default:
                return false;
        }
        return true;
    }

    getAttribute(nameOrNames) {
        if (Utils.isString(nameOrNames)) {
            const name = nameOrNames;
            return this.data[name];
        }
        if (Utils.isArray(nameOrNames)) {
            const names = nameOrNames;
            return names.reduce((p, c) => p && p[c] || undefined, this.data);
            // Author: Adriano Spadoni (https://stackoverflow.com/a/43849204)
        }
        return null;
    }

    setAttribute(nameOrNames, attribute) {
        if (Utils.isString(nameOrNames)) {
            const name = nameOrNames;
            this.data[name] = attribute;
        }
        if (Utils.isArray(nameOrNames)) {
            const names = nameOrNames;
            names.reduce((o, p, i) => o[p] = names.length === ++i ? attribute : o[p] || {}, this.data);
            // Author: Adriano Spadoni (https://stackoverflow.com/a/43849204)
        }
    }

    isAttributeProperty(attribute) {
        return attribute.type === "Property";
    }

    isAttributeGeoProperty(attribute) {
        return attribute.type === "GeoProperty";
    }

    isAttributeRelationship(attribute) {
        return attribute.type === "Relationship";
    }

    setAttributeMetadata(nameOrNames, metadataName, metadataValue) {
        const attribute = this.getAttribute(nameOrNames);

        if (!this.isAttributeValid(attribute)) {
            return;
        }

        attribute[metadataName] = metadataValue;
        this.setAttribute(nameOrNames, attribute);
    }

    deleteAttribute(nameOrNames) {
        this.setAttribute(nameOrNames, undefined);
    }

    attributeExists(nameOrNames) {
        const attribute = this.getAttribute(nameOrNames);
        if (!this.isAttributeValid(attribute)) return false;
        return true;
    }

    propertyExists(nameOrNames) {
        const attribute = this.getAttribute(nameOrNames);
        if (!this.isAttributeValid(attribute)) return false;
        if (!this.isAttributeProperty(attribute)) return false;
        return true;
    }

    geoPropertyExists(nameOrNames) {
        const attribute = this.getAttribute(nameOrNames);
        if (!this.isAttributeValid(attribute)) return false;
        if (!this.isAttributeGeoProperty(attribute)) return false;
        return true;
    }

    relationshipExists(nameOrNames) {
        const attribute = this.getAttribute(nameOrNames);
        if (!this.isAttributeValid(attribute)) return false;
        if (!this.isAttributeRelationship(attribute)) return false;
        return true;
    }

    getProperty(nameOrNames) {
        const attribute = this.getAttribute(nameOrNames);

        if (!this.isAttributeValid(attribute) || !this.isAttributeProperty(attribute)) {
            return null;
        }

        return attribute.value;
    }

    getGeoProperty(nameOrNames) {
        const attribute = this.getAttribute(nameOrNames);

        if (!this.isAttributeValid(attribute) || !this.isAttributeGeoProperty(attribute)) {
            return null;
        }

        return [attribute.value.type, attribute.value.coordinates];
    }

    getRelationship(nameOrNames) {
        const attribute = this.getAttribute(nameOrNames);

        if (!this.isAttributeValid(attribute) || !this.isAttributeRelationship(attribute)) {
            return null;
        }

        return attribute.object;
    }

    setProperty(nameOrNames, value, observedAt) {
        var attribute = this.getAttribute(nameOrNames);

        if (!this.isAttributeValid(attribute) || !this.isAttributeProperty(attribute)) {
            attribute = {};
        }

        attribute.type = "Property";
        attribute.value = value;
        if (observedAt) attribute.observedAt = observedAt;

        this.setAttribute(nameOrNames, attribute);
    }

    setGeoProperty(nameOrNames, type, coordinates, observedAt) {
        var attribute = this.getAttribute(nameOrNames);

        if (!this.isAttributeValid(attribute) || !this.isAttributeGeoProperty(attribute)) {
            attribute = {};
        }

        attribute.type = "GeoProperty";
        attribute.value = { type, coordinates };
        if (observedAt) attribute.observedAt = observedAt;

        this.setAttribute(nameOrNames, attribute);
    }

    setRelationship(nameOrNames, object, observedAt) {
        var attribute = this.getAttribute(nameOrNames);

        if (!this.isAttributeValid(attribute) || !this.isAttributeRelationship(attribute)) {
            attribute = {};
        }

        attribute.type = "Relationship";
        attribute.object = object;
        if (observedAt) attribute.observedAt = observedAt;

        this.setAttribute(nameOrNames, attribute);
    }

    toObject() {
        return Object.assign({}, this.data);
    }

    toObjectWithoutIdAndType() {
        const object = Object.assign({}, this.data);
        delete object.id;
        delete object.type;
        return object;
    }

    getMultiValuedAttribute(name) {
        var multiValuedAttribute = this.getAttribute(name);
        if (!multiValuedAttribute) {
            multiValuedAttribute = [];
        } else if (Utils.isObject(multiValuedAttribute)) {
            multiValuedAttribute = [multiValuedAttribute];
        }
        return multiValuedAttribute;
    }

    getAttributeIndexFromMultiValuedAttribute(multiValuedAttribute, datasetId) {
        var attributeIndex = null;
        multiValuedAttribute.forEach((attribute, index) => {
            if (attribute.datasetId && attribute.datasetId === datasetId) {
                attributeIndex = index;
            }
        });
        return attributeIndex;
    }

    setMultiValuedProperty(name, datasetId, value, observedAt) {
        const multiValuedAttribute = this.getMultiValuedAttribute(name);
        const attributeIndex = this.getAttributeIndexFromMultiValuedAttribute(multiValuedAttribute, datasetId);
        const index = !Utils.isNull(attributeIndex) ? attributeIndex : multiValuedAttribute.length;

        multiValuedAttribute[index] = {
            type: "Property",
            value: value,
            datasetId: datasetId
        };
        if (observedAt) {
            multiValuedAttribute[index].observedAt = observedAt;
        }

        this.setAttribute(name, multiValuedAttribute);
    }

    setMultiValuedGeoProperty(name, datasetId, type, coordinates, observedAt) {
        const multiValuedAttribute = this.getMultiValuedAttribute(name);
        const attributeIndex = this.getAttributeIndexFromMultiValuedAttribute(multiValuedAttribute, datasetId);
        const index = !Utils.isNull(attributeIndex) ? attributeIndex : multiValuedAttribute.length;

        multiValuedAttribute[index] = {
            type: "GeoProperty",
            value: { type, coordinates },
            datasetId: datasetId
        };
        if (observedAt) {
            multiValuedAttribute[index].observedAt = observedAt;
        }

        this.setAttribute(name, multiValuedAttribute);
    }

    setMultiValuedRelationship(name, datasetId, object, observedAt) {
        const multiValuedAttribute = this.getMultiValuedAttribute(name);
        const attributeIndex = this.getAttributeIndexFromMultiValuedAttribute(multiValuedAttribute, datasetId);
        const index = !Utils.isNull(attributeIndex) ? attributeIndex : multiValuedAttribute.length;

        multiValuedAttribute[index] = {
            type: "Relationship",
            object: object,
            datasetId: datasetId
        };
        if (observedAt) {
            multiValuedAttribute[index].observedAt = observedAt;
        }

        this.setAttribute(name, multiValuedAttribute);
    }
}
