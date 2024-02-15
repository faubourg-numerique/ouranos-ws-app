<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
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
                active: true,
                name: this.vcVerifier.name
            }
        ];
    },
    methods: {
        async destroyVCVerifier() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.vc_verifier_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("vcVerifiers/destroyVCVerifier", this.vcVerifier);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.vc_verifier_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "vcVerifiers.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ vcVerifier.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateVCVerifier(vcVerifier.id)" :to="{ name: 'vcVerifiers.edit', params: { vcVerifierId: vcVerifier.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyVCVerifier(vcVerifier.id)" class="btn btn-danger btn-sm ms-3" @click="destroyVCVerifier">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ vcVerifier.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ vcVerifier.name }}</dd>
                    <template v-if="vcVerifier.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ vcVerifier.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.did")) }}</dt>
                    <dd class="col-sm-8">{{ vcVerifier.did }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.scheme")) }}</dt>
                    <dd class="col-sm-8">{{ vcVerifier.scheme }}</dd>
                    <template v-if="vcVerifier.scheme === 'https'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</dt>
                        <dd class="col-sm-8">
                            <BooleanIcon :value="vcVerifier.disableCertificateVerification" />
                        </dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.host")) }}</dt>
                    <dd class="col-sm-8">{{ vcVerifier.host }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.port")) }}</dt>
                    <dd class="col-sm-8">{{ vcVerifier.port }}</dd>
                    <template v-if="vcVerifier.path">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.path")) }}</dt>
                        <dd class="col-sm-8">{{ vcVerifier.path }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.implementation_name")) }}</dt>
                    <dd class="col-sm-8">{{ vcVerifier.implementationName }}</dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.implementation_version")) }}</dt>
                    <dd class="col-sm-8 mb-0">{{ vcVerifier.implementationVersion }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
