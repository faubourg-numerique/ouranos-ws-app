<script>
export default {
    created() {
        this.identityManagers = {};
        var identityManagers = Object.values(this.$store.getters["identityManagers/getIdentityManagers"]);
        identityManagers = this.Utils.sortEntitiesByName(identityManagers);
        identityManagers.forEach(identityManager => {
            if (!this.$authorization.canShowIdentityManager(identityManager.id)) {
                return;
            }
            this.identityManagers[identityManager.id] = identityManager;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.identity_managers")) }}</span>
                <RouterLink v-if="$authorization.canStoreIdentityManager()" :to="{ name: 'identityManagers.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(identityManagers).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_identity_manager") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.host")) }}</th>
                            <th>{{ Utils.capitalize($t("main.implementation")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="identityManager in identityManagers" :key="identityManager.id">
                            <td>
                                <RouterLink :to="{ name: 'identityManagers.show', params: { identityManagerId: identityManager.id } }">{{ identityManager.name }}</RouterLink>
                            </td>
                            <td>{{ identityManager.host }}</td>
                            <td>{{ identityManager.implementationName }} {{ identityManager.implementationVersion }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
