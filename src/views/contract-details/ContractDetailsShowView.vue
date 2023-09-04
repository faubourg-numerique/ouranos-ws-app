<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
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
                active: true,
                name: this.contractDetail.id
            }
        ];
    },
    methods: {
        getOffer(offerId) {
            return this.$store.getters["offers/getOffer"](this.workspace.id, offerId);
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ contractDetail.id }}</span>
                <span>
                    <RouterLink :to="{ name: 'contractDetails.edit', params: { workspaceId: workspace.id, contractDetailId: contractDetail.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ contractDetail.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.permit")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="contractDetail.permit" />
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.offer")) }}</dt>
                    <dd class="col-sm-8">
                        <RouterLink :to="{ name: 'offers.show', params: { workspaceId: workspace.id, offerId: contractDetail.hasOffer } }">{{ getOffer(contractDetail.hasOffer).name }}</RouterLink>
                    </dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.contract")) }}</dt>
                    <dd class="col-sm-8 mb-0">
                        <RouterLink :to="{ name: 'contracts.show', params: { workspaceId: workspace.id, contractId: contractDetail.hasContract } }">{{ contractDetail.hasContract }}</RouterLink>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
