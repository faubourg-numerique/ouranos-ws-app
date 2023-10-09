<script>
export default {
    created() {
        this.services = {};
        var services = Object.values(this.$store.getters["services/getServices"]);
        services = this.Utils.sortEntitiesByName(services);
        services.forEach(service => {
            if (!this.$authorization.canShowService(service.id)) {
                return;
            }
            this.services[service.id] = service;
        });
    },
    methods: {
        contextBroker(contextBrokerId) {
            return this.$store.getters["contextBrokers/getContextBroker"](contextBrokerId);
        }
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.services")) }}</span>
                <RouterLink v-if="$authorization.canStoreService()" :to="{ name: 'services.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(services).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_service") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.context_broker")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in services" :key="service.id">
                            <td>
                                <RouterLink :to="{ name: 'services.show', params: { serviceId: service.id } }">{{ service.name }}</RouterLink>
                            </td>
                            <td>
                                <RouterLink v-if="$authorization.canShowContextBroker(service.hasContextBroker)" :to="{ name: 'contextBrokers.show', params: { contextBrokerId: service.hasContextBroker } }">
                                    {{ contextBroker(service.hasContextBroker).name }}
                                </RouterLink>
                                <template v-else>{{ contextBroker(service.hasContextBroker).name }}</template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
