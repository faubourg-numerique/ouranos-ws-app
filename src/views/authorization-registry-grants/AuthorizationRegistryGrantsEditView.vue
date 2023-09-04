<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import AuthorizationRegistryGrantForm from "@/components/forms/AuthorizationRegistryGrantForm";

export default {
    components: {
        BreadcrumbNav,
        AuthorizationRegistryGrantForm
    },
    created() {
        const authorizationRegistryGrantId = this.$route.params.authorizationRegistryGrantId;
        this.authorizationRegistryGrant = this.$store.getters["authorizationRegistryGrants/getAuthorizationRegistryGrant"](authorizationRegistryGrantId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.authorization_registry_grants")),
                route: {
                    name: "authorizationRegistryGrants.index"
                }
            },
            {
                name: this.authorizationRegistryGrant.name,
                route: {
                    name: "authorizationRegistryGrants.show",
                    params: {
                        authorizationRegistryGrantId: this.authorizationRegistryGrant.id
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
            <div class="card-header">{{ authorizationRegistryGrant.name }}</div>
            <div class="card-body">
                <AuthorizationRegistryGrantForm :authorization-registry-grant-prop="authorizationRegistryGrant" />
            </div>
        </div>
    </div>
</template>
