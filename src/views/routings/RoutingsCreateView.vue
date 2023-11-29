<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RoutingForm from "@/components/forms/RoutingForm";

export default {
    components: {
        BreadcrumbNav,
        RoutingForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.routings")),
                route: {
                    name: "routings.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_routing"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_routing")) }}</div>
            <div class="card-body">
                <RoutingForm />
            </div>
        </div>
    </div>
</template>
