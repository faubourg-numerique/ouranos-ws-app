<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        trustedIssuersListProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            trustedIssuersList: {}
        };
    },
    watch: {
        "trustedIssuersList.description"(description) {
            if (description === "") {
                delete this.trustedIssuersList.description;
            }
        },
        "trustedIssuersList.scheme"(scheme) {
            if (scheme === "https") {
                if (Utils.isUndefined(this.trustedIssuersList.disableCertificateVerification)) {
                    this.trustedIssuersList.disableCertificateVerification = false;
                }
            } else {
                delete this.trustedIssuersList.disableCertificateVerification;
            }
        },
        "trustedIssuersList.path"(path) {
            if (path === "") {
                delete this.trustedIssuersList.path;
            }
        }
    },
    created() {
        if (this.trustedIssuersListProp) {
            this.update = true;
            Object.assign(this.trustedIssuersList, this.trustedIssuersListProp);
        }
    },
    methods: {
        async storeTrustedIssuersList() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.trustedIssuersList = await this.$store.dispatch("trustedIssuersLists/storeTrustedIssuersList", this.trustedIssuersList);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.trusted_issuers_list_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "trustedIssuersLists.show", params: { trustedIssuersListId: this.trustedIssuersList.id } });
        },
        async updateTrustedIssuersList() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("trustedIssuersLists/updateTrustedIssuersList", this.trustedIssuersList);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.trusted_issuers_list_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "trustedIssuersLists.show", params: { trustedIssuersListId: this.trustedIssuersList.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateTrustedIssuersList() : storeTrustedIssuersList()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="trustedIssuersList.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="trustedIssuersList.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="scheme" class="form-label">{{ Utils.capitalize($t("main.scheme")) }}</label>
            <select id="scheme" v-model="trustedIssuersList.scheme" class="form-select" required>
                <option value="http">http</option>
                <option value="https">https</option>
            </select>
        </div>
        <div v-if="trustedIssuersList.scheme === 'https'" class="mb-3">
            <div class="form-check">
                <input id="disable-certificate-verification" v-model="trustedIssuersList.disableCertificateVerification" class="form-check-input" type="checkbox">
                <label for="disable-certificate-verification" class="form-check-label">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</label>
            </div>
        </div>
        <div class="mb-3">
            <label for="host" class="form-label">{{ Utils.capitalize($t("main.host")) }}</label>
            <input id="host" v-model="trustedIssuersList.host" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="port" class="form-label">{{ Utils.capitalize($t("main.port")) }}</label>
            <input id="port" v-model="trustedIssuersList.port" type="number" class="form-control" min="0" max="65535" step="1" required>
        </div>
        <div class="mb-3">
            <label for="path" class="form-label">{{ Utils.capitalize($t("main.path")) }}</label>
            <input id="path" v-model="trustedIssuersList.path" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <label for="implementation-name" class="form-label">{{ Utils.capitalize($t("main.implementation_name")) }}</label>
            <select id="implementation-name" v-model="trustedIssuersList.implementationName" class="form-select" required>
                <option value="fiware-trusted-issuers-list">Fiware VC Verifier</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="implementation-version" class="form-label">{{ Utils.capitalize($t("main.implementation_version")) }}</label>
            <input id="implementation-version" v-model="trustedIssuersList.implementationVersion" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
