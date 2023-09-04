<script>
export default {
    created() {
        this.authorizationRegistryGrants = {};
        var authorizationRegistryGrants = Object.values(this.$store.getters["authorizationRegistryGrants/getAuthorizationRegistryGrants"]);
        authorizationRegistryGrants = this.Utils.sortEntitiesByName(authorizationRegistryGrants);
        authorizationRegistryGrants.forEach(authorizationRegistryGrant => {
            if (!this.$authorization.canShowAuthorizationRegistryGrant(authorizationRegistryGrant.id)) {
                return;
            }
            this.authorizationRegistryGrants[authorizationRegistryGrant.id] = authorizationRegistryGrant;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.authorization_registry_grants")) }}</span>
                <RouterLink v-if="$authorization.canStoreAuthorizationRegistryGrant()" :to="{ name: 'authorizationRegistryGrants.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(authorizationRegistryGrants).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_authorization_registry_grant") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.identifier")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="authorizationRegistryGrant in authorizationRegistryGrants" :key="authorizationRegistryGrant.id">
                            <td>
                                <RouterLink :to="{ name: 'authorizationRegistryGrants.show', params: { authorizationRegistryGrantId: authorizationRegistryGrant.id } }">{{ authorizationRegistryGrant.name }}</RouterLink>
                            </td>
                            <td>{{ authorizationRegistryGrant.identifier }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
