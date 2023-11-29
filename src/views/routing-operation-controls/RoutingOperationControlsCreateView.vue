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
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_routing_operation_control"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_routing_operation_control")) }}</div>
            <div class="card-body">
                <RoutingOperationControlForm />
            </div>
        </div>
    </div>
</template>
