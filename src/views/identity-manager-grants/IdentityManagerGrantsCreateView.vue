<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import IdentityManagerGrantForm from "@/components/forms/IdentityManagerGrantForm";

export default {
    components: {
        BreadcrumbNav,
        IdentityManagerGrantForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.identity_manager_grants")),
                route: {
                    name: "identityManagerGrants.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_identity_manager_grant")) }}</div>
            <div class="card-body">
                <IdentityManagerGrantForm />
            </div>
        </div>
    </div>
</template>
