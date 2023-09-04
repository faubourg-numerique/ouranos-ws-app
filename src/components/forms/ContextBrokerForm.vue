<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        contextBrokerProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            customHeader: {
                name: null,
                value: null
            },
            contextBroker: {
                multiTenancyEnabled: false
            }
        };
    },
    watch: {
        "contextBroker.description"(description) {
            if (description === "") {
                delete this.contextBroker.description;
            }
        },
        "contextBroker.scheme"(scheme) {
            if (scheme === "https") {
                if (Utils.isUndefined(this.contextBroker.disableCertificateVerification)) {
                    this.contextBroker.disableCertificateVerification = false;
                }
            } else {
                delete this.contextBroker.disableCertificateVerification;
            }
        },
        "contextBroker.path"(path) {
            if (path === "") {
                delete this.contextBroker.path;
            }
        }
    },
    created() {
        if (this.contextBrokerProp) {
            this.update = true;
            Object.assign(this.contextBroker, this.contextBrokerProp);
        }
    },
    methods: {
        async storeContextBroker() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.contextBroker = await this.$store.dispatch("contextBrokers/storeContextBroker", this.contextBroker);
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
            this.$router.push({ name: "contextBrokers.show", params: { contextBrokerId: this.contextBroker.id } });
        },
        async updateContextBroker() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("contextBrokers/updateContextBroker", this.contextBroker);
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
            this.$router.push({ name: "contextBrokers.show", params: { contextBrokerId: this.contextBroker.id } });
        },
        addCustomHeader() {
            if (!this.contextBroker.customHeaders) {
                this.contextBroker.customHeaders = {};
            }

            this.contextBroker.customHeaders[this.customHeader.name] = this.customHeader.value;

            this.customHeader.name = null;
            this.customHeader.value = null;
        },
        removeCustomHeader(name) {
            delete this.contextBroker.customHeaders[name];

            if (this.Utils.isEmpty(this.contextBroker.customHeaders)) {
                delete this.contextBroker.customHeaders;
            }
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateContextBroker() : storeContextBroker()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="contextBroker.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="contextBroker.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="scheme" class="form-label">{{ Utils.capitalize($t("main.scheme")) }}</label>
            <select id="scheme" v-model="contextBroker.scheme" class="form-select" required>
                <option value="http">http</option>
                <option value="https">https</option>
            </select>
        </div>
        <div v-if="contextBroker.scheme === 'https'" class="mb-3">
            <div class="form-check">
                <input id="disable-certificate-verification" v-model="contextBroker.disableCertificateVerification" class="form-check-input" type="checkbox">
                <label for="disable-certificate-verification" class="form-check-label">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</label>
            </div>
        </div>
        <div class="mb-3">
            <label for="host" class="form-label">{{ Utils.capitalize($t("main.host")) }}</label>
            <input id="host" v-model="contextBroker.host" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="port" class="form-label">{{ Utils.capitalize($t("main.port")) }}</label>
            <input id="port" v-model="contextBroker.port" type="number" class="form-control" min="0" max="65535" step="1" required>
        </div>
        <div class="mb-3">
            <label for="path" class="form-label">{{ Utils.capitalize($t("main.path")) }}</label>
            <input id="path" v-model="contextBroker.path" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <div class="form-check">
                <input id="multi-tenancy-enabled" v-model="contextBroker.multiTenancyEnabled" class="form-check-input" type="checkbox">
                <label for="multi-tenancy-enabled" class="form-check-label">{{ Utils.capitalize($t("main.multi_tenancy_enabled")) }}</label>
            </div>
        </div>
        <div class="mb-3">
            <label for="pagination-max-limit" class="form-label">{{ Utils.capitalize($t("main.pagination_max_limit")) }}</label>
            <input id="pagination-max-limit" v-model="contextBroker.paginationMaxLimit" type="number" class="form-control" min="1" step="1" required>
        </div>
        <div class="mb-3">
            <label for="implementation-name" class="form-label">{{ Utils.capitalize($t("main.implementation_name")) }}</label>
            <select id="implementation-name" v-model="contextBroker.implementationName" class="form-select" required>
                <option value="orion-ld">Orion-LD</option>
                <option value="scorpio">Scorpio</option>
                <option value="stellio">Stellio</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="implementation-version" class="form-label">{{ Utils.capitalize($t("main.implementation_version")) }}</label>
            <input id="implementation-version" v-model="contextBroker.implementationVersion" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">{{ Utils.capitalize($t("main.custom_headers")) }}</label>
            <table class="table table-sm align-middle mb-0">
                <thead>
                    <tr>
                        <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        <th>{{ Utils.capitalize($t("main.value")) }}</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    <template v-if="contextBroker.customHeaders">
                        <tr v-for="(value, name) in contextBroker.customHeaders" :key="name">
                            <td>{{ name }}</td>
                            <td>{{ value }}</td>
                            <td><button type="button" class="btn btn-danger btn-sm w-100" @click="removeCustomHeader(name)">{{ Utils.capitalize($t("main.remove")) }}</button></td>
                        </tr>
                    </template>
                    <tr>
                        <td><input v-model="customHeader.name" type="text" :placeholder="Utils.capitalize($t('main.name'))" class="form-control form-control-sm"></td>
                        <td><input v-model="customHeader.value" type="text" :placeholder="Utils.capitalize($t('main.value'))" class="form-control form-control-sm"></td>
                        <td><button type="button" class="btn btn-primary btn-sm w-100" :disabled="!customHeader.name" @click="addCustomHeader">{{ Utils.capitalize($t("main.set")) }}</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
