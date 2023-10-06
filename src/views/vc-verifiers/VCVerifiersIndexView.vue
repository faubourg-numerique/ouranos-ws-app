<script>
export default {
    created() {
        this.vcVerifiers = {};
        var vcVerifiers = Object.values(this.$store.getters["vcVerifiers/getVCVerifiers"]);
        vcVerifiers = this.Utils.sortEntitiesByName(vcVerifiers);
        vcVerifiers.forEach(vcVerifier => {
            if (!this.$authorization.canShowVCVerifier(vcVerifier.id)) {
                return;
            }
            this.vcVerifiers[vcVerifier.id] = vcVerifier;
        });
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.vc_verifiers")) }}</span>
                <RouterLink v-if="$authorization.canStoreVCVerifier()" :to="{ name: 'vcVerifiers.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(vcVerifiers).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_vc_verifier") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.host")) }}</th>
                            <th>{{ Utils.capitalize($t("main.implementation")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="vcVerifier in vcVerifiers" :key="vcVerifier.id">
                            <td>
                                <RouterLink :to="{ name: 'vcVerifiers.show', params: { vcVerifierId: vcVerifier.id } }">{{ vcVerifier.name }}</RouterLink>
                            </td>
                            <td>{{ vcVerifier.host }}</td>
                            <td>{{ vcVerifier.implementationName }} {{ vcVerifier.implementationVersion }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
