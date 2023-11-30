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

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const routingId = this.$route.params.routingId;
        this.routing = this.$store.getters["routings/getRouting"](workspaceId, routingId);

        const routingOperationId = this.$route.params.routingOperationId;
        this.routingOperation = this.$store.getters["routingOperations/getRoutingOperation"](this.workspace.id, routingOperationId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.wot_thing_descriptions")),
                route: {
                    name: "woTThingDescriptions.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.woTThingDescription.name,
                route: {
                    name: "woTThingDescriptions.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id
                    }
                }
            },
            {
                name: this.routing.name,
                route: {
                    name: "routings.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id,
                        routingId: this.routing.id
                    }
                }
            },
            {
                name: this.Utils.capitalize(this.$t("main.routing_operation")),
                route: {
                    name: "routingOperations.show",
                    params: {
                        workspaceId: this.workspace.id,
                        routingOperationId: this.routingOperation.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_routing_operation")) }}</div>
            <div class="card-body">
                <RoutingOperationForm :routing-operation-prop="routingOperation" />
            </div>
        </div>
    </div>
</template>
