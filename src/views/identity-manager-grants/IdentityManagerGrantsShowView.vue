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
        const identityManagerGrantId = this.$route.params.identityManagerGrantId;
        this.identityManagerGrant = this.$store.getters["identityManagerGrants/getIdentityManagerGrant"](identityManagerGrantId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.identity_manager_grants")),
                route: {
                    name: "identityManagerGrants.index"
                }
            },
            {
                active: true,
                name: this.identityManagerGrant.name
            }
        ];
    },
    methods: {
        async destroyIdentityManagerGrant() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.identity_manager_grant_deletion_question"),
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
                await this.$store.dispatch("identityManagerGrants/destroyIdentityManagerGrant", this.identityManagerGrant);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.identity_manager_grant_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "identityManagerGrants.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ identityManagerGrant.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateIdentityManagerGrant(identityManagerGrant.id)" :to="{ name: 'identityManagerGrants.edit', params: { identityManagerGrantId: identityManagerGrant.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyIdentityManagerGrant(identityManagerGrant.id)" class="btn btn-danger btn-sm ms-3" @click="destroyIdentityManagerGrant">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ identityManagerGrant.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ identityManagerGrant.name }}</dd>
                    <template v-if="identityManagerGrant.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ identityManagerGrant.description }}</dd>
                    </template>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.grant_type")) }}</dt>
                    <dd class="col-sm-8 mb-0">{{ identityManagerGrant.grantType }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
