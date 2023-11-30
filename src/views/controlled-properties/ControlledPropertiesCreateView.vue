<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ControlledPropertyForm from "@/components/forms/ControlledPropertyForm";

export default {
    components: {
        BreadcrumbNav,
        ControlledPropertyForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const capabilityId = this.$route.params.capabilityId;
        this.capability = this.$store.getters["capabilities/getCapability"](workspaceId, capabilityId);

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
                name: this.capability.name,
                route: {
                    name: "capabilities.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id,
                        capabilityId: this.capability.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_controlled_property"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_controlled_property")) }}</div>
            <div class="card-body">
                <ControlledPropertyForm />
            </div>
        </div>
    </div>
</template>
