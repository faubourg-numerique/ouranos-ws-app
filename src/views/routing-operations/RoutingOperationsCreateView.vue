<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RoutingOperationForm from "@/components/forms/RoutingOperationForm";

export default {
    components: {
        BreadcrumbNav,
        RoutingOperationForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.routing_operations")),
                route: {
                    name: "routingOperations.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_routing_operation"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_routing_operation")) }}</div>
            <div class="card-body">
                <RoutingOperationForm />
            </div>
        </div>
    </div>
</template>
