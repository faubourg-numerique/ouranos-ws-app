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
                name: this.dataService.name ?? this.dataService.id,
                route: {
                    name: "dataServices.show",
                    params: {
                        workspaceId: this.workspace.id,
                        dataServiceId: this.dataService.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_an_offering"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_offering")) }}</div>
            <div class="card-body">
                <DataServiceOfferForm />
            </div>
        </div>
    </div>
</template>
