<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        authorizationRegistryProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            authorizationRegistry: {
                certificates: []
            }
        };
    },
    watch: {
        "authorizationRegistry.description"(description) {
            if (description === "") {
                delete this.authorizationRegistry.description;
            }
        },
        "authorizationRegistry.path"(path) {
            if (path === "") {
                delete this.authorizationRegistry.path;
            }
        }
    },
    created() {
        if (this.authorizationRegistryProp) {
            this.update = true;
            Object.assign(this.authorizationRegistry, this.authorizationRegistryProp);
        }
    },
    methods: {
        async storeAuthorizationRegistry() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.authorizationRegistry = await this.$store.dispatch("authorizationRegistries/storeAuthorizationRegistry", this.authorizationRegistry);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.Utils.capitalize(this.$t("dialogs.authorization_registry_creation_failure")),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "authorizationRegistries.show", params: { authorizationRegistryId: this.authorizationRegistry.id } });
        },
        async updateAuthorizationRegistry() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("authorizationRegistries/updateAuthorizationRegistry", this.authorizationRegistry);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.Utils.capitalize(this.$t("dialogs.authorization_registry_update_failure")),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "authorizationRegistries.show", params: { authorizationRegistryId: this.authorizationRegistry.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateAuthorizationRegistry() : storeAuthorizationRegistry()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="authorizationRegistry.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="authorizationRegistry.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="identifier" class="form-label">{{ Utils.capitalize($t("main.identifier")) }}</label>
            <input id="identifier" v-model="authorizationRegistry.identifier" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="certificates" class="form-label">{{ Utils.capitalize($t("main.certificates")) }}</label>
            <input v-model="authorizationRegistry.certificates[0]" type="text" class="form-control font-monospace mb-3" required>
            <input v-model="authorizationRegistry.certificates[1]" type="text" class="form-control font-monospace mb-3" required>
            <input v-model="authorizationRegistry.certificates[2]" type="text" class="form-control font-monospace" required>
            <div class="form-text">{{ $t("dialogs.no_line_breaks_or_tags") }}</div>
        </div>
        <div class="mb-3">
            <label for="scheme" class="form-label">{{ Utils.capitalize($t("main.scheme")) }}</label>
            <select id="scheme" v-model="authorizationRegistry.scheme" class="form-select" required>
                <option value="http">http</option>
                <option value="https">https</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="host" class="form-label">{{ Utils.capitalize($t("main.host")) }}</label>
            <input id="host" v-model="authorizationRegistry.host" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="port" class="form-label">{{ Utils.capitalize($t("main.port")) }}</label>
            <input id="port" v-model="authorizationRegistry.port" type="number" class="form-control" min="0" max="65535" step="1" required>
        </div>
        <div class="mb-3">
            <label for="path" class="form-label">{{ Utils.capitalize($t("main.path")) }}</label>
            <input id="path" v-model="authorizationRegistry.path" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <label for="oauth2-token-path" class="form-label">{{ Utils.capitalize($t("main.oauth2_token_path")) }}</label>
            <input id="oauth2-token-path" v-model="authorizationRegistry.oauth2TokenPath" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="delegation-path" class="form-label">{{ Utils.capitalize($t("main.delegation_path")) }}</label>
            <input id="delegation-path" v-model="authorizationRegistry.delegationPath" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="policy-path" class="form-label">{{ Utils.capitalize($t("main.policy_path")) }}</label>
            <input id="policy-path" v-model="authorizationRegistry.policyPath" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="implementation-name" class="form-label">{{ Utils.capitalize($t("main.implementation_name")) }}</label>
            <select id="implementation-name" v-model="authorizationRegistry.implementationName" class="form-select" required>
                <option value="keyrock">Keyrock</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="implementation-version" class="form-label">{{ Utils.capitalize($t("main.implementation_version")) }}</label>
            <input id="implementation-version" v-model="authorizationRegistry.implementationVersion" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
