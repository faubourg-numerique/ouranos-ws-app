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
        this.routing = this.$store.getters["routings/getRouting"](this.workspace.id, routingId);

        this.routingOperations = this.$store.getters["routingOperations/getRoutingOperations"](this.workspace.id, this.routing.id);

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
                active: true,
                name: this.routing.name
            }
        ];
    },
    methods: {
        async destroyRouting() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.routing_deletion_question"),
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
                await this.$store.dispatch("routings/destroyRouting", { workspaceId: this.workspace.id, routing: this.routing });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.show" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ routing.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateRouting(workspace.id, routing.id)" :to="{ name: 'routings.edit', params: { name: routing.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyRouting(workspace.id, routing.id)" class="btn btn-danger btn-sm ms-3" @click="destroyRouting">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ routing.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ routing.name }}</dd>
                    <template v-if="routing.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ routing.description }}</dd>
                    </template>
                </dl>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.routing_operations")) }}</span>
                <RouterLink v-if="$authorization.canStoreRoutingOperation(workspace.id)" :to="{ name: 'routingOperations.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(routingOperations).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_routing_operation") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.sequence_number")) }}</th>
                            <th>{{ Utils.capitalize($t("main.capability")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="routingOperation in routingOperations" :key="routingOperation.id">
                            <td>
                                <RouterLink :to="{ name: 'routingOperations.show', params: { routingOperationId: routingOperation.id } }">{{ routingOperation.sequenceNumber }}</RouterLink>
                            </td>
                            <td>
                                <RouterLink :to="{ name: 'capabilities.show', params: { capabilityId: routingOperation.hasCapability } }">{{ $store.getters["capabilities/getCapability"](workspace.id, routingOperation.hasCapability).name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
