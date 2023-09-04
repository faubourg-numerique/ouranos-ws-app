<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        authorizationRegistryGrantProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            authorizationRegistryGrant: {
                certificates: []
            }
        };
    },
    watch: {
        "authorizationRegistryGrant.description"(description) {
            if (description === "") {
                delete this.authorizationRegistryGrant.description;
            }
        }
    },
    created() {
        if (this.authorizationRegistryGrantProp) {
            this.update = true;
            Object.assign(this.authorizationRegistryGrant, this.authorizationRegistryGrantProp);
        }
    },
    methods: {
        addCertificate() {

        },
        async storeAuthorizationRegistryGrant() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.authorizationRegistryGrant = await this.$store.dispatch("authorizationRegistryGrants/storeAuthorizationRegistryGrant", this.authorizationRegistryGrant);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.authorization_registry_grant_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "authorizationRegistryGrants.show", params: { authorizationRegistryGrantId: this.authorizationRegistryGrant.id } });
        },
        async updateAuthorizationRegistryGrant() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("authorizationRegistryGrants/updateAuthorizationRegistryGrant", this.authorizationRegistryGrant);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.authorization_registry_grant_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "authorizationRegistryGrants.show", params: { authorizationRegistryGrantId: this.authorizationRegistryGrant.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateAuthorizationRegistryGrant() : storeAuthorizationRegistryGrant()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="authorizationRegistryGrant.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="authorizationRegistryGrant.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="identifier" class="form-label">{{ Utils.capitalize($t("main.identifier")) }}</label>
            <input id="identifier" v-model="authorizationRegistryGrant.identifier" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="certificates" class="form-label">{{ Utils.capitalize($t("main.certificates")) }}</label>
            <input v-model="authorizationRegistryGrant.certificates[0]" type="text" class="form-control font-monospace mb-3" required>
            <input v-model="authorizationRegistryGrant.certificates[1]" type="text" class="form-control font-monospace mb-3" required>
            <input v-model="authorizationRegistryGrant.certificates[2]" type="text" class="form-control font-monospace" required>
            <div class="form-text">{{ $t("dialogs.no_line_breaks_or_tags") }}</div>
        </div>
        <div class="mb-3">
            <label for="privateKey" class="form-label">{{ Utils.capitalize($t("main.private_key")) }}</label>
            <input id="privateKey" v-model="authorizationRegistryGrant.privateKey" type="text" class="form-control font-monospace" required>
            <div class="form-text">{{ $t("dialogs.no_line_breaks_or_tags") }}</div>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
