<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        identityManagerGrantProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            identityManagerGrant: {}
        };
    },
    watch: {
        "identityManagerGrant.description"(description) {
            if (description === "") {
                delete this.identityManagerGrant.description;
            }
        },
        "identityManagerGrant.grantType"(grantType) {
            if (grantType !== "password") {
                delete this.identityManagerGrant.username;
                delete this.identityManagerGrant.password;
            }
        }
    },
    created() {
        if (this.identityManagerGrantProp) {
            this.update = true;
            Object.assign(this.identityManagerGrant, this.identityManagerGrantProp);
        }
    },
    methods: {
        async storeIdentityManagerGrant() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.identityManagerGrant = await this.$store.dispatch("identityManagerGrants/storeIdentityManagerGrant", this.identityManagerGrant);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.identity_manager_grant_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "identityManagerGrants.show", params: { identityManagerGrantId: this.identityManagerGrant.id } });
        },
        async updateIdentityManagerGrant() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("identityManagerGrants/updateIdentityManagerGrant", this.identityManagerGrant);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.identity_manager_grant_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "identityManagerGrants.show", params: { identityManagerGrantId: this.identityManagerGrant.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateIdentityManagerGrant() : storeIdentityManagerGrant()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="identityManagerGrant.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="identityManagerGrant.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="grant-type" class="form-label">{{ Utils.capitalize($t("main.grant_type")) }}</label>
            <select id="grant-type" v-model="identityManagerGrant.grantType" class="form-select" required>
                <option value="client_credentials">client_credentials</option>
                <option value="password">password</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="client-id" class="form-label">{{ Utils.capitalize($t("main.client_id")) }}</label>
            <input id="client-id" v-model="identityManagerGrant.clientId" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="client-secret" class="form-label">{{ Utils.capitalize($t("main.client_secret")) }}</label>
            <input id="client-secret" v-model="identityManagerGrant.clientSecret" type="password" class="form-control" required>
        </div>
        <template v-if="identityManagerGrant.grantType === 'password'">
            <div class="mb-3">
                <label for="username" class="form-label">{{ Utils.capitalize($t("main.username")) }}</label>
                <input id="username" v-model="identityManagerGrant.username" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">{{ Utils.capitalize($t("main.password")) }}</label>
                <input id="password" v-model="identityManagerGrant.password" type="password" class="form-control" required>
            </div>
        </template>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
