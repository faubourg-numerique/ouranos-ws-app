<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { dataModelsUrl } from "@/config.js";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.workspaces")),
                route: {
                    name: "workspaces.index"
                }
            },
            {
                active: true,
                name: this.workspace.name
            }
        ];
    },
    methods: {
        async destroyWorkspace() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.workspace_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("workspaces/destroyWorkspace", this.workspace);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.workspace_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspaces.index" });
        },
        service(serviceId) {
            return this.$store.getters["services/getService"](serviceId);
        },
        temporalService(temporalServiceId) {
            return this.$store.getters["temporalServices/getTemporalService"](temporalServiceId);
        },
        authorizationRegistry(authorizationRegistryId) {
            return this.$store.getters["authorizationRegistries/getAuthorizationRegistry"](authorizationRegistryId);
        },
        authorizationRegistryGrant(authorizationRegistryGrantId) {
            return this.$store.getters["authorizationRegistryGrants/getAuthorizationRegistryGrant"](authorizationRegistryGrantId);
        },
        dataModelUrl() {
            return `${dataModelsUrl}/${this.workspace.dataModelName}/${this.workspace.dataModelVersion}/context.jsonld`;
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ workspace.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateWorkspace(workspace.id)" :to="{ name: 'workspaces.edit', params: { workspaceId: workspace.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyWorkspace(workspace.id)" class="btn btn-danger btn-sm ms-3" @click="destroyWorkspace">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ workspace.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ workspace.name }}</dd>
                    <template v-if="workspace.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ workspace.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_model_name")) }}</dt>
                    <dd class="col-sm-8">{{ workspace.dataModelName }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_model_version")) }}</dt>
                    <dd class="col-sm-8">{{ workspace.dataModelVersion }}</dd>
                    <template v-if="workspace.contextBrokerTenant">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.context_broker_tenant")) }}</dt>
                        <dd class="col-sm-8">{{ workspace.contextBrokerTenant }}</dd>
                    </template>
                    <template v-if="workspace.defaultDataModelUrl">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.default_data_model_url")) }}</dt>
                        <dd class="col-sm-8"><a :href="workspace.defaultDataModelUrl" target="_blank">{{ workspace.defaultDataModelUrl }}</a></dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.service")) }}</dt>
                    <dd class="col-sm-8">
                        <RouterLink v-if="$authorization.canShowService(workspace.hasService)" :to="{ name: 'services.show', params: { serviceId: workspace.hasService } }">{{ service(workspace.hasService).name }}</RouterLink>
                        <template v-else>{{ service(workspace.hasService).name }}</template>
                    </dd>
                    <template v-if="workspace.temporalServices.length">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.temporal_services")) }}</dt>
                        <dd class="col-sm-8">
                            <template v-for="temporalServiceId in workspace.temporalServices" :key="temporalServiceId">
                                <RouterLink v-if="$authorization.canShowTemporalService(temporalServiceId)" :to="{ name: 'temporalServices.show', params: { temporalServiceId } }">{{ temporalService(temporalServiceId).name }}</RouterLink>
                                <template v-else>{{ temporalService(temporalServiceId).name }}</template>
                            </template>
                        </dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_model_url")) }}</dt>
                    <dd class="col-sm-8"><a :href="dataModelUrl()" target="_blank">{{ dataModelUrl() }}</a></dd>
                    <dt class="col-sm-4" :class="{ 'mb-0': !workspace.enableOffers }">{{ Utils.capitalize($t("main.enable_offers")) }}</dt>
                    <dd class="col-sm-8" :class="{ 'mb-0': !workspace.enableOffers }">
                        <BooleanIcon :value="workspace.enableOffers" />
                    </dd>
                    <template v-if="workspace.authorizationRequired">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.identity_manager")) }}</dt>
                        <dd class="col-sm-8">
                            <RouterLink v-if="$authorization.canShowAuthorizationRegistry(workspace.hasAuthorizationRegistry)" :to="{ name: 'authorizationRegistries.show', params: { authorizationRegistryId: service.hasAuthorizationRegistry } }">
                                {{ authorizationRegistry(workspace.hasAuthorizationRegistry).name }}
                            </RouterLink>
                            <template v-else>{{ authorizationRegistry(workspace.hasAuthorizationRegistry).name }}</template>
                        </dd>
                        <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.identity_manager_grant")) }}</dt>
                        <dd class="col-sm-8 mb-0">
                            <RouterLink v-if="$authorization.canShowAuthorizationRegistryGrant(workspace.hasAuthorizationRegistryGrant)" :to="{ name: 'authorizationRegistryGrants.show', params: { authorizationRegistryGrantId: service.hasAuthorizationRegistryGrant } }">
                                {{ authorizationRegistryGrant(serviworkspacece.hasAuthorizationRegistryGrant).name }}
                            </RouterLink>
                            <template v-else>{{ authorizationRegistryGrant(workspace.hasAuthorizationRegistryGrant).name }}</template>
                        </dd>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
