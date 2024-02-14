<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        contractProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            contract: {
                contractType: "data-consumer"
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.contract.hasWorkspace = this.workspace.id;

        if (this.contractProp) {
            this.update = true;
            Object.assign(this.contract, this.contractProp);
        }
    },
    methods: {
        async storeContract() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                this.contract = await this.$store.dispatch("contracts/storeContract", { workspaceId: this.workspace.id, contract: this.contract });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contracts.show", params: { contractId: this.contract.id } });
        },
        async updateContract() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("contracts/updateContract", { workspaceId: this.workspace.id, contract: this.contract });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contracts.show", params: { contractId: this.contract.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateContract() : storeContract()">
        <div class="mb-3">
            <label for="contract-type" class="form-label">{{ Utils.capitalize($t("main.contract_type")) }}</label>
            <select id="contract-type" v-model="contract.contractType" class="form-select" v-focus required>
                <option value="data-consumer">Data consumer</option>
                <option value="data-provider">Data provider</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="stakeholder-did" class="form-label">{{ Utils.capitalize($t("main.stakeholder_did")) }}</label>
            <input id="stakeholder-did" v-model="contract.stakeholderDid" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="stakeholder-name" class="form-label">{{ Utils.capitalize($t("main.stakeholder_name")) }}</label>
            <input id="stakeholder-name" v-model="contract.stakeholderName" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="valid-from-time" class="form-label">{{ Utils.capitalize($t("main.valid_from_time")) }}</label>
            <input id="valid-from-time" v-model="contract.validFromTime" type="number" min="0" step="1" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="valid-to-time" class="form-label">{{ Utils.capitalize($t("main.valid_to_time")) }}</label>
            <input id="valid-to-time" v-model="contract.validToTime" type="number" min="0" step="1" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="verifiable-credential-type" class="form-label">{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</label>
            <input id="verifiable-credential-type" v-model="contract.verifiableCredentialType" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
