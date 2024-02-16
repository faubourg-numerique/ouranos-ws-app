<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        roleProp: {
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
            role: {
                synchronized: false,
                synchronizationTime: 0,
                lastDelegationEvidence: null
            }
        };
    },
    watch: {
        notBefore(notBefore) {
            if (notBefore) {
                this.role.notBefore = parseInt(Date.parse(notBefore) / 1000);
            }
        },
        notOnOrAfter(notOnOrAfter) {
            if (notOnOrAfter) {
                this.role.notOnOrAfter = parseInt(Date.parse(notOnOrAfter) / 1000);
            }
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.role.hasWorkspace = this.workspace.id;

        if (this.roleProp) {
            this.update = true;
            Object.assign(this.role, this.roleProp);
        }
    },
    methods: {
        async storeRole() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                this.role = await this.$store.dispatch("roles/storeRole", { workspaceId: this.workspace.id, role: this.role });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.role_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "roles.show", params: { roleId: this.role.id } });
        },
        async updateRole() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("roles/updateRole", { workspaceId: this.workspace.id, role: this.role });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.role_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "roles.show", params: { roleId: this.role.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateRole() : storeRole()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="role.name" v-focus type="text" class="form-control" required>
        </div>
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
            <input id="data-service-provider-id" v-model="role.dataServiceProviderId" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="verifiable-credential-type" class="form-label">{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</label>
            <input id="verifiable-credential-type" v-model="role.verifiableCredentialType" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
