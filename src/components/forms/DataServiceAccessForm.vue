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
            dataServiceAccess: {
            }
        };
    },
    watch: {
        "dataServiceAccess.hasRole"(hasRole) {
            if (hasRole) {
                const role = this.$store.getters["roles/getRole"](this.workspace.id, hasRole);
                this.dataServiceAccess.roleName = role.name;
            }
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const roleId = this.$route.params.roleId;
        const role = this.$store.getters["roles/getRole"](this.workspace.id);
        this.dataServiceAccess.hasRole = role.id;

        this.dataServiceAccess.hasWorkspace = this.workspace.id;

        this.dataServices = this.$store.getters["dataServices/getDataServices"](this.workspace.id);

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
            <label for="data-service-id" class="form-label">{{ Utils.capitalize($t("main.data_service")) }}</label>
            <select id="data-service-id" v-model="dataServiceAccess.hasDataService" class="form-select" required>
                <option v-for="dataService in dataServices" :key="dataService.id" :value="dataService.id">{{ dataService.name ?? dataService.id }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
