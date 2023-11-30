<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
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

        this.routingOperationControls = this.$store.getters["routingOperationControls/getRoutingOperationControls"](this.workspace.id, this.routingOperation.id);

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
                active: true,
                name: this.Utils.capitalize(this.$t("main.routing_operation"))
            }
        ];
    },
    methods: {
        async destroyRoutingOperation() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.routing_operation_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("routingOperations/destroyRoutingOperation", { workspaceId: this.workspace.id, routingOperation: this.routingOperation });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_operation_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routings.show" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ routingOperation.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateRoutingOperation(workspace.id, routingOperation.id)" :to="{ name: 'routingOperations.edit', params: { name: routingOperation.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyRoutingOperation(workspace.id, routingOperation.id)" class="btn btn-danger btn-sm ms-3" @click="destroyRoutingOperation">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ routingOperation.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.sequence_number")) }}</dt>
                    <dd class="col-sm-9">{{ routingOperation.sequenceNumber }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.timer_before")) }}</dt>
                    <dd class="col-sm-9">{{ routingOperation.timerBefore }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.timer_after")) }}</dt>
                    <dd class="col-sm-9">{{ routingOperation.timerAfter }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.capability")) }}</dt>
                    <dd class="col-sm-9">
                        <RouterLink :to="{ name: 'capabilities.show', params: { capabilityId: routingOperation.hasCapability } }">{{ $store.getters["capabilities/getCapability"](workspace.id, routingOperation.hasCapability).name }}</RouterLink>
                    </dd>
                </dl>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.routing_operation_controls")) }}</span>
                <RouterLink v-if="$authorization.canStoreRoutingOperationControl(workspace.id)" :to="{ name: 'routingOperationControls.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(routingOperationControls).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_routing_operation_control") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.id")) }}</th>
                            <th>{{ Utils.capitalize($t("main.controlledProperty")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="routingOperationControl in routingOperationControls" :key="routingOperationControl.id">
                            <td>
                                <RouterLink :to="{ name: 'routingOperations.show', params: { routingOperationControlId: routingOperationControl.id } }">{{ routingOperationControl.id }}</RouterLink>
                            </td>
                            <td>
                                <RouterLink :to="{ name: 'controlledProperties.show', params: { capabilityId: $store.getters['routingOperations/getRoutingOperation'](workspace.id, routingOperationControl.hasRoutingOperation).hasCapability, controlledPropertyId: routingOperationControl.hasControlledProperty } }">{{ $store.getters["controlledProperties/getControlledProperty"](workspace.id, routingOperationControl.hasControlledProperty).name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
