<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const contractId = this.$route.params.contractId;
        this.contract = this.$store.getters["contracts/getContract"](this.workspace.id, contractId);

        this.contractDetails = this.$store.getters["contractDetails/getContractDetails"](this.workspace.id, this.contract.id);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.contracts")),
                route: {
                    name: "contracts.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.contract.id
            }
        ];
    },
    methods: {
        getRole(roleId) {
            return this.$store.getters["roles/getRole"](this.workspace.id, roleId);
        },
        async synchronizeContract() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.contract_synchronization_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("contracts/synchronizeContract", { workspaceId: this.workspace.id, contract: this.contract });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_synchronization_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);

            this.$swal.fire({
                title: this.$t("dialogs.contract_synchronization_success"),
                icon: "success",
                heightAuto: false
            });
        },
        async destroyContract() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.contract_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("contracts/destroyContract", { workspaceId: this.workspace.id, contract: this.contract });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contracts.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ contract.id }}</span>
                <span>
                    <button v-if="$authorization.canUpdateContract(workspace.id, contract.id)" class="btn btn-primary btn-sm ms-3" @click="synchronizeContract">
                        <i class="fa-solid fa-sync-alt" />
                    </button>
                    <RouterLink v-if="$authorization.canUpdateContract(workspace.id, contract.id)" :to="{ name: 'contracts.edit', params: { contractId: contract.id } }" class="btn btn-primary btn-sm ms-3">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyContract(workspace.id, contract.id)" class="btn btn-danger btn-sm ms-3" @click="destroyContract" disabled>
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ contract.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.contract_type")) }}</dt>
                    <dd class="col-sm-8">{{ contract.contractType }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.stakeholder_did")) }}</dt>
                    <dd class="col-sm-8">{{ contract.stakeholderDid }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.stakeholder_name")) }}</dt>
                    <dd class="col-sm-8">{{ contract.stakeholderName }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.valid_from_time")) }}</dt>
                    <dd class="col-sm-8">{{ contract.validFromTime }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.valid_to_time")) }}</dt>
                    <dd class="col-sm-8">{{ contract.validToTime }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</dt>
                    <dd class="col-sm-8">{{ contract.verifiableCredentialType }}</dd>
                </dl>
            </div>
        </div>
        <div class="card mt-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.contract_details")) }}</span>
                <RouterLink v-if="$authorization.canStoreContractDetail(workspace.id)" :to="{ name: 'contractDetails.create', params: { contractId: contract.id } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(contractDetails).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_contract_detail") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th />
                            <th>{{ Utils.capitalize($t("main.id")) }}</th>
                            <th>{{ Utils.capitalize($t("main.role")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contractDetail in contractDetails" :key="contractDetail.id">
                            <td>
                                <RouterLink :to="{ name: 'contractDetails.show', params: { workspaceId: workspace.id, contractId: contract.id, contractDetailId: contractDetail.id } }" class="btn btn-light btn-sm">
                                    <i class="fa-solid fa-right-to-bracket" />
                                </RouterLink>
                            </td>
                            <td>{{ contractDetail.id }}</td>
                            <td>{{ getRole(contractDetail.hasRole).name }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
