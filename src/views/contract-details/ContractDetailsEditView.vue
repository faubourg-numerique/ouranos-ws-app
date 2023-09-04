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
            error: null,
            contractDetail: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const contractDetailId = this.$route.params.contractDetailId;
        this.contractDetail = this.$store.getters["contractDetails/getContractDetail"](this.workspace.id, contractDetailId);

        const offerId = this.contractDetail.hasOffer;
        this.offer = this.$store.getters["offers/getOffer"](this.workspace.id, offerId);

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
                name: this.offer.name,
                route: {
                    name: "offers.show",
                    params: {
                        workspaceId: this.workspace.id,
                        offerId: this.offer.id
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
    },
    methods: {
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
            this.$router.push({ name: "contractDetails.show", params: { workspaceId: this.workspace.id, contractDetailId: this.contractDetail.id } });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ contractDetail.id }}</div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <form @submit.prevent="updateContractDetail">
                    <div class="mb-3">
                        <div class="form-check">
                            <input id="permit" v-model="contractDetail.permit" class="form-check-input" type="checkbox">
                            <label for="permit" class="form-check-label">{{ Utils.capitalize($t("main.permit")) }}</label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">{{ Utils.capitalize($t("main.update")) }}</button>
                </form>
            </div>
        </div>
    </div>
</template>
