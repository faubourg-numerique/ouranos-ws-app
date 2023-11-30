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

        const controlledPropertyId = this.$route.params.controlledPropertyId;
        this.controlledProperty = this.$store.getters["controlledProperties/getControlledProperty"](workspaceId, controlledPropertyId);

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
                name: this.controlledProperty.name,
                route: {
                    name: "controlledProperties.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id,
                        capabilityId: this.capability.id,
                        controlledPropertyId: this.controlledProperty.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_controlled_property")) }}</div>
            <div class="card-body">
                <ControlledPropertyForm :controlled-property-prop="controlledProperty" />
            </div>
        </div>
    </div>
</template>
