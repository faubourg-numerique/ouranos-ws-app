<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import WoTPropertyForm from "@/components/forms/WoTPropertyForm";

export default {
    components: {
        BreadcrumbNav,
        WoTPropertyForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](workspaceId, woTActionId);

        const woTPropertyId = this.$route.params.woTPropertyId;
        this.woTProperty = this.$store.getters["woTProperties/getWoTProperty"](workspaceId, woTPropertyId);

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
                name: this.woTProperty.name,
                route: {
                    name: "woTProperties.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id,
                        woTPropertyId: this.woTProperty.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_property")) }}</div>
            <div class="card-body">
                <WoTPropertyForm :wo-t-property-prop="woTProperty" />
            </div>
        </div>
    </div>
</template>
