<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
        BreadcrumbNav
    },
    data() {
        return {
            error: null,
            woTActionInputProperty: {}
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](workspaceId, woTActionId);

        const woTActionInputPropertyId = this.$route.params.woTActionInputPropertyId;
        this.woTActionInputProperty = this.$store.getters["woTActionInputProperties/getWoTActionInputProperty"](this.workspace.id, woTActionInputPropertyId);

        this.property = this.$store.getters["properties/getPropertyById"](this.workspace.id, this.woTActionInputProperty.hasProperty);

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
                name: this.woTAction.name,
                route: {
                    name: "woTActions.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id,
                        woTActionId: this.woTAction.id
                    }
                }
            },
            {
                active: true,
                name: this.woTActionInputProperty.name
            }
        ];
    },
    methods: {
        async destroyWoTActionInputProperty() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.wot_input_property_deletion_question"),
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
                await this.$store.dispatch("woTActionInputProperties/destroyWoTActionInputProperty", { workspaceId: this.workspace.id, woTActionInputProperty: this.woTActionInputProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_input_property_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTActions.show", params: { woTThingDescriptionId: this.woTThingDescription.id, woTActionId: this.woTAction.id } });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ woTActionInputProperty.name }}</span>
                <span>
                    <RouterLink
                        v-if="$authorization.canUpdateWoTActionInputProperty(workspace.id, woTActionInputProperty.id)"
                        :to="{ name: 'woTActionInputProperties.edit', params: { name: woTActionInputProperty.id } }"
                        class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button
                        v-if="$authorization.canDestroyWoTActionInputProperty(workspace.id, woTActionInputProperty.id)"
                        class="btn btn-danger btn-sm ms-3" @click="destroyWoTActionInputProperty">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ woTActionInputProperty.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ woTActionInputProperty.name }}</dd>
                    <template v-if="woTActionInputProperty.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ woTActionInputProperty.description }}</dd>
                    </template>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.type")) }}</dt>
                    <dd class="col-sm-9">{{ woTActionInputProperty.propertyType }}</dd>
                    <template v-if="woTActionInputProperty.minimum !== null">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.minimum")) }}</dt>
                        <dd class="col-sm-9">{{ woTActionInputProperty.minimum }}</dd>
                    </template>
                    <template v-if="woTActionInputProperty.maximum !== null">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.maximum")) }}</dt>
                        <dd class="col-sm-9">{{ woTActionInputProperty.maximum }}</dd>
                    </template>
                    <template v-if="woTActionInputProperty.enum !== null">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.enum")) }}</dt>
                        <dd class="col-sm-9">{{ woTActionInputProperty.enum }}</dd>
                    </template>
                    <dt class="col-sm-3 mb-0">{{ Utils.capitalize($t("main.required")) }}</dt>
                    <dd class="col-sm-9 mb-0">
                        <BooleanIcon :value="woTActionInputProperty.required" />
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
