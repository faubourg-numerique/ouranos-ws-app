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

        const offerId = this.$route.params.offerId;
        this.offer = this.$store.getters["offers/getOffer"](this.workspace.id, offerId);

        this.contractDetails = [];
        const contractDetails = this.$store.getters["contractDetails/getContractDetails"](this.workspace.id);
        if (contractDetails) {
            Object.values(contractDetails).forEach(contractDetail => {
                if (contractDetail.hasOffer !== this.offer.id) {
                    return;
                }
                this.contractDetails.push(contractDetail);
            });
        }

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
                name: this.offer.name
            }
        ];
    },
    methods: {
        getType(typeId) {
            return this.$store.getters["types/getType"](this.workspace.id, typeId);
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ offer.name }}</span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ offer.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ offer.name }}</dd>
                    <template v-if="offer.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ offer.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_service_provider_id")) }}</dt>
                    <dd class="col-sm-8">{{ offer.dataServiceProviderId }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.identifiers")) }}</dt>
                    <dd class="col-sm-8">
                        <div v-for="(identifier, index) in offer.identifiers" :key="index">{{ identifier }}</div>
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.attributes")) }}</dt>
                    <dd class="col-sm-8">
                        <div v-for="(attribute, index) in offer.attributes" :key="index">{{ attribute }}</div>
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.actions")) }}</dt>
                    <dd class="col-sm-8">
                        <div v-for="(action, index) in offer.actions" :key="index">{{ action }}</div>
                    </dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.type")) }}</dt>
                    <dd class="col-sm-8 mb-0">
                        <RouterLink :to="{ name: 'types.show', params: { workspaceId: workspace.id, typeId: offer.hasType } }">{{ getType(offer.hasType).name }}</RouterLink>
                    </dd>
                </dl>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.contract_details")) }}</span>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(contractDetails).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_contract_detail") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.data_service_consumer_id")) }}</th>
                            <th>{{ Utils.capitalize($t("main.permit")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contractDetail in contractDetails" :key="contractDetail.id">
                            <td>
                                <RouterLink :to="{ name: 'contractDetails.show', params: { workspaceId: workspace.id, contractDetailId: contractDetail.id } }">{{ contractDetail.id }}</RouterLink>
                            </td>
                            <td>
                                <BooleanIcon :value="contractDetail.permit" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
