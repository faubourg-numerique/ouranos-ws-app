<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import AuthorizationRegistryForm from "@/components/forms/AuthorizationRegistryForm";

export default {
    components: {
        BreadcrumbNav,
        AuthorizationRegistryForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.authorization_registries")),
                route: {
                    name: "authorizationRegistries.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_authorization_registry")) }}</div>
            <div class="card-body">
                <AuthorizationRegistryForm />
            </div>
        </div>
    </div>
</template>
