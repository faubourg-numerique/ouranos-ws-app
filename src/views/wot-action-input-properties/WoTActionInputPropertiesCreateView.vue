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
                name: this.Utils.capitalize(this.$t("main.create_an_input_property"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_input_property")) }}</div>
            <div class="card-body">
                <WoTActionInputPropertyForm />
            </div>
        </div>
    </div>
</template>
