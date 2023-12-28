<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import WoTEventForm from "@/components/forms/WoTEventForm";

export default {
    components: {
        BreadcrumbNav,
        WoTEventForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTEventId = this.$route.params.woTEventId;
        this.woTEvent = this.$store.getters["woTEvents/getWoTEvent"](workspaceId, woTEventId);

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
                name: this.woTEvent.name,
                route: {
                    name: "woTEvents.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id,
                        woTEventId: this.woTEvent.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_wot_event")) }}</div>
            <div class="card-body">
                <WoTEventForm :wo-t-event-prop="woTEvent" />
            </div>
        </div>
    </div>
</template>
