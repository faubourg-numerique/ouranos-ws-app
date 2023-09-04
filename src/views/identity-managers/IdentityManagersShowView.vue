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
        const identityManagerId = this.$route.params.identityManagerId;
        this.identityManager = this.$store.getters["identityManagers/getIdentityManager"](identityManagerId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.identity_managers")),
                route: {
                    name: "identityManagers.index"
                }
            },
            {
                active: true,
                name: this.identityManager.name
            }
        ];
    },
    methods: {
        async destroyIdentityManager() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.identity_manager_deletion_question"),
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
                await this.$store.dispatch("identityManagers/destroyIdentityManager", this.identityManager);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.identity_manager_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "identityManagers.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ identityManager.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateIdentityManager(identityManager.id)" :to="{ name: 'identityManagers.edit', params: { identityManagerId: identityManager.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyIdentityManager(identityManager.id)" class="btn btn-danger btn-sm ms-3" @click="destroyIdentityManager">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ identityManager.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ identityManager.name }}</dd>
                    <template v-if="identityManager.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ identityManager.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.scheme")) }}</dt>
                    <dd class="col-sm-8">{{ identityManager.scheme }}</dd>
                    <template v-if="identityManager.scheme === 'https'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</dt>
                        <dd class="col-sm-8">
                            <BooleanIcon :value="identityManager.disableCertificateVerification" />
                        </dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.host")) }}</dt>
                    <dd class="col-sm-8">{{ identityManager.host }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.port")) }}</dt>
                    <dd class="col-sm-8">{{ identityManager.port }}</dd>
                    <template v-if="identityManager.path">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.path")) }}</dt>
                        <dd class="col-sm-8">{{ identityManager.path }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.oauth2_token_path")) }}</dt>
                    <dd class="col-sm-8">{{ identityManager.oauth2TokenPath }}</dd>
                    <template v-if="identityManager.userPath">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.user_path")) }}</dt>
                        <dd class="col-sm-8">{{ identityManager.userPath }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.implementation_name")) }}</dt>
                    <dd class="col-sm-8">{{ identityManager.implementationName }}</dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.implementation_version")) }}</dt>
                    <dd class="col-sm-8 mb-0">{{ identityManager.implementationVersion }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
