<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import WorkspaceForm from "@/components/forms/WorkspaceForm";

export default {
    components: {
        BreadcrumbNav,
        WorkspaceForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.workspaces")),
                route: {
                    name: "workspaces.index"
                }
            },
            {
                name: this.workspace.name,
                route: {
                    name: "workspaces.show",
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
            <div class="card-header">{{ workspace.name }}</div>
            <div class="card-body">
                <WorkspaceForm :workspace-prop="workspace" />
            </div>
        </div>
    </div>
</template>
