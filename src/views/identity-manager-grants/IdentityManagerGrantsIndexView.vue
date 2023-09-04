<script>
export default {
    created() {
        this.identityManagerGrants = {};
        var identityManagerGrants = Object.values(this.$store.getters["identityManagerGrants/getIdentityManagerGrants"]);
        identityManagerGrants = this.Utils.sortEntitiesByName(identityManagerGrants);
        identityManagerGrants.forEach(identityManagerGrant => {
            if (!this.$authorization.canShowIdentityManagerGrant(identityManagerGrant.id)) {
                return;
            }
            this.identityManagerGrants[identityManagerGrant.id] = identityManagerGrant;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.identity_manager_grants")) }}</span>
                <RouterLink v-if="$authorization.canStoreIdentityManagerGrant()" :to="{ name: 'identityManagerGrants.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(identityManagerGrants).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_identity_manager_grant") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="identityManagerGrant in identityManagerGrants" :key="identityManagerGrant.id">
                            <td>
                                <RouterLink :to="{ name: 'identityManagerGrants.show', params: { identityManagerGrantId: identityManagerGrant.id } }">{{ identityManagerGrant.name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
