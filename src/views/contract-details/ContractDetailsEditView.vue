<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ContractDetailForm from "@/components/forms/ContractDetailForm";

export default {
    components: {
        BreadcrumbNav,
        ContractDetailForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const contractId = this.$route.params.contractId;
        this.contract = this.$store.getters["contracts/getContract"](this.workspace.id, contractId);

        const contractDetailId = this.$route.params.contractDetailId;
        this.contractDetail = this.$store.getters["contractDetails/getContractDetail"](this.workspace.id, contractDetailId);

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
                name: this.contract.id,
                route: {
                    name: "contracts.show",
                    params: {
                        workspaceId: this.workspace.id,
                        contractId: this.contract.id
                    }
                }
            },
            {
                name: this.contractDetail.id,
                route: {
                    name: "contractDetails.show",
                    params: {
                        workspaceId: this.workspace.id,
                        contractDetailId: this.contractDetail.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.edit"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_contract_detail")) }}</div>
            <div class="card-body">
                <ContractDetailForm :contract-detail-prop="contractDetail" />
            </div>
        </div>
    </div>
</template>
