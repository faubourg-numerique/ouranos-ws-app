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
