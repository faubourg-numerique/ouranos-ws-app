<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        temporalServiceProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            temporalService: {
                authorizationRequired: false
            }
        };
    },
    watch: {
        "temporalService.description"(description) {
            if (description === "") {
                delete this.temporalService.description;
            }
        },
        "temporalService.scheme"(scheme) {
            if (scheme === "https") {
                if (Utils.isUndefined(this.temporalService.disableCertificateVerification)) {
                    this.temporalService.disableCertificateVerification = false;
                }
            } else {
                delete this.temporalService.disableCertificateVerification;
            }
        },
        "temporalService.path"(path) {
            if (path === "") {
                delete this.temporalService.path;
            }
        },
        "temporalService.temporalServiceType"(temporalServiceType) {
            if (temporalServiceType !== "mintaka") {
                delete this.temporalService.version;
                delete this.temporalService.scheme;
                delete this.temporalService.host;
                delete this.temporalService.port;
                delete this.temporalService.path;
                delete this.temporalService.authorizationRequired;
                delete this.temporalService.hasIdentityManager;
                delete this.temporalService.hasIdentityManagerGrant;
            }
        },
        "temporalService.authorizationRequired"(authorizationRequired) {
            if (!authorizationRequired) {
                delete this.temporalService.hasIdentityManager;
                delete this.temporalService.hasIdentityManagerGrant;
            }
        }
    },
    created() {
        if (this.temporalServiceProp) {
            this.update = true;
            Object.assign(this.temporalService, this.temporalServiceProp);
        } else {
            this.temporalService.authorizationRequired = false;
        }

        this.identityManagerGrants = this.$store.getters["identityManagerGrants/getIdentityManagerGrants"];
        this.identityManagers = this.$store.getters["identityManagers/getIdentityManagers"];
    },
    methods: {
        async storeTemporalService() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.temporalService = await this.$store.dispatch("temporalServices/storeTemporalService", this.temporalService);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.context_broker_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "temporalServices.show", params: { temporalServiceId: this.temporalService.id } });
        },
        async updateTemporalService() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("temporalServices/updateTemporalService", this.temporalService);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.context_broker_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "temporalServices.show", params: { temporalServiceId: this.temporalService.id } });
        }
    }
};
</script>
    
<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateTemporalService() : storeTemporalService()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="temporalService.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="temporalService.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="temporal-service-type" class="form-label">{{ Utils.capitalize($t("main.type")) }}</label>
            <select id="temporal-service-type" v-model="temporalService.temporalServiceType" class="form-select" required :disabled="update">
                <option value="ngsi-ld">NGSI-LD</option>
                <option value="mintaka">Mintaka</option>
            </select>
        </div>
        <template v-if="temporalService.temporalServiceType === 'mintaka'">
            <div class="mb-3">
                <label for="version" class="form-label">{{ Utils.capitalize($t("main.version")) }}</label>
                <input id="version" v-model="temporalService.version" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="scheme" class="form-label">{{ Utils.capitalize($t("main.scheme")) }}</label>
                <select id="scheme" v-model="temporalService.scheme" class="form-select" required>
                    <option value="http">http</option>
                    <option value="https">https</option>
                </select>
            </div>
            <div v-if="temporalService.scheme === 'https'" class="mb-3">
                <div class="form-check">
                    <input id="disable-certificate-verification" v-model="temporalService.disableCertificateVerification" class="form-check-input" type="checkbox">
                    <label for="disable-certificate-verification" class="form-check-label">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</label>
                </div>
            </div>
            <div class="mb-3">
                <label for="host" class="form-label">{{ Utils.capitalize($t("main.host")) }}</label>
                <input id="host" v-model="temporalService.host" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="port" class="form-label">{{ Utils.capitalize($t("main.port")) }}</label>
                <input id="port" v-model="temporalService.port" type="number" class="form-control" min="0" max="65535" step="1" required>
            </div>
            <div class="mb-3">
                <label for="path" class="form-label">{{ Utils.capitalize($t("main.path")) }}</label>
                <input id="path" v-model="temporalService.path" type="text" class="form-control">
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input id="authorization-required" v-model="temporalService.authorizationRequired" class="form-check-input" type="checkbox">
                    <label for="authorization-required" class="form-check-label">{{ Utils.capitalize($t("main.authorization_required")) }}</label>
                </div>
            </div>
            <template v-if="temporalService.authorizationRequired">
                <div class="mb-3">
                    <label for="identity-manager" class="form-label">{{ Utils.capitalize($t("main.identity_manager")) }}</label>
                    <select id="identity-manager" v-model="temporalService.hasIdentityManager" class="form-select" required>
                        <option v-for="identityManager in identityManagers" :key="identityManager.id" :value="identityManager.id">{{ identityManager.name }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="identity-manager-grant" class="form-label">{{ Utils.capitalize($t("main.identity_manager_grant")) }}</label>
                    <select id="identity-manager-grant" v-model="temporalService.hasIdentityManagerGrant" class="form-select" required>
                        <option v-for="identityManagerGrant in identityManagerGrants" :key="identityManagerGrant.id" :value="identityManagerGrant.id">{{ identityManagerGrant.name }}</option>
                    </select>
                </div>
            </template>
        </template>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
