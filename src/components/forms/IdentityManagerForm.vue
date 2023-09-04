<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        identityManagerProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            identityManager: {}
        };
    },
    watch: {
        "identityManager.description"(description) {
            if (description === "") {
                delete this.identityManager.description;
            }
        },
        "identityManager.scheme"(scheme) {
            if (scheme === "https") {
                if (Utils.isUndefined(this.identityManager.disableCertificateVerification)) {
                    this.identityManager.disableCertificateVerification = false;
                }
            } else {
                delete this.identityManager.disableCertificateVerification;
            }
        },
        "identityManager.path"(path) {
            if (path === "") {
                delete this.identityManager.path;
            }
        },
        "identityManager.userPath"(userPath) {
            if (userPath === "") {
                delete this.identityManager.userPath;
            }
        }
    },
    created() {
        if (this.identityManagerProp) {
            this.update = true;
            Object.assign(this.identityManager, this.identityManagerProp);
        }
    },
    methods: {
        async storeIdentityManager() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.identityManager = await this.$store.dispatch("identityManagers/storeIdentityManager", this.identityManager);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.Utils.capitalize(this.$t("dialogs.identity_manager_creation_failure")),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "identityManagers.show", params: { identityManagerId: this.identityManager.id } });
        },
        async updateIdentityManager() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("identityManagers/updateIdentityManager", this.identityManager);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.Utils.capitalize(this.$t("dialogs.identity_manager_update_failure")),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "identityManagers.show", params: { identityManagerId: this.identityManager.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateIdentityManager() : storeIdentityManager()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="identityManager.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="identityManager.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="scheme" class="form-label">{{ Utils.capitalize($t("main.scheme")) }}</label>
            <select id="scheme" v-model="identityManager.scheme" class="form-select" required>
                <option value="http">http</option>
                <option value="https">https</option>
            </select>
        </div>
        <div v-if="identityManager.scheme === 'https'" class="mb-3">
            <div class="form-check">
                <input id="disable-certificate-verification" v-model="identityManager.disableCertificateVerification" class="form-check-input" type="checkbox">
                <label for="disable-certificate-verification" class="form-check-label">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</label>
            </div>
        </div>
        <div class="mb-3">
            <label for="host" class="form-label">{{ Utils.capitalize($t("main.host")) }}</label>
            <input id="host" v-model="identityManager.host" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="port" class="form-label">{{ Utils.capitalize($t("main.port")) }}</label>
            <input id="port" v-model="identityManager.port" type="number" class="form-control" min="0" max="65535" step="1" required>
        </div>
        <div class="mb-3">
            <label for="path" class="form-label">{{ Utils.capitalize($t("main.path")) }}</label>
            <input id="path" v-model="identityManager.path" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <label for="oauth2-token-path" class="form-label">{{ Utils.capitalize($t("main.oauth2_token_path")) }}</label>
            <input id="oauth2-token-path" v-model="identityManager.oauth2TokenPath" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="user-path" class="form-label">{{ Utils.capitalize($t("main.user_path")) }}</label>
            <input id="user-path" v-model="identityManager.userPath" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <label for="implementation-name" class="form-label">{{ Utils.capitalize($t("main.implementation_name")) }}</label>
            <select id="implementation-name" v-model="identityManager.implementationName" class="form-select" required>
                <option value="keyrock">Keyrock</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="implementation-version" class="form-label">{{ Utils.capitalize($t("main.implementation_version")) }}</label>
            <input id="implementation-version" v-model="identityManager.implementationVersion" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
