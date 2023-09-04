<script>
import JsonViewer from "vue-json-viewer";

export default {
    components: {
        JsonViewer
    },
    data() {
        return {
            authorizationRegistryId: null,
            authorizationRegistryGrantId: null,
            delegationRequest: null,
            delegationEvidence: null,
            delegationEvidenceResponse: null,
            error: null
        };
    },
    created() {
        this.authorizationRegistries = this.$store.getters["authorizationRegistries/getAuthorizationRegistries"];
        this.authorizationRegistryGrants = this.$store.getters["authorizationRegistryGrants/getAuthorizationRegistryGrants"];
    },
    methods: {
        async requestDelegation() {
            const config = {
                title: this.Utils.capitalize(this.$t("main.delegation_request")),
                input: "textarea",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.request")),
                denyButtonText: this.Utils.capitalize(this.$t("main.cancel")),
                heightAuto: false,
                customClass: "delegation-form"
            };
            if (this.delegationRequest) {
                config.inputValue = JSON.stringify(this.delegationRequest, null, 4);
            }
            const result = await this.$swal.fire(config);
            if (!result.isConfirmed) {
                return;
            }
            try {
                this.delegationRequest = JSON.parse(result.value);
            } catch (error) {
                this.$swal.fire({
                    title: this.$t("dialogs.json_parsing_failed"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.delegationEvidenceResponse = await this.$store.dispatch("authorizationRegistryProxy/requestDelegation", { authorizationRegistryId: this.authorizationRegistryId, authorizationRegistryGrantId: this.authorizationRegistryGrantId, delegationRequest: this.delegationRequest });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.delegationEvidenceResponse = null;
                this.$swal.fire({
                    title: this.$t("dialogs.delegation_request_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
        },
        async createPolicy() {
            const config = {
                title: this.Utils.capitalize(this.$t("main.create_policy")),
                input: "textarea",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.create")),
                denyButtonText: this.Utils.capitalize(this.$t("main.cancel")),
                heightAuto: false,
                customClass: "delegation-form"
            };
            if (this.delegationEvidence) {
                config.inputValue = JSON.stringify(this.delegationEvidence, null, 4);
            }
            const result = await this.$swal.fire(config);
            if (!result.isConfirmed) {
                return;
            }
            try {
                this.delegationEvidence = JSON.parse(result.value);
            } catch (error) {
                this.$swal.fire({
                    title: this.$t("dialogs.json_parsing_failed"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("authorizationRegistryProxy/createPolicy", { authorizationRegistryId: this.authorizationRegistryId, authorizationRegistryGrantId: this.authorizationRegistryGrantId, delegationEvidence: this.delegationEvidence });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.policy_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$swal.fire({
                title: this.$t("dialogs.policy_creation_success"),
                icon: "success",
                heightAuto: false
            });
        }
    }
};
</script>

<template>
    <div style="max-width: 1000px;" class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.authorization_registries")) }}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <label for="authorization-registry" class="form-label">{{ Utils.capitalize($t("main.authorization_registry")) }}</label>
                        <select id="authorization-registry" v-model="authorizationRegistryId" class="form-select" required>
                            <option v-for="authorizationRegistry in authorizationRegistries" :key="authorizationRegistry.id" :value="authorizationRegistry.id">{{ authorizationRegistry.name }}</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="authorization-registry-grant" class="form-label">{{ Utils.capitalize($t("main.authorization_registry_grant")) }}</label>
                        <select id="authorization-registry-grant" v-model="authorizationRegistryGrantId" class="form-select" required>
                            <option v-for="authorizationRegistryGrant in authorizationRegistryGrants" :key="authorizationRegistryGrant.id" :value="authorizationRegistryGrant.id">{{ authorizationRegistryGrant.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="authorizationRegistryId && authorizationRegistryGrantId" class="card mt-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.delegation_request")) }}</span>
                <span>
                    <button class="btn btn-primary btn-sm" @click="requestDelegation">
                        <i class="fa-solid fa-magnifying-glass" />
                    </button>
                    <button class="btn btn-primary btn-sm ms-3" @click="createPolicy">
                        <i class="fa-solid fa-plus" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <JsonViewer v-if="delegationEvidenceResponse" :value="delegationEvidenceResponse" expanded :expand-depth="10" />
                <div v-else class="alert alert-info mb-0">{{ $t("dialogs.request_delegation") }}</div>
            </div>
        </div>
    </div>
</template>
<style>
.delegation-form {
    width: 800px !important;
    min-height: 400px !important;
}

.delegation-form textarea {
    min-height: 100% !important;
}
</style>
