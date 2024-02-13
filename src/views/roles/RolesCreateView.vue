<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RoleForm from "@/components/forms/RoleForm";

export default {
    components: {
        BreadcrumbNav,
        RoleForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

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
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_role"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_role")) }}</div>
            <div class="card-body">
                <RoleForm />
            </div>
        </div>
    </div>
</template>
