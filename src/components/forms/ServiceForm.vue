<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        serviceProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            service: {
                authorizationRequired: false
            }
        };
    },
    watch: {
        "service.description"(description) {
            if (description === "") {
                delete this.service.description;
            }
        },
        "service.authorizationRequired"(authorizationRequired) {
            if (!authorizationRequired) {
                delete this.service.hasIdentityManager;
                delete this.service.hasIdentityManagerGrant;
            }
        }
    },
    created() {
        if (this.serviceProp) {
            this.update = true;
            Object.assign(this.service, this.serviceProp);
        }

        this.identityManagerGrants = this.$store.getters["identityManagerGrants/getIdentityManagerGrants"];
        this.identityManagers = this.$store.getters["identityManagers/getIdentityManagers"];
        this.contextBrokers = this.$store.getters["contextBrokers/getContextBrokers"];
    },
    methods: {
        async storeService() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.service = await this.$store.dispatch("services/storeService", this.service);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.service_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "services.show", params: { serviceId: this.service.id } });
        },
        async updateService() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("services/updateService", this.service);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.service_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "services.show", params: { serviceId: this.service.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateService() : storeService()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="service.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="service.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="context-broker" class="form-label">{{ Utils.capitalize($t("main.context_broker")) }}</label>
            <select id="context-broker" v-model="service.hasContextBroker" class="form-select" required>
                <option v-for="contextBroker in contextBrokers" :key="contextBroker.id" :value="contextBroker.id">{{ contextBroker.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <div class="form-check">
                <input id="authorization-required" v-model="service.authorizationRequired" class="form-check-input" type="checkbox">
                <label for="authorization-required" class="form-check-label">{{ Utils.capitalize($t("main.authorization_required")) }}</label>
            </div>
        </div>
        <template v-if="service.authorizationRequired">
            <div class="mb-3">
                <label for="identity-manager" class="form-label">{{ Utils.capitalize($t("main.identity_manager")) }}</label>
                <select id="identity-manager" v-model="service.hasIdentityManager" class="form-select" required>
                    <option v-for="identityManager in identityManagers" :key="identityManager.id" :value="identityManager.id">{{ identityManager.name }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="identity-manager-grant" class="form-label">{{ Utils.capitalize($t("main.identity_manager_grant")) }}</label>
                <select id="identity-manager-grant" v-model="service.hasIdentityManagerGrant" class="form-select" required>
                    <option v-for="identityManagerGrant in identityManagerGrants" :key="identityManagerGrant.id" :value="identityManagerGrant.id">{{ identityManagerGrant.name }}</option>
                </select>
            </div>
        </template>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
