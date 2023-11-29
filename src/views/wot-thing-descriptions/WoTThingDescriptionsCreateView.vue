<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import WoTThingDescriptionForm from "@/components/forms/WoTThingDescriptionForm";

export default {
    components: {
        BreadcrumbNav,
        WoTThingDescriptionForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

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
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_wot_thing_description"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_wot_thing_description")) }}</div>
            <div class="card-body">
                <WoTThingDescriptionForm />
            </div>
        </div>
    </div>
</template>
