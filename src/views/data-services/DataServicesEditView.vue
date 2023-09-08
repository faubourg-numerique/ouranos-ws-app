<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import DataServiceForm from "@/components/forms/DataServiceForm";

export default {
    components: {
        BreadcrumbNav,
        DataServiceForm
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_data_service")) }}</div>
            <div class="card-body">
                <DataServiceForm :data-service-prop="dataService" />
            </div>
        </div>
    </div>
</template>
