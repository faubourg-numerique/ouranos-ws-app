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

        const capabilityId = this.$route.params.capabilityId;
        this.capability = this.$store.getters["capabilities/getCapability"](this.workspace.id, capabilityId);

        this.controlledProperties = this.$store.getters["controlledProperties/getControlledProperties"](this.workspace.id, this.capability.id);

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
                name: this.capability.name
            }
        ];
    },
    methods: {
        async destroyCapability() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.capability_deletion_question"),
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
                await this.$store.dispatch("capabilities/destroyCapability", { workspaceId: this.workspace.id, capability: this.capability });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.capability_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.show" });
        },
        property(workspaceId, propertyId) {
            return this.$store.getters["properties/getPropertyById"](workspaceId, propertyId);
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ capability.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateCapability(workspace.id, capability.id)" :to="{ name: 'capabilities.edit', params: { name: capability.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyCapability(workspace.id, capability.id)" class="btn btn-danger btn-sm ms-3" @click="destroyCapability">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ capability.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ capability.name }}</dd>
                    <template v-if="capability.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ capability.description }}</dd>
                    </template>
                </dl>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.controlled_properties")) }}</span>
                <RouterLink v-if="$authorization.canStoreControlledProperty(workspace.id)" :to="{ name: 'controlledProperties.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(controlledProperties).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_controlled_property") }}</div>
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
                        <tr v-for="controlledProperty in controlledProperties" :key="controlledProperty.id">
                            <td>
                                <RouterLink :to="{ name: 'controlledProperties.show', params: { controlledPropertyId: controlledProperty.id } }">{{ controlledProperty.name }}</RouterLink>
                            </td>
                            <td>
                                <RouterLink :to="{ name: 'properties.show', params: { workspaceId: workspace.id, typeId: property(workspace.id, controlledProperty.hasProperty).hasType, propertyId: controlledProperty.hasProperty } }">{{ property(workspace.id, controlledProperty.hasProperty).name }}</RouterLink>
                            </td>
                            <td>{{ controlledProperty.capacityType }}</td>
                            <td>{{ controlledProperty.capacityValue }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
