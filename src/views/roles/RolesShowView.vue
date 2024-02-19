<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import JsonViewer from "vue-json-viewer";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
        BreadcrumbNav,
        JsonViewer
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const roleId = this.$route.params.roleId;
        this.role = this.$store.getters["roles/getRole"](this.workspace.id, roleId);

        this.dataServiceAccesses = this.$store.getters["dataServiceAccesses/getDataServiceAccesses"](this.workspace.id, this.role.id);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.roles")),
                route: {
                    name: "roles.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.role.name
            }
        ];
    },
    methods: {
        dataService(dataServiceId) {
            return this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);
        },
        async destroyRole() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.role_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("roles/destroyRole", { workspaceId: this.workspace.id, role: this.role });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.role_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "roles.index" });
        },
        async synchronizeRole() {
            let result = await this.$swal.fire({
                title: this.$t("dialogs.role_synchronization_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            result = await this.$swal.fire({
                title: this.$t("dialogs.role_synchronization_permit_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.permit")),
                denyButtonText: this.Utils.capitalize(this.$t("main.deny")),
                heightAuto: false
            });
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("roles/synchronizeRole", { workspaceId: this.workspace.id, role: this.role, permit: result.isConfirmed });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.role_synchronization_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$swal.fire({
                title: this.$t("dialogs.role_synchronization_success"),
                icon: "success",
                heightAuto: false
            });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ role.name }}</span>
                <span>
                    <button v-if="$authorization.canUpdateRole(workspace.id, role.id)" class="btn btn-primary btn-sm" @click="synchronizeRole">
                        <i class="fa-solid fa-sync-alt" />
                    </button>
                    <RouterLink v-if="$authorization.canUpdateRole(workspace.id, role.id)" :to="{ name: 'roles.edit', params: { name: role.id } }" class="btn btn-primary btn-sm ms-3">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyRole(workspace.id, role.id)" class="btn btn-danger btn-sm ms-3" @click="destroyRole" disabled>
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ role.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ role.name }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.not_before")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ new Date(role.notBefore * 1000).toISOString() }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.not_on_or_after")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ new Date(role.notOnOrAfter * 1000).toISOString() }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.synchronized")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="role.synchronized" />
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.synchronization_time")) }}</dt>
                    <dd class="col-sm-8 font-monospace">{{ new Date(role.synchronizationTime * 1000).toISOString() }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_service_provider_id")) }}</dt>
                    <dd class="col-sm-8">{{ role.dataServiceProviderId }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</dt>
                    <dd class="col-sm-8">{{ role.verifiableCredentialType }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.role_name")) }}</dt>
                    <dd class="col-sm-8">{{ role.roleName }}</dd>
                    <template v-if="role.lastDelegationEvidence">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.access_policy")) }}</dt>
                        <dd class="col-sm-8 font-monospace">
                            <JsonViewer :value="role.lastDelegationEvidence" expanded :expand-depth="10" />
                        </dd>
                    </template>
                </dl>
            </div>
        </div>
        <div class="card mt-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.data_service_accesses")) }}</span>
                <RouterLink v-if="$authorization.canStoreDataServiceAccess(workspace.id)" :to="{ name: 'dataServiceAccesses.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(dataServiceAccesses).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_data_service_access") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th />
                            <th>{{ Utils.capitalize($t("main.data_service")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dataServiceAccess in dataServiceAccesses" :key="dataServiceAccess.id">
                            <td>
                                <RouterLink :to="{ name: 'dataServiceAccesses.show', params: { workspaceId: workspace.id, dataServiceAccessId: dataServiceAccess.id } }" class="btn btn-light btn-sm">
                                    <i class="fa-solid fa-right-to-bracket" />
                                </RouterLink>
                            </td>
                            <td>
                                <RouterLink :to="{ name: 'dataServices.show', params: { dataServiceId: dataServiceAccess.hasDataService }}">{{ dataService(dataServiceAccess.hasDataService).name || dataServiceAccess.hasDataService }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
