<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import JsonViewer from "vue-json-viewer";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
        BreadcrumbNav,
        JsonViewer
    },
    data() {
        return {
            contract: null,
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const contractId = this.$route.params.contractId;
        this.contract = this.$store.getters["contracts/getContract"](this.workspace.id, contractId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.offers")),
                route: {
                    name: "offers.index",
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
        getOffer(offerId) {
            return this.$store.getters["offers/getOffer"](this.workspace.id, offerId);
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
            this.contract = this.$store.getters["contracts/getContract"](this.workspace.id, this.contract.id);
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$swal.fire({
                title: this.$t("dialogs.contract_synchronization_success"),
                icon: "success",
                heightAuto: false
            });
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
                    <button class="btn btn-primary btn-sm" @click="synchronizeContract">
                        <i class="fa-solid fa-sync-alt" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ contract.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.not_before")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ Utils.timeToIsoString(contract.notBefore) }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.not_on_or_after")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ Utils.timeToIsoString(contract.notOnOrAfter) }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.synchronized")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="contract.synchronized" />
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.synchronization_date")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ Utils.timeToIsoString(contract.synchronizationTime) }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_service_provider_id")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ contract.dataServiceProviderId }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_service_consumer_id")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ contract.dataServiceConsumerId }}</dd>
                    <dt class="col-sm-4" :class="{ 'mb-0': !contract.lastDelegationEvidence }">{{ Utils.capitalize($t("main.access_subject")) }}</dt>
                    <dd class="col-sm-8 font-monospace" :class="{ 'mb-0': !contract.lastDelegationEvidence }">{{ contract.accessSubject }}</dd>
                    <template v-if="contract.lastDelegationEvidence">
                        <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.last_delegation_evidence")) }}</dt>
                        <dd class="col-sm-8 font-monospace mb-0">
                            <JsonViewer :value="contract.lastDelegationEvidence" expanded :expand-depth="10" />
                        </dd>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
