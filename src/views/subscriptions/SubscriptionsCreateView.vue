<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import SubscriptionForm from "@/components/forms/SubscriptionForm";

export default {
    components: {
        BreadcrumbNav,
        SubscriptionForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const typeId = this.$route.query.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.subscriptions")),
                route: {
                    name: "workspace",
                    params: {
                        workspaceId: this.workspace.id
                    },
                    query: {
                        activeTab: "subscriptions"
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_subscription")) }}</div>
            <div class="card-body">
                <SubscriptionForm />
            </div>
        </div>
    </div>
</template>
