<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CapabilityForm from "@/components/forms/CapabilityForm";

export default {
    components: {
        BreadcrumbNav,
        CapabilityForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const capabilityId = this.$route.params.capabilityId;
        this.capability = this.$store.getters["capabilities/getCapability"](workspaceId, capabilityId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.capabilities")),
                route: {
                    name: "capabilities.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.Utils.capitalize(this.$t("main.capability")),
                route: {
                    name: "capabilities.show",
                    params: {
                        workspaceId: this.workspace.id,
                        capabilityId: this.capability.id
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
            <div class="card-header">{{ Utils.capitalize($t("main.edit_a_capability")) }}</div>
            <div class="card-body">
                <CapabilityForm :capability-prop="capability" />
            </div>
        </div>
    </div>
</template>
