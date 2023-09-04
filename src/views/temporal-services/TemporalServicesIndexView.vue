<script>
export default {
    created() {
        this.temporalServices = {};
        var temporalServices = Object.values(this.$store.getters["temporalServices/getTemporalServices"]);
        temporalServices = this.Utils.sortEntitiesByName(temporalServices);
        temporalServices.forEach(temporalService => {
            if (!this.$authorization.canShowTemporalService(temporalService.id)) {
                return;
            }
            this.temporalServices[temporalService.id] = temporalService;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.temporal_services")) }}</span>
                <RouterLink v-if="$authorization.canStoreTemporalService()" :to="{ name: 'temporalServices.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(temporalServices).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_temporal_service") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.type")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="temporalService in temporalServices" :key="temporalService.id">
                            <td>
                                <RouterLink :to="{ name: 'temporalServices.show', params: { temporalServiceId: temporalService.id } }">{{ temporalService.name }}</RouterLink>
                            </td>
                            <td>{{ temporalService.temporalServiceType }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
