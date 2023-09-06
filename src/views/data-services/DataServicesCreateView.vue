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
                name: this.Utils.capitalize(this.$t("main.create_a_data_service"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_data_service")) }}</div>
            <div class="card-body">
                <DataServiceForm />
            </div>
        </div>
    </div>
</template>
