<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        dataServiceAccessProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            notBefore: null,
            notOnOrAfter: null,
            dataServiceAccess: {
                synchronized: false,
                synchronizationTime: 0,
                lastDelegationEvidence: null
            }
        };
    },
    watch: {
        notBefore(notBefore) {
            if (notBefore) {
                this.dataServiceAccess.notBefore = parseInt(Date.parse(notBefore) / 1000);
            }
        },
        notOnOrAfter(notOnOrAfter) {
            if (notOnOrAfter) {
                this.dataServiceAccess.notOnOrAfter = parseInt(Date.parse(notOnOrAfter) / 1000);
            }
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const dataServiceId = this.$route.params.dataServiceId;
        this.dataService = this.$store.getters["dataServices/getDataService"](dataServiceId);

        this.dataServiceAccess.hasWorkspace = workspaceId;
        this.dataServiceAccess.hasDataService = dataServiceId;

        if (this.dataServiceAccessProp) {
            this.update = true;
            Object.assign(this.dataServiceAccess, this.dataServiceAccessProp);
        }
    },
    methods: {
        async storeDataServiceAccess() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                this.dataServiceAccess = await this.$store.dispatch("dataServiceAccesses/storeDataServiceAccess", { workspaceId: this.workspace.id, dataServiceAccess: this.dataServiceAccess });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_access_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServiceAccesses.show", params: { dataServiceAccessId: this.dataServiceAccess.id } });
        },
        async updateDataServiceAccess() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("dataServiceAccesses/updateDataServiceAccess", { workspaceId: this.workspace.id, dataServiceAccess: this.dataServiceAccess });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_access_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServiceAccesses.show", params: { dataServiceAccessId: this.dataServiceAccess.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateDataServiceAccess() : storeDataServiceAccess()">
        <div class="mb-3">
            <label for="not-before" class="form-label">{{ Utils.capitalize($t("main.not_before")) }}</label>
            <input id="not-before" v-model="notBefore" type="datetime-local" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="not-on-or-after" class="form-label">{{ Utils.capitalize($t("main.not_on_or_after")) }}</label>
            <input id="not-on-or-after" v-model="notOnOrAfter" type="datetime-local" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="data-service-provider-id" class="form-label">{{ Utils.capitalize($t("main.data_service_provider_id")) }}</label>
            <input id="data-service-provider-id" v-model="dataServiceAccess.dataServiceProviderId" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="role-name" class="form-label">{{ Utils.capitalize($t("main.role_name")) }}</label>
            <input id="role-name" v-model="dataServiceAccess.roleName" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="verifiable-credential-type" class="form-label">{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</label>
            <input id="verifiable-credential-type" v-model="dataServiceAccess.verifiableCredentialType" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
