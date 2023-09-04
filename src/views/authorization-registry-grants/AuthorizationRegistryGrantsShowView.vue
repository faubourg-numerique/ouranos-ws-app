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
        const authorizationRegistryGrantId = this.$route.params.authorizationRegistryGrantId;
        this.authorizationRegistryGrant = this.$store.getters["authorizationRegistryGrants/getAuthorizationRegistryGrant"](authorizationRegistryGrantId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.authorization_registry_grants")),
                route: {
                    name: "authorizationRegistryGrants.index"
                }
            },
            {
                active: true,
                name: this.authorizationRegistryGrant.name
            }
        ];
    },
    methods: {
        async destroyAuthorizationRegistryGrant() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.authorization_registry_grant_deletion_question"),
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
                await this.$store.dispatch("authorizationRegistryGrants/destroyAuthorizationRegistryGrant", this.authorizationRegistryGrant);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.authorization_registry_grant_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "authorizationRegistryGrants.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ authorizationRegistryGrant.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateAuthorizationRegistryGrant(authorizationRegistryGrant.id)" :to="{ name: 'authorizationRegistryGrants.edit', params: { authorizationRegistryGrantId: authorizationRegistryGrant.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyAuthorizationRegistryGrant(authorizationRegistryGrant.id)" class="btn btn-danger btn-sm ms-3" @click="destroyAuthorizationRegistryGrant">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ authorizationRegistryGrant.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ authorizationRegistryGrant.name }}</dd>
                    <template v-if="authorizationRegistryGrant.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ authorizationRegistryGrant.description }}</dd>
                    </template>
                    <dt class="col-sm-3 mb-0">{{ Utils.capitalize($t("main.identifier")) }}</dt>
                    <dd class="col-sm-9 mb-0">{{ authorizationRegistryGrant.identifier }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
