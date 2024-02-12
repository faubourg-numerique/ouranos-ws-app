<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TrustedIssuersListForm from "@/components/forms/TrustedIssuersListForm";

export default {
    components: {
        BreadcrumbNav,
        TrustedIssuersListForm
    },
    created() {
        const trustedIssuersListId = this.$route.params.trustedIssuersListId;
        this.trustedIssuersList = this.$store.getters["trustedIssuersLists/getTrustedIssuersList"](trustedIssuersListId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.trusted_issuers_lists")),
                route: {
                    name: "trustedIssuersLists.index"
                }
            },
            {
                name: this.trustedIssuersList.name,
                route: {
                    name: "trustedIssuersLists.show",
                    params: {
                        trustedIssuersListId: this.trustedIssuersList.id
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
            <div class="card-header">{{ trustedIssuersList.name }}</div>
            <div class="card-body">
                <TrustedIssuersListForm :trusted-issuers-list-prop="trustedIssuersList" />
            </div>
        </div>
    </div>
</template>
