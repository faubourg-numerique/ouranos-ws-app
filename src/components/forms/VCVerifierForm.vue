<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        vcVerifierProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            vcVerifier: {}
        };
    },
    watch: {
        "vcVerifier.description"(description) {
            if (description === "") {
                delete this.vcVerifier.description;
            }
        },
        "vcVerifier.scheme"(scheme) {
            if (scheme === "https") {
                if (Utils.isUndefined(this.vcVerifier.disableCertificateVerification)) {
                    this.vcVerifier.disableCertificateVerification = false;
                }
            } else {
                delete this.vcVerifier.disableCertificateVerification;
            }
        },
        "vcVerifier.path"(path) {
            if (path === "") {
                delete this.vcVerifier.path;
            }
        }
    },
    created() {
        if (this.vcVerifierProp) {
            this.update = true;
            Object.assign(this.vcVerifier, this.vcVerifierProp);
        }
    },
    methods: {
        async storeVCVerifier() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.vcVerifier = await this.$store.dispatch("vcVerifiers/storeVCVerifier", this.vcVerifier);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.vc_verifier_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "vcVerifiers.show", params: { vcVerifierId: this.vcVerifier.id } });
        },
        async updateVCVerifier() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("vcVerifiers/updateVCVerifier", this.vcVerifier);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.vc_verifier_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "vcVerifiers.show", params: { vcVerifierId: this.vcVerifier.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateVCVerifier() : storeVCVerifier()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="vcVerifier.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="vcVerifier.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="scheme" class="form-label">{{ Utils.capitalize($t("main.scheme")) }}</label>
            <select id="scheme" v-model="vcVerifier.scheme" class="form-select" required>
                <option value="http">http</option>
                <option value="https">https</option>
            </select>
        </div>
        <div v-if="vcVerifier.scheme === 'https'" class="mb-3">
            <div class="form-check">
                <input id="disable-certificate-verification" v-model="vcVerifier.disableCertificateVerification" class="form-check-input" type="checkbox">
                <label for="disable-certificate-verification" class="form-check-label">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</label>
            </div>
        </div>
        <div class="mb-3">
            <label for="host" class="form-label">{{ Utils.capitalize($t("main.host")) }}</label>
            <input id="host" v-model="vcVerifier.host" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="port" class="form-label">{{ Utils.capitalize($t("main.port")) }}</label>
            <input id="port" v-model="vcVerifier.port" type="number" class="form-control" min="0" max="65535" step="1" required>
        </div>
        <div class="mb-3">
            <label for="path" class="form-label">{{ Utils.capitalize($t("main.path")) }}</label>
            <input id="path" v-model="vcVerifier.path" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <label for="implementation-name" class="form-label">{{ Utils.capitalize($t("main.implementation_name")) }}</label>
            <select id="implementation-name" v-model="vcVerifier.implementationName" class="form-select" required>
                <option value="orion-ld">Orion-LD</option>
                <option value="scorpio">Scorpio</option>
                <option value="stellio">Stellio</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="implementation-version" class="form-label">{{ Utils.capitalize($t("main.implementation_version")) }}</label>
            <input id="implementation-version" v-model="vcVerifier.implementationVersion" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
