<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const authorizationRegistryId = this.$route.params.authorizationRegistryId;
        this.authorizationRegistry = this.$store.getters["authorizationRegistries/getAuthorizationRegistry"](authorizationRegistryId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.authorization_registries")),
                route: {
                    name: "authorizationRegistries.index"
                }
            },
            {
                active: true,
                name: this.authorizationRegistry.name
            }
        ];
    },
    methods: {
        async destroyAuthorizationRegistry() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.authorization_registry_deletion_question"),
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
                await this.$store.dispatch("authorizationRegistries/destroyAuthorizationRegistry", this.authorizationRegistry);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.authorization_registry_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "authorizationRegistries.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ authorizationRegistry.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateAuthorizationRegistry(authorizationRegistry.id)" :to="{ name: 'authorizationRegistries.edit', params: { authorizationRegistryId: authorizationRegistry.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyAuthorizationRegistry(authorizationRegistry.id)" class="btn btn-danger btn-sm ms-3" @click="destroyAuthorizationRegistry">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.name }}</dd>
                    <template v-if="authorizationRegistry.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ authorizationRegistry.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.identifier")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.identifier }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.scheme")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.scheme }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.host")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.host }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.port")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.port }}</dd>
                    <template v-if="authorizationRegistry.path">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.path")) }}</dt>
                        <dd class="col-sm-8">{{ authorizationRegistry.path }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.oauth2_token_path")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.oauth2TokenPath }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.delegation_path")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.delegationPath }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.policy_path")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.policyPath }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.implementation_name")) }}</dt>
                    <dd class="col-sm-8">{{ authorizationRegistry.implementationName }}</dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.implementation_version")) }}</dt>
                    <dd class="col-sm-8 mb-0">{{ authorizationRegistry.implementationVersion }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
