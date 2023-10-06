<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import VCVerifierForm from "@/components/forms/VCVerifierForm";

export default {
    components: {
        BreadcrumbNav,
        VCVerifierForm
    },
    created() {
        const vcVerifierId = this.$route.params.vcVerifierId;
        this.vcVerifier = this.$store.getters["vcVerifiers/getVCVerifier"](vcVerifierId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.vc_verifiers")),
                route: {
                    name: "vcVerifiers.index"
                }
            },
            {
                name: this.vcVerifier.name,
                route: {
                    name: "vcVerifiers.show",
                    params: {
                        vcVerifierId: this.vcVerifier.id
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
            <div class="card-header">{{ vcVerifier.name }}</div>
            <div class="card-body">
                <VCVerifierForm :vc-verifier-prop="vcVerifier" />
            </div>
        </div>
    </div>
</template>
