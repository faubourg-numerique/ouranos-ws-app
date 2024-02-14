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

        this.contracts = this.$store.getters["contracts/getContracts"](this.workspace.id);
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.contracts")) }}</span>
                <RouterLink v-if="$authorization.canStoreContract(workspace.id)" :to="{ name: 'contracts.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(contracts).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_contract") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th />
                            <th>{{ Utils.capitalize($t("main.stakeholder_did")) }}</th>
                            <th>{{ Utils.capitalize($t("main.stakeholder_name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contract in contracts" :key="contract.id">
                            <td>
                                <RouterLink :to="{ name: 'contracts.show', params: { workspaceId: workspace.id, contractId: contract.id } }" class="btn btn-light btn-sm">
                                    <i class="fa-solid fa-right-to-bracket" />
                                </RouterLink>
                            </td>
                            <td>{{ contract.stakeholderDid }}</td>
                            <td>{{ contract.stakeholderName }}</td>
                            <td>{{ contract.verifiableCredentialType }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
