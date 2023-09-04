<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import IdentityManagerForm from "@/components/forms/IdentityManagerForm";

export default {
    components: {
        BreadcrumbNav,
        IdentityManagerForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.identity_managers")),
                route: {
                    name: "identityManagers.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_identity_manager")) }}</div>
            <div class="card-body">
                <IdentityManagerForm />
            </div>
        </div>
    </div>
</template>
