<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import VCVerifierForm from "@/components/forms/VCVerifierForm";

export default {
    components: {
        BreadcrumbNav,
        VCVerifierForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.vc_verifiers")),
                route: {
                    name: "vcVerifiers.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_vc_verifier")) }}</div>
            <div class="card-body">
                <VCVerifierForm />
            </div>
        </div>
    </div>
</template>
