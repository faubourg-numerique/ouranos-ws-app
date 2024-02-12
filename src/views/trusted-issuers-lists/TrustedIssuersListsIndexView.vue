<script>
export default {
    created() {
        this.trustedIssuersLists = {};
        var trustedIssuersLists = Object.values(this.$store.getters["trustedIssuersLists/getTrustedIssuersLists"]);
        trustedIssuersLists = this.Utils.sortEntitiesByName(trustedIssuersLists);
        trustedIssuersLists.forEach(trustedIssuersList => {
            if (!this.$authorization.canShowTrustedIssuersList(trustedIssuersList.id)) {
                return;
            }
            this.trustedIssuersLists[trustedIssuersList.id] = trustedIssuersList;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.trusted_issuers_lists")) }}</span>
                <RouterLink v-if="$authorization.canStoreTrustedIssuersList()" :to="{ name: 'trustedIssuersLists.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(trustedIssuersLists).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_trusted_issuers_list") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.host")) }}</th>
                            <th>{{ Utils.capitalize($t("main.implementation")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="trustedIssuersList in trustedIssuersLists" :key="trustedIssuersList.id">
                            <td>
                                <RouterLink :to="{ name: 'trustedIssuersLists.show', params: { trustedIssuersListId: trustedIssuersList.id } }">{{ trustedIssuersList.name }}</RouterLink>
                            </td>
                            <td>{{ trustedIssuersList.host }}</td>
                            <td>{{ trustedIssuersList.implementationName }} {{ trustedIssuersList.implementationVersion }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
