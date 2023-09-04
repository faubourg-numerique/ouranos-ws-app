<script>
export default {
    props: {
        propertyId: null,
        update: null,
        workspaceId: null,
        typeId: null,
        entity: null,
        properties: null
    },
    data() {
        return {
            propertyValue: null,
            geoPropertyType: null,
            geoPropertyCoordinates: null,
            relationshipEntities: null,
            relationshipEntityId: null,
            propertiesOfProperties: [],
            propertiesOfPropertiesValues: {},
            datasetId: null
        };
    },
    watch: {
        propertyId: {
            immediate: true,
            async handler(propertyId) {
                const property = this.properties[propertyId];

                if (property && property.ngsiLdType === "Relationship") {
                    const type = this.$store.getters["types/getType"](this.workspaceId, property.relationshipType);
                    const query = {
                        type: type.name
                    };
                    this.relationshipEntities = await this.$store.dispatch("entities/indexEntities", { workspaceId: this.workspaceId, query: query });
                }
            }
        }
    },
    created() {
        this.observedAt = this.Utils.isoString();

        if (!this.update) {
            return;
        }

        const property = this.properties[this.propertyId];
        const name = this.$store.getters["properties/getPropertyName"](this.workspaceId, this.typeId, property.id);
        const attribute = this.entity.getAttribute(property.name);

        Object.values(this.properties).forEach(prop => {
            if (prop.hasProperty === property.id) {
                this.propertiesOfProperties.push(prop);
                if (attribute && attribute[prop.name] && attribute[prop.name].value) {
                    this.propertiesOfPropertiesValues[prop.name] = attribute[prop.name].value;
                }
            }
        });

        switch (property.ngsiLdType) {
            case "Property": {
                var value = this.entity.getProperty(name);
                switch (property.propertyNgsiLdValueType) {
                    case "Object":
                    case "Array": {
                        value = JSON.stringify(value, null, 4);
                        break;
                    }
                }
                this.propertyValue = value;
                break;
            }
            case "GeoProperty": {
                this.geoPropertyType = this.entity.getGeoProperty(name)[0];
                this.geoPropertyCoordinates = JSON.stringify(this.entity.getGeoProperty(name)[1]);
                break;
            }
            case "Relationship": {
                this.relationshipEntityId = this.entity.getRelationship(name);
                break;
            }
        }
    },
    methods: {
        async updateEntity() {
            const property = this.properties[this.propertyId];
            const name = this.$store.getters["properties/getPropertyName"](this.workspaceId, this.typeId, property.id);
            const observedAt = property.temporal ? this.observedAt : null;

            if (property.multiValued && !this.datasetId) {
                this.datasetId = this.Utils.generateUniqueNgsiLdUrn("Property");
            }

            switch (property.ngsiLdType) {
                case "Property": {
                    var value = this.propertyValue;
                    switch (property.propertyNgsiLdValueType) {
                        case "String": {
                            value = String(value);
                            break;
                        }
                        case "Number": {
                            value = Number(value);
                            break;
                        }
                        case "Boolean": {
                            value = Boolean(value);
                            break;
                        }
                        case "Object":
                        case "Array": {
                            value = JSON.parse(value);
                            break;
                        }
                    }
                    if (property.multiValued) {
                        this.entity.setMultiValuedProperty(name, this.datasetId, value, observedAt);
                    } else {
                        this.entity.setProperty(name, value, observedAt);
                    }
                    break;
                }
                case "GeoProperty": {
                    const type = this.geoPropertyType;
                    const coordinates = JSON.parse(this.geoPropertyCoordinates);
                    if (property.multiValued) {
                        this.entity.setMultiValuedGeoProperty(name, this.datasetId, type, coordinates, observedAt);
                    } else {
                        this.entity.setGeoProperty(name, type, coordinates, observedAt);
                    }
                    break;
                }
                case "Relationship": {
                    const object = this.relationshipEntityId;
                    if (property.multiValued) {
                        this.entity.setMultiValuedRelationship(name, this.datasetId, object, observedAt);
                    } else {
                        this.entity.setRelationship(name, object, observedAt);
                    }
                    break;
                }
            }

            if (Object.values(this.propertiesOfPropertiesValues).length) {
                const attribute = this.entity.getAttribute(name);
                Object.keys(this.propertiesOfPropertiesValues).forEach(_name => {
                    const _value = this.propertiesOfPropertiesValues[_name];
                    attribute[_name] = {
                        type: "Property",
                        value: _value
                    };
                });
                this.entity.setAttribute(name, attribute);
            }

            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("entities/updateEntity", { workspaceId: this.workspaceId, typeId: this.typeId, entity: this.entity });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.entity_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspace", params: { workspaceId: this.workspaceId }, query: { typeId: this.typeId, entityId: this.entity.getId() } });
        }
    }
};
</script>

<template>
    <form @submit.prevent="updateEntity">
        <div v-if="propertyId">
            <div v-if="properties[propertyId].ngsiLdType === 'Property'">
                <div v-if="properties[propertyId].propertyNgsiLdValueType === 'Number'" class="mb-3">
                    <label for="value" class="form-label">{{ Utils.capitalize($t("main.value")) }}</label>
                    <input id="value" v-model="propertyValue" type="number" step="any" class="form-control" required>
                </div>
                <div v-else-if="properties[propertyId].propertyNgsiLdValueType === 'Boolean'" class="form-check mb-3">
                    <input id="checkbox" v-model="propertyValue" class="form-check-input" type="checkbox">
                    <label for="checkbox" class="form-check-label">{{ properties[propertyId].name }}</label>
                </div>
                <div v-else class="mb-3">
                    <label for="value" class="form-label">{{ Utils.capitalize($t("main.value")) }}</label>
                    <textarea id="value" v-model="propertyValue" class="form-control" rows="3" />
                </div>
            </div>
            <div v-else-if="properties[propertyId].ngsiLdType === 'GeoProperty'">
                <div class="mb-3">
                    <label for="geo-property-type" class="form-label">{{ Utils.capitalize($t("main.type")) }}</label>
                    <select id="geo-property-type" v-model="geoPropertyType" class="form-select" required>
                        <option value="Point">Point</option>
                        <option value="MultiPoint">MultiPoint</option>
                        <option value="LineString">LineString</option>
                        <option value="MultiLineString">MultiLineString</option>
                        <option value="Polygon">Polygon</option>
                        <option value="MultiPolygon">MultiPolygon</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="geo-property-coordinates" class="form-label">{{ Utils.capitalize($t("main.coordinates")) }}</label>
                    <textarea id="geo-property-coordinates" v-model="geoPropertyCoordinates" class="form-control" rows="3" />
                </div>
            </div>
            <div v-else-if="properties[propertyId].ngsiLdType === 'Relationship'">
                <div class="mb-3">
                    <label for="relationship-entity-id" class="form-label">{{ Utils.capitalize($t("main.entity")) }}</label>
                    <select id="relationship-entity-id" v-model="relationshipEntityId" class="form-select" required>
                        <option v-for="_entity in relationshipEntities" :key="_entity.getId()" :value="_entity.getId()">{{ _entity.getId() }}{{ _entity.propertyExists('name') ? ` (${_entity.getProperty("name")})` : null }}</option>
                    </select>
                </div>
            </div>
            <div v-if="properties[propertyId].temporal" class="mb-3">
                <label for="observed-at" class="form-label">{{ Utils.capitalize($t("main.observed_at")) }}</label>
                <input id="observed-at" v-model="observedAt" type="text" class="form-control" required>
            </div>
            <div v-for="propertyOfProperty in propertiesOfProperties" :key="propertyOfProperty.id" class="mb-3">
                <label class="form-label">{{ propertyOfProperty.name }}</label>
                <input v-model="propertiesOfPropertiesValues[propertyOfProperty.name]" type="text" class="form-control" required>
            </div>
            <div v-if="properties[propertyId].multiValued" class="mb-3">
                <label for="dataset-id" class="form-label">{{ Utils.capitalize($t("main.dataset_id")) }}</label>
                <input id="dataset-id" v-model="datasetId" type="text" class="form-control">
                <div class="form-text">{{ Utils.capitalize($t("dialogs.id_automatically_generated_if_not_provided")) }}</div>
            </div>
        </div>
        <button type="submit" class="btn btn-primary">{{ update? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
