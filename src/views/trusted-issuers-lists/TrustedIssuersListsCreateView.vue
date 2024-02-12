<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TrustedIssuersListForm from "@/components/forms/TrustedIssuersListForm";

export default {
    components: {
        BreadcrumbNav,
        TrustedIssuersListForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.trusted_issuers_lists")),
                route: {
                    name: "trustedIssuersLists.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_trusted_issuers_list")) }}</div>
            <div class="card-body">
                <TrustedIssuersListForm />
            </div>
        </div>
    </div>
</template>
