<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        dataServiceProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            dataService: {
                isDemand: false,
                isOffer: false
            },
            dataActionIds: [],
            propertyIds: []
        };
    },
    computed: {
        properties() {
            if (!this.dataService.hasEntityType) {
                return [];
            }

            return this.$store.getters["properties/getProperties"](this.workspace.id, this.dataService.hasEntityType);
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.dataService.hasWorkspace = this.workspace.id;

        if (this.dataServiceProp) {
            this.update = true;
            Object.assign(this.dataService, this.dataServiceProp);

            const dataServiceActions = this.$store.getters["dataServiceActions/getDataServiceActionsByDataServiceId"](this.workspace.id, this.dataService.id);
            const dataServiceProperties = this.$store.getters["dataServiceProperties/getDataServicePropertiesByDataServiceId"](this.workspace.id, this.dataService.id);

            dataServiceActions.forEach(dataServiceAction => {
                this.dataActionIds.push(dataServiceAction.hasDataAction);
            });
            dataServiceProperties.forEach(dataServiceProperty => {
                this.propertyIds.push(dataServiceProperty.hasProperty);
            });
        }

        this.types = this.$store.getters["types/getTypes"](this.workspace.id);
        this.dataActions = this.$store.getters["dataActions/getDataActions"];
    },
    methods: {
        async storeDataService() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                this.dataService = await this.$store.dispatch("dataServices/storeDataService", { workspaceId: this.workspace.id, dataService: this.dataService });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            for (const dataActionId of this.dataActionIds) {
                const dataServiceAction = {
                    hasDataAction: dataActionId,
                    hasDataService: this.dataService.id,
                    hasWorkspace: this.workspace.id
                };

                try {
                    await this.$store.dispatch("dataServiceActions/storeDataServiceAction", { workspaceId: this.workspace.id, dataServiceAction });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_action_creation_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            for (const propertyId of this.propertyIds) {
                const dataServiceProperty = {
                    hasProperty: propertyId,
                    hasDataService: this.dataService.id,
                    hasWorkspace: this.workspace.id
                };

                try {
                    await this.$store.dispatch("dataServiceProperties/storeDataServiceProperty", { workspaceId: this.workspace.id, dataServiceProperty });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_property_creation_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServices.show", params: { dataServiceId: this.dataService.id } });
        },
        async updateDataService() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("dataServices/updateDataService", { workspaceId: this.workspace.id, dataService: this.dataService });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            const dataServiceActions = this.$store.getters["dataServiceActions/getDataServiceActionsByDataServiceId"](this.workspace.id, this.dataService.id);
            const dataServiceProperties = this.$store.getters["dataServiceProperties/getDataServicePropertiesByDataServiceId"](this.workspace.id, this.dataService.id);

            for (const dataServiceAction of dataServiceActions) {
                try {
                    await this.$store.dispatch("dataServiceActions/destroyDataServiceAction", { workspaceId: this.workspace.id, dataServiceAction });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_update_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            for (const dataServiceProperty of dataServiceProperties) {
                try {
                    await this.$store.dispatch("dataServiceProperties/destroyDataServiceProperty", { workspaceId: this.workspace.id, dataServiceProperty });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_update_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            for (const dataActionId of this.dataActionIds) {
                const dataServiceAction = {
                    hasDataAction: dataActionId,
                    hasDataService: this.dataService.id,
                    hasWorkspace: this.workspace.id
                };

                try {
                    await this.$store.dispatch("dataServiceActions/storeDataServiceAction", { workspaceId: this.workspace.id, dataServiceAction });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_action_creation_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            for (const propertyId of this.propertyIds) {
                const dataServiceProperty = {
                    hasProperty: propertyId,
                    hasDataService: this.dataService.id,
                    hasWorkspace: this.workspace.id
                };

                try {
                    await this.$store.dispatch("dataServiceProperties/storeDataServiceProperty", { workspaceId: this.workspace.id, dataServiceProperty });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_property_creation_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServices.show", params: { dataServiceId: this.dataService.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateDataService() : storeDataService()">
        <div class="mb-3">
            <label for="type" class="form-label">{{ Utils.capitalize($t("main.type")) }}</label>
            <select id="type" v-model="dataService.hasEntityType" class="form-select" required>
                <option v-for="_type in types" :value="_type.id" :key="_type.id">{{ _type.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="properties" class="form-label">{{ Utils.capitalize($t("main.properties")) }}</label>
            <select id="properties" v-model="propertyIds" class="form-select" multiple required>
                <option v-for="property in properties" :value="property.id" :key="property.id">{{ property.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="data-actions" class="form-label">{{ Utils.capitalize($t("main.actions")) }}</label>
            <select id="data-actions" v-model="dataActionIds" class="form-select" multiple required>
                <option v-for="dataAction in dataActions" :value="dataAction.id" :key="dataAction.id">{{ dataAction.name }}</option>
            </select>
        </div>
        <div class="form-check mb-3">
            <input id="is-demand" class="form-check-input" type="checkbox" v-model="dataService.isDemand">
            <label for="is-demand" class="form-check-label">{{ Utils.capitalize($t("main.is_demand")) }}</label>
        </div>
        <div class="form-check mb-3">
            <input id="is-offer" class="form-check-input" type="checkbox" v-model="dataService.isOffer">
            <label for="is-offer" class="form-check-label">{{ Utils.capitalize($t("main.is_offer")) }}</label>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
