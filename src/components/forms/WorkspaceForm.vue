<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        workspaceProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            workspace: {
                dataModelVersion: 0,
                temporalServices: [],
                enableOffers: false
            }
        };
    },
    watch: {
        "workspace.description"(description) {
            if (description === "") {
                delete this.workspace.description;
            }
        },
        "workspace.defaultDataModelUrl"(defaultDataModelUrl) {
            if (defaultDataModelUrl === "") {
                delete this.workspace.defaultDataModelUrl;
            }
        },
        "workspace.hasService"(hasService) {
            if (!hasService || !this.contextBrokerMultiTenancyEnabledFromServiceId(hasService)) {
                delete this.workspace.contextBrokerTenant;
            }
        },
        "workspace.contextBrokerTenant"(contextBrokerTenant) {
            if (contextBrokerTenant === "") {
                delete this.workspace.contextBrokerTenant;
            }
        },
        "workspace.enableOffers"(enableOffers) {
            if (!enableOffers) {
                delete this.workspace.hasAuthorizationRegistry;
                delete this.workspace.hasAuthorizationRegistryGrant;
            }
        }
    },
    created() {
        if (this.workspaceProp) {
            this.update = true;
            Object.assign(this.workspace, this.workspaceProp);
        }

        this.services = this.$store.getters["services/getServices"];
        this.temporalServices = this.$store.getters["temporalServices/getTemporalServices"];
        this.authorizationRegistries = this.$store.getters["authorizationRegistries/getAuthorizationRegistries"];
        this.authorizationRegistryGrants = this.$store.getters["authorizationRegistryGrants/getAuthorizationRegistryGrants"];
    },
    methods: {
        async storeWorkspace() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.workspace = await this.$store.dispatch("workspaces/storeWorkspace", this.workspace);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.workspace_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspaces.show", params: { workspaceId: this.workspace.id } });
        },
        async updateWorkspace() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("workspaces/updateWorkspace", this.workspace);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.workspace_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspaces.show", params: { workspaceId: this.workspace.id } });
        },
        contextBrokerMultiTenancyEnabledFromServiceId(serviceId) {
            return this.contextBroker(this.service(serviceId).hasContextBroker).multiTenancyEnabled;
        },
        contextBroker(contextBrokerId) {
            return this.$store.getters["contextBrokers/getContextBroker"](contextBrokerId);
        },
        service(serviceId) {
            return this.$store.getters["services/getService"](serviceId);
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateWorkspace() : storeWorkspace()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="workspace.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="workspace.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="data-model-name" class="form-label">{{ Utils.capitalize($t("main.data_model_name")) }}</label>
            <input id="data-model-name" v-model="workspace.dataModelName" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="default-data-model-url" class="form-label">{{ Utils.capitalize($t("main.default_data_model_url")) }}</label>
            <input id="default-data-model-url" v-model="workspace.defaultDataModelUrl" type="url" class="form-control">
        </div>
        <div class="mb-3">
            <label for="service" class="form-label">{{ Utils.capitalize($t("main.service")) }}</label>
            <select id="service" v-model="workspace.hasService" class="form-select" required>
                <option v-for="_service in services" :key="_service.id" :value="_service.id">{{ _service.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="temporal-services" class="form-label">{{ Utils.capitalize($t("main.temporal_services")) }}</label>
            <select id="temporal-services" v-model="workspace.temporalServices" class="form-select" multiple>
                <option v-for="temporalService in temporalServices" :key="temporalService.id" :value="temporalService.id">{{ temporalService.name }}</option>
            </select>
        </div>
        <div v-if="workspace.hasService && contextBrokerMultiTenancyEnabledFromServiceId(workspace.hasService)" class="mb-3">
            <label for="context-broker-tenant" class="form-label">{{ Utils.capitalize($t("main.context_broker_tenant")) }}</label>
            <input id="context-broker-tenant" v-model="workspace.contextBrokerTenant" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <div class="form-check">
                <input id="enable-offers" v-model="workspace.enableOffers" class="form-check-input" type="checkbox">
                <label for="enable-offers" class="form-check-label">{{ Utils.capitalize($t("main.enable_offers")) }}</label>
            </div>
        </div>
        <template v-if="workspace.enableOffers">
            <div class="mb-3">
                <label for="authorization-registry" class="form-label">{{ Utils.capitalize($t("main.authorization_registry")) }}</label>
                <select id="authorization-registry" v-model="workspace.hasAuthorizationRegistry" class="form-select" required>
                    <option v-for="authorizationRegistry in authorizationRegistries" :key="authorizationRegistry.id" :value="authorizationRegistry.id">{{ authorizationRegistry.name }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="authorization-registry-grant" class="form-label">{{ Utils.capitalize($t("main.authorization_registry_grant")) }}</label>
                <select id="authorization-registry-grant" v-model="workspace.hasAuthorizationRegistryGrant" class="form-select" required>
                    <option v-for="authorizationRegistryGrant in authorizationRegistryGrants" :key="authorizationRegistryGrant.id" :value="authorizationRegistryGrant.id">{{ authorizationRegistryGrant.name }}</option>
                </select>
            </div>
        </template>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
