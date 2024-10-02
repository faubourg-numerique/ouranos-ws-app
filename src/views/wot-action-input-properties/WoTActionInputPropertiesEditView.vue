<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import WoTActionInputPropertyForm from "@/components/forms/WoTActionInputPropertyForm";

export default {
    components: {
        BreadcrumbNav,
        WoTActionInputPropertyForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](workspaceId, woTActionId);

        const woTActionInputPropertyId = this.$route.params.woTActionInputPropertyId;
        this.woTActionInputProperty = this.$store.getters["woTActionInputProperties/getWoTActionInputProperty"](workspaceId, woTActionInputPropertyId);

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
                name: this.woTActionInputProperty.name,
                route: {
                    name: "woTActionInputProperties.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id,
                        woTActionInputPropertyId: this.woTActionInputProperty.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_an_input_property")) }}</div>
            <div class="card-body">
                <WoTActionInputPropertyForm :wo-t-action-input-property-prop="woTActionInputProperty" />
            </div>
        </div>
    </div>
</template>
