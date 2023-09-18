<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import DataServiceOfferForm from "@/components/forms/DataServiceOfferForm";

export default {
    components: {
        BreadcrumbNav,
        DataServiceOfferForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const dataServiceId = this.$route.params.dataServiceId;
        this.dataService = this.$store.getters["dataServices/getDataService"](workspaceId, dataServiceId);

        const dataServiceOfferId = this.$route.params.dataServiceOfferId;
        this.dataServiceOffer = this.$store.getters["dataServiceOffers/getDataServiceOffer"](this.workspace.id, dataServiceOfferId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.data_services")),
                route: {
                    name: "dataServices.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.Utils.capitalize(this.$t("main.data_service")),
                route: {
                    name: "dataServices.show",
                    params: {
                        workspaceId: this.workspace.id,
                        dataServiceId: this.dataService.id
                    }
                }
            },
            {
                name: this.dataServiceOffer.description,
                route: {
                    name: "dataServiceOffers.show",
                    params: {
                        workspaceId: this.workspace.id,
                        dataServiceId: this.dataService.id,
                        dataServiceOfferId: this.dataServiceOffer.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.edit_an_offering"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.edit_an_offering")) }}</div>
            <div class="card-body">
                <DataServiceOfferForm :data-service-offer-prop="dataServiceOffer" />
            </div>
        </div>
    </div>
</template>
