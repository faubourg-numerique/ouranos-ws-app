<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.dataServices = this.$store.getters["dataServices/getDataServices"](this.workspace.id);
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.data_services")) }}</span>
                <RouterLink :to="{ name: 'dataServices.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(dataServices).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_data_service") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dataService in dataServices" :key="dataService.id">
                            <td>
                                <RouterLink :to="{ name: 'dataServices.show', params: { workspaceId: workspace.id, dataServiceId: dataService.id } }">{{ dataService.id }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
