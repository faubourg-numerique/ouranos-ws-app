<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RoutingOperationControlForm from "@/components/forms/RoutingOperationControlForm";

export default {
    components: {
        BreadcrumbNav,
        RoutingOperationControlForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const routingOperationControlId = this.$route.params.routingOperationControlId;
        this.routingOperationControl = this.$store.getters["routingOperationControls/getRoutingOperationControl"](workspaceId, routingOperationControlId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.routing_operation_controls")),
                route: {
                    name: "routingOperationControls.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.Utils.capitalize(this.$t("main.routing_operation_control")),
                route: {
                    name: "routingOperationControls.show",
                    params: {
                        workspaceId: this.workspace.id,
                        routingOperationControlId: this.routingOperationControl.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_routing_operation_control")) }}</div>
            <div class="card-body">
                <RoutingOperationControlForm :routing-operation-control-prop="routingOperationControl" />
            </div>
        </div>
    </div>
</template>
