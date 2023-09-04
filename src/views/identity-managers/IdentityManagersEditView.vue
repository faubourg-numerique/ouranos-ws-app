<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import IdentityManagerForm from "@/components/forms/IdentityManagerForm";

export default {
    components: {
        BreadcrumbNav,
        IdentityManagerForm
    },
    created() {
        const identityManagerId = this.$route.params.identityManagerId;
        this.identityManager = this.$store.getters["identityManagers/getIdentityManager"](identityManagerId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.identity_managers")),
                route: {
                    name: "identityManagers.index"
                }
            },
            {
                name: this.identityManager.name,
                route: {
                    name: "identityManagers.show",
                    params: {
                        identityManagerId: this.identityManager.id
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
            <div class="card-header">{{ identityManager.name }}</div>
            <div class="card-body">
                <IdentityManagerForm :identity-manager-prop="identityManager" />
            </div>
        </div>
    </div>
</template>
