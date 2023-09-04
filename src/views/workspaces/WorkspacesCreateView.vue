<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import WorkspaceForm from "@/components/forms/WorkspaceForm";

export default {
    components: {
        BreadcrumbNav,
        WorkspaceForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.workspaces")),
                route: {
                    name: "workspaces.index"
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_workspace")) }}</div>
            <div class="card-body">
                <WorkspaceForm />
            </div>
        </div>
    </div>
</template>
