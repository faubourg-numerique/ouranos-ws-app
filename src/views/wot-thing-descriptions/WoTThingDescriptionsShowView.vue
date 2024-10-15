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
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](this.workspace.id, woTThingDescriptionId);

        this.woTProperties = this.$store.getters["woTProperties/getWoTProperties"](this.workspace.id, this.woTThingDescription.id);
        this.woTActions = this.$store.getters["woTActions/getWoTActions"](this.workspace.id, this.woTThingDescription.id);
        this.woTEvents = this.$store.getters["woTEvents/getWoTEvents"](this.workspace.id, this.woTThingDescription.id);
        this.routings = this.$store.getters["routings/getRoutings"](this.workspace.id, this.woTThingDescription.id);

        this.thingDescriptionUrl = `${window.thingDescriptionsUrl}/${this.woTThingDescription.id}`;

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
                active: true,
                name: this.woTThingDescription.name
            }
        ];
    },
    methods: {
        async destroyWoTThingDescription() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.wot_thing_description_deletion_question"),
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
                await this.$store.dispatch("woTThingDescriptions/destroyWoTThingDescription", { workspaceId: this.workspace.id, woTThingDescription: this.woTThingDescription });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_thing_description_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.index" });
        },
        property(workspaceId, propertyId) {
            return this.$store.getters["properties/getPropertyById"](workspaceId, propertyId);
        },
        dataServiceName(dataServiceId) {
            const dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);
            return dataService.name ?? dataService.id;
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ woTThingDescription.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateWoTThingDescription(workspace.id, woTThingDescription.id)" :to="{ name: 'woTThingDescriptions.edit', params: { name: woTThingDescription.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyWoTThingDescription(workspace.id, woTThingDescription.id)" class="btn btn-danger btn-sm ms-3" @click="destroyWoTThingDescription">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ woTThingDescription.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ woTThingDescription.name }}</dd>
                    <template v-if="woTThingDescription.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ woTThingDescription.description }}</dd>
                    </template>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.type")) }}</dt>
                    <dd class="col-sm-9">
                        <RouterLink :to="{ name: 'types.show', params: { workspaceId: workspace.id, typeId: woTThingDescription.hasType } }">{{ $store.getters["types/getType"](workspace.id, woTThingDescription.hasType).name }}</RouterLink>
                    </dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.url")) }}</dt>
                    <dd class="col-sm-9">
                        <a :href="thingDescriptionUrl" target="_blank">{{ thingDescriptionUrl }}</a>
                    </dd>
                </dl>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.properties")) }}</span>
                <RouterLink v-if="$authorization.canStoreWoTProperty(workspace.id)" :to="{ name: 'woTProperties.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(woTProperties).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_wot_property") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.property")) }}</th>
                            <th>{{ Utils.capitalize($t("main.capacity_type")) }}</th>
                            <th>{{ Utils.capitalize($t("main.capacity_value")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="woTProperty in woTProperties" :key="woTProperty.id">
                            <td>
                                <RouterLink :to="{ name: 'woTProperties.show', params: { woTPropertyId: woTProperty.id } }">{{ woTProperty.name }}</RouterLink>
                            </td>
                            <td>
                                <RouterLink :to="{ name: 'properties.show', params: { workspaceId: workspace.id, typeId: property(workspace.id, woTProperty.hasProperty).hasType, propertyId: woTProperty.hasProperty } }">{{ property(workspace.id, woTProperty.hasProperty).name }}</RouterLink>
                            </td>
                            <td>{{ woTProperty.capacityType }}</td>
                            <td>{{ woTProperty.capacityValue }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.actions")) }}</span>
                <RouterLink v-if="$authorization.canStoreWoTAction(workspace.id)" :to="{ name: 'woTActions.create', params: { woTThingDescriptionId: woTThingDescription.id } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(woTActions).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_wot_action") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="woTAction in woTActions" :key="woTAction.id">
                            <td>
                                <RouterLink :to="{ name: 'woTActions.show', params: { woTActionId: woTAction.id } }">{{ woTAction.name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.events")) }}</span>
                <RouterLink v-if="$authorization.canStoreWoTEvent(workspace.id)" :to="{ name: 'woTEvents.create', params: { woTThingDescriptionId: woTThingDescription.id } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(woTEvents).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_wot_event") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.data_service")) }}</th>
                            <th>{{ Utils.capitalize($t("main.capacity_value")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="woTEvent in woTEvents" :key="woTEvent.id">
                            <td>
                                <RouterLink :to="{ name: 'woTEvents.show', params: { woTEventId: woTEvent.id } }">{{ woTEvent.name }}</RouterLink>
                            </td>
                            <td>
                                <RouterLink :to="{ name: 'dataServices.show', params: { dataServiceId: woTEvent.hasDataService } }">{{ dataServiceName(woTEvent.hasDataService) }}</RouterLink>
                            </td>
                            <td>{{ woTEvent.capacityValue }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.routings")) }}</span>
                <RouterLink v-if="$authorization.canStoreRouting(workspace.id)" :to="{ name: 'routings.create', params: { woTThingDescriptionId: woTThingDescription.id } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(routings).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_routing") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="routing in routings" :key="routing.id">
                            <td>
                                <RouterLink :to="{ name: 'routings.show', params: { routingId: routing.id } }">{{ routing.name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
