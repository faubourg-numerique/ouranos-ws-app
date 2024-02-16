<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import DataServiceAccessForm from "@/components/forms/DataServiceAccessForm";

export default {
    components: {
        BreadcrumbNav,
        DataServiceAccessForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const roleId = this.$route.params.roleId;
        this.role = this.$store.getters["roles/getRole"](this.workspace.id, roleId);

        const dataServiceAccessId = this.$route.params.dataServiceAccessId;
        this.dataServiceAccess = this.$store.getters["dataServiceAccesses/getDataServiceAccess"](this.workspace.id, dataServiceAccessId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.roles")),
                route: {
                    name: "roles.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.role.name,
                route: {
                    name: "roles.show",
                    params: {
                        workspaceId: this.workspace.id,
                        roleId: this.role.id
                    }
                }
            },
            {
                name: this.dataServiceAccess.id,
                route: {
                    name: "dataServiceAccesses.show",
                    params: {
                        workspaceId: this.workspace.id,
                        dataServiceAccessId: this.dataServiceAccess.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_data_service_access")) }}</div>
            <div class="card-body">
                <DataServiceAccessForm :data-service-access-prop="dataServiceAccess" />
            </div>
        </div>
    </div>
</template>
