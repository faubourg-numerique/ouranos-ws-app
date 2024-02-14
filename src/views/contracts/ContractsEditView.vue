<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ContractForm from "@/components/forms/ContractForm";

export default {
    components: {
        BreadcrumbNav,
        ContractForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const contractId = this.$route.params.contractId;
        this.contract = this.$store.getters["contracts/getContract"](workspaceId, contractId);

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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_contract")) }}</div>
            <div class="card-body">
                <ContractForm :contract-prop="contract" />
            </div>
        </div>
    </div>
</template>
