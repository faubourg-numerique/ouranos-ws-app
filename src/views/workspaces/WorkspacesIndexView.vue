<script>
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
                    this.$store.dispatch("dataServiceProperties/fetchDataServiceProperties", workspaceId)
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
                                <button style="width: 40px;" class="btn btn-sm" :class="{ 'btn-info': isWorkspaceOpen(workspace.id), 'btn-secondary': !isWorkspaceOpen(workspace.id) }" @click="toggleOpenWorkspace(workspace.id)">
                                    <i class="fa-solid" :class="{ 'fa-xmark': isWorkspaceOpen(workspace.id), 'fa-right-to-bracket': !isWorkspaceOpen(workspace.id) }" />
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
