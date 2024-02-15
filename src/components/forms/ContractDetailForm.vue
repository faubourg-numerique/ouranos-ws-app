<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        contractDetailProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            contractDetail: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const contractId = this.$route.params.contractId;
        this.contract = this.$store.getters["contracts/getContract"](contractId);

        this.contractDetail.hasWorkspace = workspaceId;
        this.contractDetail.hasContract = contractId;

        if (this.contractDetailProp) {
            this.update = true;
            Object.assign(this.contractDetail, this.contractDetailProp);
        }

        this.roles = this.$store.getters["roles/getRoles"](this.workspace.id);
    },
    methods: {
        async storeContractDetail() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                this.contractDetail = await this.$store.dispatch("contractDetails/storeContractDetail", { workspaceId: this.workspace.id, contractDetail: this.contractDetail });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_detail_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contractDetails.show", params: { contractDetailId: this.contractDetail.id } });
        },
        async updateContractDetail() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("contractDetails/updateContractDetail", { workspaceId: this.workspace.id, contractDetail: this.contractDetail });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_detail_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contractDetails.show", params: { contractDetailId: this.contractDetail.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateContractDetail() : storeContractDetail()">
        <div class="mb-3">
            <label for="role-id" class="form-label">{{ Utils.capitalize($t("main.role")) }}</label>
            <select id="role-id" v-model="contractDetail.hasRole" class="form-select" required>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
