<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import AuthorizationRegistryGrantForm from "@/components/forms/AuthorizationRegistryGrantForm";

export default {
    components: {
        BreadcrumbNav,
        AuthorizationRegistryGrantForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.authorization_registry_grants")),
                route: {
                    name: "authorizationRegistryGrants.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_authorization_registry_grant")) }}</div>
            <div class="card-body">
                <AuthorizationRegistryGrantForm />
            </div>
        </div>
    </div>
</template>
