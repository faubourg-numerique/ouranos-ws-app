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
                active: true,
                name: this.trustedIssuersList.name
            }
        ];
    },
    methods: {
        async destroyTrustedIssuersList() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.trusted_issuers_list_deletion_question"),
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
                await this.$store.dispatch("trustedIssuersLists/destroyTrustedIssuersList", this.trustedIssuersList);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.trusted_issuers_list_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "trustedIssuersLists.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ trustedIssuersList.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateTrustedIssuersList(trustedIssuersList.id)" :to="{ name: 'trustedIssuersLists.edit', params: { trustedIssuersListId: trustedIssuersList.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyTrustedIssuersList(trustedIssuersList.id)" class="btn btn-danger btn-sm ms-3" @click="destroyTrustedIssuersList">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ trustedIssuersList.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ trustedIssuersList.name }}</dd>
                    <template v-if="trustedIssuersList.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ trustedIssuersList.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.scheme")) }}</dt>
                    <dd class="col-sm-8">{{ trustedIssuersList.scheme }}</dd>
                    <template v-if="trustedIssuersList.scheme === 'https'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</dt>
                        <dd class="col-sm-8">
                            <BooleanIcon :value="trustedIssuersList.disableCertificateVerification" />
                        </dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.host")) }}</dt>
                    <dd class="col-sm-8">{{ trustedIssuersList.host }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.port")) }}</dt>
                    <dd class="col-sm-8">{{ trustedIssuersList.port }}</dd>
                    <template v-if="trustedIssuersList.path">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.path")) }}</dt>
                        <dd class="col-sm-8">{{ trustedIssuersList.path }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.implementation_name")) }}</dt>
                    <dd class="col-sm-8">{{ trustedIssuersList.implementationName }}</dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.implementation_version")) }}</dt>
                    <dd class="col-sm-8 mb-0">{{ trustedIssuersList.implementationVersion }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
