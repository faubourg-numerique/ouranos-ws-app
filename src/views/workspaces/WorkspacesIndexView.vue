<script>
import axios from "axios";
import uuid4 from "uuid4";

export default {
    created() {
        this.workspaces = {};
        var workspaces = Object.values(this.$store.getters["workspaces/getWorkspaces"]);
        workspaces = this.Utils.sortEntitiesByName(workspaces);
        workspaces.forEach(workspace => {
            if (!this.$authorization.canShowWorkspace(workspace.id)) {
                return;
            }
            this.workspaces[workspace.id] = workspace;
        });
    },
    methods: {
        async toggleOpenWorkspace(workspaceId) {
            if (this.isWorkspaceOpen(workspaceId)) {
                this.$store.dispatch("closeWorkspace", workspaceId);
            } else {
                this.$store.dispatch("setDisplayLoadingScreen", true);
                await Promise.all([
                    this.$store.dispatch("types/fetchTypes", workspaceId),
                    this.$store.dispatch("properties/fetchProperties", workspaceId),
                    this.$store.dispatch("offers/fetchOffers", workspaceId),
                    this.$store.dispatch("contracts/fetchContracts", workspaceId),
                    this.$store.dispatch("contractDetails/fetchContractDetails", workspaceId),
                    this.$store.dispatch("dataServices/fetchDataServices", workspaceId),
                    this.$store.dispatch("dataServiceActions/fetchDataServiceActions", workspaceId),
                    this.$store.dispatch("dataServiceProperties/fetchDataServiceProperties", workspaceId),
                    this.$store.dispatch("dataServiceOffers/fetchDataServiceOffers", workspaceId),
                    this.$store.dispatch("dataServiceAccesses/fetchDataServiceAccesses", workspaceId),
                    this.$store.dispatch("woTActions/fetchWoTActions", workspaceId),
                    this.$store.dispatch("woTEvents/fetchWoTEvents", workspaceId),
                    this.$store.dispatch("woTActionParameters/fetchWoTActionParameters", workspaceId),
                    this.$store.dispatch("woTProperties/fetchWoTProperties", workspaceId),
                    this.$store.dispatch("routings/fetchRoutings", workspaceId),
                    this.$store.dispatch("routingOperations/fetchRoutingOperations", workspaceId),
                    this.$store.dispatch("routingOperationControls/fetchRoutingOperationControls", workspaceId),
                    this.$store.dispatch("woTThingDescriptions/fetchWoTThingDescriptions", workspaceId)
                ]);
                this.$store.dispatch("openWorkspace", workspaceId);
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.$router.push({ name: 'workspace', params: { workspaceId: workspaceId } });
            }
        },
        service(serviceId) {
            return this.$store.getters["services/getService"](serviceId);
        },
        isWorkspaceOpen(workspaceId) {
            return this.$store.getters["isWorkspaceOpen"](workspaceId);
        },
        dataModelUrl(name, version) {
            return `${process.env.VUE_APP_DATA_MODELS_URL}/${name}/${version}/context.jsonld`;
        },
        siop2AuthorizationRequired(workspaceId) {
            const workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);
            const service = this.$store.getters["services/getService"](workspace.hasService);
            return service.authorizationRequired && service.authorizationMode == "siop2";
        },
        beginSIOP2AuthorizationProcess(workspaceId) {
            const workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);
            const service = this.$store.getters["services/getService"](workspace.hasService);
            const vcVerifier = this.$store.getters["vcVerifiers/getVCVerifier"](service.hasVCVerifier);
            const state = uuid4();

            const vcVerifierUrl = this.Utils.buildUrl(vcVerifier.scheme, vcVerifier.host, vcVerifier.port, vcVerifier.path);
            const url = `${vcVerifierUrl}/api/v1/loginQR?state=${state}&client_id=${service.clientId}&client_callback=${process.env.VUE_APP_API_URL}/siop2/callback`;
            const popup = window.open(url, "_blank", "popup,width=500,height=500");

            const interval = setInterval(() => {
                axios
                    .get(`${process.env.VUE_APP_API_URL}/siop2/poll`, {
                        params: {
                            state,
                            workspaceId: workspace.id,
                        }
                    })
                    .then((response) => {
                        clearInterval(interval);
                        popup.close();
                        this.$store.dispatch("authentication/setSIOP2AccessToken", { workspaceId: workspace.id, accessToken: response.data });
                        this.toggleOpenWorkspace(workspace.id);
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 503) {
                            return;
                        }

                        clearInterval(interval);
                        popup.close();
                        console.error(error);
                    });
            }, 1000);
        }
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.workspaces")) }}</span>
                <RouterLink v-if="$authorization.canStoreWorkspace()" :to="{ name: 'workspaces.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(workspaces).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_workspace") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th />
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.service")) }}</th>
                            <th>{{ Utils.capitalize($t("main.version")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="workspace in workspaces" :key="workspace.id">
                            <td class="text-center">
                                <button style="width: 40px;" class="btn btn-sm" :class="{ 'btn-info': isWorkspaceOpen(workspace.id), 'btn-secondary': !isWorkspaceOpen(workspace.id) }" @click="!isWorkspaceOpen(workspace.id) && siop2AuthorizationRequired(workspace.id) ? beginSIOP2AuthorizationProcess(workspace.id) : toggleOpenWorkspace(workspace.id)">
                                    <i class="fa-solid" :class="{ 'fa-xmark': isWorkspaceOpen(workspace.id), 'fa-right-to-bracket': !isWorkspaceOpen(workspace.id) && !siop2AuthorizationRequired(workspace.id), 'fa-qrcode': !isWorkspaceOpen(workspace.id) && siop2AuthorizationRequired(workspace.id) }" />
                                </button>
                            </td>
                            <td>
                                <RouterLink v-if="$authorization.canShowWorkspace(workspace.id)" :to="{ name: 'workspaces.show', params: { workspaceId: workspace.id } }">{{ workspace.name }}</RouterLink>
                                <template v-else>{{ workspace.name }}</template>
                            </td>
                            <td>
                                <RouterLink v-if="$authorization.canShowService(workspace.hasService)" :to="{ name: 'services.show', params: { serviceId: workspace.hasService } }">{{ service(workspace.hasService).name }}</RouterLink>
                                <template v-else>{{ service(workspace.hasService).name }}</template>
                            </td>
                            <td><a :href="dataModelUrl(workspace.dataModelName, workspace.dataModelVersion)" target="_blank">{{ workspace.dataModelVersion }}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
