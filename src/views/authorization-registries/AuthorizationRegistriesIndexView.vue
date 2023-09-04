<script>
export default {
    created() {
        this.authorizationRegistries = {};
        var authorizationRegistries = Object.values(this.$store.getters["authorizationRegistries/getAuthorizationRegistries"]);
        authorizationRegistries = this.Utils.sortEntitiesByName(authorizationRegistries);
        authorizationRegistries.forEach(authorizationRegistry => {
            if (!this.$authorization.canShowAuthorizationRegistry(authorizationRegistry.id)) {
                return;
            }
            this.authorizationRegistries[authorizationRegistry.id] = authorizationRegistry;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.authorization_registries")) }}</span>
                <RouterLink v-if="$authorization.canStoreAuthorizationRegistry()" :to="{ name: 'authorizationRegistries.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(authorizationRegistries).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_authorization_registry") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.identifier")) }}</th>
                            <th>{{ Utils.capitalize($t("main.host")) }}</th>
                            <th>{{ Utils.capitalize($t("main.implementation")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="authorizationRegistry in authorizationRegistries" :key="authorizationRegistry.id">
                            <td>
                                <RouterLink :to="{ name: 'authorizationRegistries.show', params: { authorizationRegistryId: authorizationRegistry.id } }">{{ authorizationRegistry.name }}</RouterLink>
                            </td>
                            <td>{{ authorizationRegistry.identifier }}</td>
                            <td>{{ authorizationRegistry.host }}</td>
                            <td>{{ authorizationRegistry.implementationName }} {{ authorizationRegistry.implementationVersion }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
