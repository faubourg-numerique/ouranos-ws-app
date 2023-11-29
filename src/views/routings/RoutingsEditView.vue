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

        const routingId = this.$route.params.routingId;
        this.routing = this.$store.getters["routings/getRouting"](workspaceId, routingId);

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
                name: this.Utils.capitalize(this.$t("main.routing")),
                route: {
                    name: "routings.show",
                    params: {
                        workspaceId: this.workspace.id,
                        routingId: this.routing.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_routing")) }}</div>
            <div class="card-body">
                <RoutingForm :routing-prop="routing" />
            </div>
        </div>
    </div>
</template>
