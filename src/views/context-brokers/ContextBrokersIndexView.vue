<script>
export default {
    created() {
        this.contextBrokers = {};
        var contextBrokers = Object.values(this.$store.getters["contextBrokers/getContextBrokers"]);
        contextBrokers = this.Utils.sortEntitiesByName(contextBrokers);
        contextBrokers.forEach(contextBroker => {
            if (!this.$authorization.canShowContextBroker(contextBroker.id)) {
                return;
            }
            this.contextBrokers[contextBroker.id] = contextBroker;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.context_brokers")) }}</span>
                <RouterLink v-if="$authorization.canStoreContextBroker()" :to="{ name: 'contextBrokers.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(contextBrokers).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_context_broker") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.host")) }}</th>
                            <th>{{ Utils.capitalize($t("main.implementation")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contextBroker in contextBrokers" :key="contextBroker.id">
                            <td>
                                <RouterLink :to="{ name: 'contextBrokers.show', params: { contextBrokerId: contextBroker.id } }">{{ contextBroker.name }}</RouterLink>
                            </td>
                            <td>{{ contextBroker.host }}</td>
                            <td>{{ contextBroker.implementationName }} {{ contextBroker.implementationVersion }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
