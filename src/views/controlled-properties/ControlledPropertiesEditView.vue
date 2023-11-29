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

        const controlledPropertyId = this.$route.params.controlledPropertyId;
        this.controlledProperty = this.$store.getters["controlledProperties/getControlledProperty"](workspaceId, controlledPropertyId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.controlled_properties")),
                route: {
                    name: "controlledProperties.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.Utils.capitalize(this.$t("main.controlled_property")),
                route: {
                    name: "controlledProperties.show",
                    params: {
                        workspaceId: this.workspace.id,
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
