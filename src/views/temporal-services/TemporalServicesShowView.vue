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
        const temporalServiceId = this.$route.params.temporalServiceId;
        this.temporalService = this.$store.getters["temporalServices/getTemporalService"](temporalServiceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.temporal_services")),
                route: {
                    name: "temporalServices.index"
                }
            },
            {
                active: true,
                name: this.temporalService.name
            }
        ];
    },
    methods: {
        async destroyTemporalService() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.temporal_service_deletion_question"),
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
                await this.$store.dispatch("temporalServices/destroyTemporalService", this.temporalService);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.temporal_service_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "temporalServices.index" });
        },
        identityManagerGrant(identityManagerGrantId) {
            return this.$store.getters["identityManagerGrants/getIdentityManagerGrant"](identityManagerGrantId);
        },
        identityManager(identityManagerId) {
            return this.$store.getters["identityManagers/getIdentityManager"](identityManagerId);
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ temporalService.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateTemporalService(temporalService.id)" :to="{ name: 'temporalServices.edit', params: { temporalServiceId: temporalService.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyTemporalService(temporalService.id)" class="btn btn-danger btn-sm ms-3" @click="destroyTemporalService">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ temporalService.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ temporalService.name }}</dd>
                    <template v-if="temporalService.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ temporalService.description }}</dd>
                    </template>
                    <dt class="col-sm-4" :class="{ 'mb-0': temporalService.temporalServiceType !== 'mintaka' }">{{ Utils.capitalize($t("main.type")) }}</dt>
                    <dd class="col-sm-8" :class="{ 'mb-0': temporalService.temporalServiceType !== 'mintaka' }">{{ temporalService.temporalServiceType }}</dd>
                    <template v-if="temporalService.temporalServiceType === 'mintaka'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.version")) }}</dt>
                        <dd class="col-sm-8">{{ temporalService.version }}</dd>
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.scheme")) }}</dt>
                        <dd class="col-sm-8">{{ temporalService.scheme }}</dd>
                        <template v-if="temporalService.scheme === 'https'">
                            <dt class="col-sm-4">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</dt>
                            <dd class="col-sm-8">
                                <BooleanIcon :value="temporalService.disableCertificateVerification" />
                            </dd>
                        </template>
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.host")) }}</dt>
                        <dd class="col-sm-8">{{ temporalService.host }}</dd>
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.port")) }}</dt>
                        <dd class="col-sm-8">{{ temporalService.port }}</dd>
                        <template v-if="temporalService.path">
                            <dt class="col-sm-4">{{ Utils.capitalize($t("main.path")) }}</dt>
                            <dd class="col-sm-8">{{ temporalService.path }}</dd>
                        </template>
                        <dt class="col-sm-4" :class="{ 'mb-0': !temporalService.authorizationRequired }">{{ Utils.capitalize($t("main.authorization_required")) }}</dt>
                        <dd class="col-sm-8" :class="{ 'mb-0': !temporalService.authorizationRequired }">
                            <BooleanIcon :value="temporalService.authorizationRequired" />
                        </dd>
                        <template v-if="temporalService.authorizationRequired">
                            <dt class="col-sm-4">{{ Utils.capitalize($t("main.identity_manager")) }}</dt>
                            <dd class="col-sm-8">
                                <RouterLink v-if="$authorization.canShowIdentityManager(temporalService.hasIdentityManager)" :to="{ name: 'identityManagers.show', params: { identityManagerId: temporalService.hasIdentityManager } }">
                                    {{ identityManager(temporalService.hasIdentityManager).name }}
                                </RouterLink>
                                <template v-else>{{ identityManager(temporalService.hasIdentityManager).name }}</template>
                            </dd>
                            <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.identity_manager_grant")) }}</dt>
                            <dd class="col-sm-8 mb-0">
                                <RouterLink v-if="$authorization.canShowIdentityManagerGrant(temporalService.hasIdentityManagerGrant)" :to="{ name: 'identityManagerGrants.show', params: { identityManagerGrantId: temporalService.hasIdentityManagerGrant } }">
                                    {{ identityManagerGrant(temporalService.hasIdentityManagerGrant).name }}
                                </RouterLink>
                                <template v-else>{{ identityManagerGrant(temporalService.hasIdentityManagerGrant).name }}</template>
                            </dd>
                        </template>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
