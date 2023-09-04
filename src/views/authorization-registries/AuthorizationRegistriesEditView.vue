<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import AuthorizationRegistryForm from "@/components/forms/AuthorizationRegistryForm";

export default {
    components: {
        BreadcrumbNav,
        AuthorizationRegistryForm
    },
    created() {
        const authorizationRegistryId = this.$route.params.authorizationRegistryId;
        this.authorizationRegistry = this.$store.getters["authorizationRegistries/getAuthorizationRegistry"](authorizationRegistryId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.authorization_registries")),
                route: {
                    name: "authorizationRegistries.index"
                }
            },
            {
                name: this.authorizationRegistry.name,
                route: {
                    name: "authorizationRegistries.show",
                    params: {
                        authorizationRegistryId: this.authorizationRegistry.id
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
            <div class="card-header">{{ authorizationRegistry.name }}</div>
            <div class="card-body">
                <AuthorizationRegistryForm :authorization-registry-prop="authorizationRegistry" />
            </div>
        </div>
    </div>
</template>
