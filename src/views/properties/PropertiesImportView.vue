<script>
import axios from "axios";
import yaml from "js-yaml";

import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            error: null,
            typeName: null,
            propertyNames: [],
            standardDataModelProperties: null
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const typeId = this.$route.params.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        this.types = this.$store.getters["types/getTypes"](this.workspace.id);
        this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id);

        this.smartDataModelsLogoPath = require("@/assets/images/logos/smart-data-models.png");

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.types")),
                route: {
                    name: "types.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.type.name,
                route: {
                    name: "types.show",
                    params: {
                        workspaceId: this.workspace.id,
                        typeId: this.type.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.import_properties"))
            }
        ];

        this.loadStandardDataModelProperties();
    },
    methods: {
        async importProperties() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                for (const name of this.propertyNames) {
                    const property = this.standardDataModelProperties[name];
                    await this.$store.dispatch("properties/storeProperty", { workspaceId: this.workspace.id, property });
                    this.propertyNames = this.propertyNames.filter(e => e !== name);
                }
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.properties_import_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "types.show", params: { workspaceId: this.workspace.id, typeId: this.type.id } });
        },
        async loadStandardDataModelProperties() {
            switch (this.type.standardDataModelType) {
                case "smart-data-models": {
                    const response = await axios.get(this.type.standardDataModelDefinitionUrl);
                    const decodedResponse = yaml.load(response.data);
                    const model = Object.values(decodedResponse)[0];
                    const properties = model.properties;

                    this.typeName = Object.keys(decodedResponse)[0];

                    this.standardDataModelProperties = {};
                    for (const [name, data] of Object.entries(properties)) {
                        if (["id", "type"].includes(name)) {
                            continue;
                        }
                        const property = {};
                        property.name = name;
                        if (data.description) {
                            property.description = data.description;
                        }
                        if (this.workspace.defaultDataModelUrl) {
                            property.url = this.workspace.defaultDataModelUrl + name;
                        }
                        if (data["x-ngsi"]) {
                            property.ngsiLdType = "Property";
                            if (data["x-ngsi"].type) {
                                if (data["x-ngsi"].type.toLowerCase() === "property") {
                                    property.ngsiLdType = "Property";
                                } else if (data["x-ngsi"].type.toLowerCase() === "geoproperty") {
                                    property.ngsiLdType = "GeoProperty";
                                } else if (data["x-ngsi"].type.toLowerCase() === "relationship") {
                                    property.ngsiLdType = "Relationship";
                                }
                            }
                        }
                        if (property.ngsiLdType === "Property") {
                            property.propertyNgsiLdValueType = "String";
                            if (data.type) {
                                if (data.type.toLowerCase() === "string") {
                                    property.propertyNgsiLdValueType = "String";
                                } else if (data.type.toLowerCase() === "number" || data.type.toLowerCase() === "integer") {
                                    property.propertyNgsiLdValueType = "Number";
                                } else if (data.type.toLowerCase() === "boolean") {
                                    property.propertyNgsiLdValueType = "Boolean";
                                } else if (data.type.toLowerCase() === "object") {
                                    property.propertyNgsiLdValueType = "Object";
                                } else if (data.type.toLowerCase() === "array") {
                                    property.propertyNgsiLdValueType = "Array";
                                }
                            }
                        } else if (property.ngsiLdType === "GeoProperty") {
                            property.geoPropertyNgsiLdType = "Point";
                            property.geoPropertyGeographic = true;
                        } else if (property.ngsiLdType === "Relationship") {
                            property.relationshipType = this.type.id;
                        }
                        property.standard = true;
                        property.mandatory = false;
                        property.temporal = false;
                        property.multiValued = false;
                        property.hasType = this.type.id;
                        property.hasWorkspace = this.workspace.id;
                        this.standardDataModelProperties[name] = property;
                    }
                    break;
                }
            }
        },
        propertyAlreadyExists(name) {
            return Object.values(this.properties).map(property => property.name).includes(name);
        }
    }
};
</script>

<template>
    <div class="container my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>
                    <a href="https://smartdatamodels.org/" target="_blank">
                        <img style="max-height: 25px;" :src="smartDataModelsLogoPath">
                    </a>
                    <span class="ms-2">{{ typeName }}</span>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <form @submit.prevent="importProperties">
                    <table class="table mb-3">
                        <thead class="table-dark">
                            <tr>
                                <th />
                                <th>{{ Utils.capitalize($t("main.name")) }}</th>
                                <th>{{ Utils.capitalize($t("main.description")) }}</th>
                                <th>{{ Utils.capitalize($t("main.ngsi_ld_type")) }}</th>
                                <th>{{ Utils.capitalize($t("main.property_value_type")) }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="property in standardDataModelProperties" :key="property.name" :class="{ 'table-success': propertyAlreadyExists(property.name) }">
                                <td>
                                    <div class="form-check">
                                        <input v-model="propertyNames" class="form-check-input" type="checkbox" :value="property.name" :disabled="propertyAlreadyExists(property.name) || !$authorization.canStoreProperty(workspace.id)">
                                    </div>
                                </td>
                                <td>{{ property.name }}</td>
                                <td>{{ property.description }}</td>
                                <td>{{ property.ngsiLdType }}</td>
                                <td>{{ property.propertyNgsiLdValueType }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button v-if="$authorization.canStoreProperty(workspace.id)" type="submit" class="btn btn-primary" :disabled="!propertyNames.length">{{ Utils.capitalize($t("main.import")) }}</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-check>input {
    width: 20px;
    height: 20px;
}
</style>
