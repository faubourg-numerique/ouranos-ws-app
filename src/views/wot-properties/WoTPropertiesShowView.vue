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

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](workspaceId, woTActionId);

        const woTPropertyId = this.$route.params.woTPropertyId;
        this.woTProperty = this.$store.getters["woTProperties/getWoTProperty"](this.workspace.id, woTPropertyId);

        this.property = this.$store.getters["properties/getPropertyById"](this.workspace.id, this.woTProperty.hasProperty);

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
                name: this.woTProperty.name
            }
        ];
    },
    methods: {
        async destroyWoTProperty() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.property_deletion_question"),
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
                await this.$store.dispatch("woTProperties/destroyWoTProperty", { workspaceId: this.workspace.id, woTProperty: this.woTProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.property_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.show", params: { woTThingDescriptionId: this.woTThingDescription.id } });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ woTProperty.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateWoTProperty(workspace.id, woTProperty.id)" :to="{ name: 'woTProperties.edit', params: { name: woTProperty.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyWoTProperty(workspace.id, woTProperty.id)" class="btn btn-danger btn-sm ms-3" @click="destroyWoTProperty">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ woTProperty.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ woTProperty.name }}</dd>
                    <template v-if="woTProperty.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ woTProperty.description }}</dd>
                    </template>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.capacity_type")) }}</dt>
                    <dd class="col-sm-9">{{ woTProperty.capacityType }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.capacity_value")) }}</dt>
                    <dd class="col-sm-9">{{ woTProperty.capacityValue }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.property")) }}</dt>
                    <dd class="col-sm-9">
                        <RouterLink :to="{ name: 'properties.show', params: { typeId: property.hasType, propertyId: property.id } }">{{ property.name }}</RouterLink>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
