<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        propertyProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            isPropertyOfProperty: false,
            property: {
                standard: false,
                mandatory: false,
                temporal: false,
                multiValued: false
            }
        };
    },
    watch: {
        "property.name"(name, oldName) {
            if ((!this.update || !this.Utils.isUndefined(oldName)) && this.workspace.defaultDataModelUrl) {
                this.property.url = this.workspace.defaultDataModelUrl + name;
            }
        },
        "property.description"(description) {
            if (description === "") {
                delete this.property.description;
            }
        },
        "property.url"(url) {
            if (url === "") {
                delete this.property.url;
            }
        },
        "property.ngsiLdType"(ngsiLdType) {
            if (ngsiLdType === "Property") {
                delete this.property.relationshipType;
                delete this.property.geoPropertyNgsiLdType;
                delete this.property.geoPropertyGeographic;
            } else if (ngsiLdType === "GeoProperty") {
                delete this.property.propertyNgsiLdValueType;
                delete this.property.relationshipType;
                if (Utils.isUndefined(this.property.geoPropertyGeographic)) {
                    this.property.geoPropertyGeographic = false;
                }
            } else if (ngsiLdType === "Relationship") {
                delete this.property.propertyNgsiLdValueType;
                delete this.property.geoPropertyNgsiLdType;
                delete this.property.geoPropertyGeographic;
            }
        },
        "property.temporal"(temporal) {
            if (!temporal) {
                delete this.property.temporalServices;
            }
        },
        "isPropertyOfProperty"(isPropertyOfProperty) {
            if (isPropertyOfProperty) {
                this.property.temporal = false;
                this.property.multiValued = false;
            } else {
                delete this.property.hasProperty;
            }
        }
    },
    created() {
        if (this.propertyProp) {
            this.update = true;
            Object.assign(this.property, this.propertyProp);
        }

        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.service = this.$store.getters["services/getService"](this.workspace.hasService);
        this.contextBroker = this.$store.getters["contextBrokers/getContextBroker"](this.service.hasContextBroker);

        const typeId = this.$route.params.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        this.types = this.$store.getters["types/getTypes"](this.workspace.id);
        this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id);

        this.temporalServices = {};
        this.workspace.temporalServices.forEach(temporalServiceId => {
            this.temporalServices[temporalServiceId] = this.$store.getters["temporalServices/getTemporalService"](temporalServiceId);
        });

        if (!this.update) {
            this.property.hasType = this.type.id;
            this.property.hasWorkspace = this.workspace.id;
            if (this.workspace.defaultDataModelUrl) {
                this.property.url = this.workspace.defaultDataModelUrl;
            }
        }
    },
    methods: {
        async storeProperty() {
            if (this.property.url === this.workspace.defaultDataModelUrl) {
                this.$swal.fire({
                    title: this.$t("dialogs.default_url_error"),
                    icon: "warning",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.property = await this.$store.dispatch("properties/storeProperty", { workspaceId: this.workspace.id, property: this.property });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.property_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "properties.show", params: { workspaceId: this.workspace.id, typeId: this.type.id, propertyId: this.property.id } });
        },
        async updateProperty() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("properties/updateProperty", { workspaceId: this.workspace.id, property: this.property });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.property_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "properties.show", params: { workspaceId: this.workspace.id, typeId: this.type.id, propertyId: this.property.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateProperty() : storeProperty()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="property.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="property.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="url" class="form-label">{{ Utils.capitalize($t("main.url")) }}</label>
            <input id="url" v-model="property.url" type="url" class="form-control">
        </div>
        <div class="mb-3">
            <label for="ngsi-ld-type" class="form-label">{{ Utils.capitalize($t("main.ngsi_ld_type")) }}</label>
            <select id="ngsi-ld-type" v-model="property.ngsiLdType" class="form-select" required>
                <option value="Property">Property</option>
                <option value="GeoProperty">GeoProperty</option>
                <option value="Relationship">Relationship</option>
            </select>
        </div>
        <div v-if="property.ngsiLdType == 'Property'" class="mb-3">
            <label for="property-ngsi-ld-value-type" class="form-label">{{ Utils.capitalize($t("main.property_ngsi_ld_value_type")) }}</label>
            <select id="property-ngsi-ld-value-type" v-model="property.propertyNgsiLdValueType" class="form-select" required>
                <option value="String">String</option>
                <option value="Number">Number</option>
                <option value="Boolean">Boolean</option>
                <option value="Object">Object</option>
                <option value="Array">Array</option>
            </select>
        </div>
        <div v-if="property.ngsiLdType == 'Relationship'" class="mb-3">
            <label for="relationship-type" class="form-label">{{ Utils.capitalize($t("main.relationship_type")) }}</label>
            <select id="relationship-type" v-model="property.relationshipType" class="form-select" required>
                <option v-for="_type in types" :key="_type.id" :value="_type.id">{{ _type.name }}</option>
            </select>
        </div>
        <div v-if="property.ngsiLdType == 'GeoProperty'" class="mb-3">
            <label for="geo-property-ngsi-ld-type" class="form-label">{{ Utils.capitalize($t("main.geo_property_ngsi_ld_type")) }}</label>
            <select id="geo-property-ngsi-ld-type" v-model="property.geoPropertyNgsiLdType" class="form-select" required>
                <option value="Point">Point</option>
                <option value="MultiPoint">MultiPoint</option>
                <option value="LineString">LineString</option>
                <option value="MultiLineString">MultiLineString</option>
                <option value="Polygon">Polygon</option>
                <option value="MultiPolygon">MultiPolygon</option>
            </select>
        </div>
        <div v-if="property.ngsiLdType == 'GeoProperty'" class="form-check mb-3">
            <input id="geo-property-geographic" v-model="property.geoPropertyGeographic" class="form-check-input" type="checkbox">
            <label for="geo-property-geographic" class="form-check-label">{{ Utils.capitalize($t("main.geo_property_geographic")) }}</label>
        </div>
        <div class="form-check mb-3">
            <input id="standard" v-model="property.standard" class="form-check-input" type="checkbox">
            <label for="standard" class="form-check-label">{{ Utils.capitalize($t("main.standard")) }}</label>
        </div>
        <div class="form-check mb-3">
            <input id="mandatory" v-model="property.mandatory" class="form-check-input" type="checkbox">
            <label for="mandatory" class="form-check-label">{{ Utils.capitalize($t("main.mandatory")) }}</label>
        </div>
        <div class="form-check mb-3">
            <input id="temporal" v-model="property.temporal" class="form-check-input" type="checkbox" :disabled="isPropertyOfProperty">
            <label for="temporal" class="form-check-label">{{ Utils.capitalize($t("main.temporal")) }}</label>
        </div>
        <div v-if="property.temporal" class="mb-3">
            <label for="temporal-services" class="form-label">{{ Utils.capitalize($t("main.temporal_services")) }}</label>
            <select id="temporal-services" v-model="property.temporalServices" class="form-select" multiple required>
                <option v-for="temporalService in temporalServices" :key="temporalService.id" :value="temporalService.id">{{ temporalService.name }}</option>
            </select>
        </div>
        <div class="form-check mb-3">
            <input id="property-of-property" v-model="isPropertyOfProperty" class="form-check-input" type="checkbox">
            <label for="property-of-property" class="form-check-label">{{ Utils.capitalize($t("main.property_of_property")) }}</label>
        </div>
        <div v-if="isPropertyOfProperty" class="mb-3">
            <label for="property" class="form-label">{{ Utils.capitalize($t("main.property")) }}</label>
            <select id="property" v-model="property.hasProperty" class="form-select" required>
                <option v-for="_property in properties" :key="_property.id" :value="_property.id">{{ _property.name }}</option>
            </select>
        </div>
        <div class="form-check mb-3">
            <input id="multi-valued" v-model="property.multiValued" class="form-check-input" type="checkbox" :disabled="isPropertyOfProperty || (contextBroker.implementationName !== 'scorpio' && contextBroker.implementationName !== 'stellio')">
            <label for="multi-valued" class="form-check-label">{{ Utils.capitalize($t("main.multi_valued")) }}</label>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
