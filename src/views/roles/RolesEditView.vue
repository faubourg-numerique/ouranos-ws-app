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

        const roleId = this.$route.params.roleId;
        this.role = this.$store.getters["roles/getRole"](workspaceId, roleId);

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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_role")) }}</div>
            <div class="card-body">
                <RoleForm :role-prop="role" />
            </div>
        </div>
    </div>
</template>
