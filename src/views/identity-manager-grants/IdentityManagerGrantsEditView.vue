<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import IdentityManagerGrantForm from "@/components/forms/IdentityManagerGrantForm";

export default {
    components: {
        BreadcrumbNav,
        IdentityManagerGrantForm
    },
    created() {
        const identityManagerGrantId = this.$route.params.identityManagerGrantId;
        this.identityManagerGrant = this.$store.getters["identityManagerGrants/getIdentityManagerGrant"](identityManagerGrantId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.identity_manager_grants")),
                route: {
                    name: "identityManagerGrants.index"
                }
            },
            {
                name: this.identityManagerGrant.name,
                route: {
                    name: "identityManagerGrants.show",
                    params: {
                        identityManagerGrantId: this.identityManagerGrant.id
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
            <div class="card-header">{{ identityManagerGrant.name }}</div>
            <div class="card-body">
                <IdentityManagerGrantForm :identity-manager-grant-prop="identityManagerGrant" />
            </div>
        </div>
    </div>
</template>
