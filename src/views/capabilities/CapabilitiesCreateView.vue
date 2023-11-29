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
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_capability"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_capability")) }}</div>
            <div class="card-body">
                <CapabilityForm />
            </div>
        </div>
    </div>
</template>
