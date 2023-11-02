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
    computed: {
        dataServiceAccess() {
            const dataServiceAccessId = this.$route.params.dataServiceAccessId;
            return this.$store.getters["dataServiceAccesses/getDataServiceAccess"](this.workspace.id, dataServiceAccessId);
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const dataServiceId = this.$route.params.dataServiceId;
        this.dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.data_services")),
                route: {
                    name: "dataServices.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.Utils.capitalize(this.$t("main.data_service")),
                route: {
                    name: "dataServices.show",
                    params: {
                        workspaceId: this.workspace.id,
                        dataServiceId: this.dataService.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.data_service_access"))
            }
        ];
    },
    methods: {
        async destroyDataServiceAccess() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.data_service_access_deletion_question"),
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
                await this.$store.dispatch("dataServiceAccesses/destroyDataServiceAccess", { workspaceId: this.workspace.id, dataServiceAccess: this.dataServiceAccess });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_access_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServices.show", params: { workspaceId: this.workspace.id, dataServiceId: this.dataService.id } });
        },
        async synchronizeDataServiceAccess() {
            let result = await this.$swal.fire({
                title: this.$t("dialogs.data_service_access_synchronization_question"),
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
                title: this.$t("dialogs.data_service_access_synchronization_permit_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.permit")),
                denyButtonText: this.Utils.capitalize(this.$t("main.deny")),
                heightAuto: false
            });
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("dataServiceAccesses/synchronizeDataServiceAccess", { workspaceId: this.workspace.id, dataServiceAccess: this.dataServiceAccess, permit: result.isConfirmed });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_access_synchronization_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$swal.fire({
                title: this.$t("dialogs.data_service_access_synchronization_success"),
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
                <span>{{ dataServiceAccess.id }}</span>
                <span>
                    <button v-if="$authorization.canUpdateDataServiceAccess(workspace.id, dataServiceAccess.id)" class="btn btn-primary btn-sm" @click="synchronizeDataServiceAccess">
                        <i class="fa-solid fa-sync-alt" />
                    </button>
                    <RouterLink v-if="$authorization.canUpdateDataServiceAccess(workspace.id, dataServiceAccess.id)" :to="{ name: 'dataServiceAccesses.edit', params: { name: dataServiceAccess.id } }" class="btn btn-primary btn-sm ms-3">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyDataServiceAccess(workspace.id, dataServiceAccess.id)" class="btn btn-danger btn-sm ms-3" @click="destroyDataServiceAccess">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceAccess.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.not_before")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceAccess.notBefore }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.not_on_or_after")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceAccess.notOnOrAfter }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.synchronized")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="dataServiceAccess.synchronized" />
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.synchronization_time")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceAccess.synchronizationTime }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_service_provider_id")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceAccess.dataServiceProviderId }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceAccess.verifiableCredentialType }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.role_name")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceAccess.roleName }}</dd>
                    <template v-if="dataServiceAccess.lastDelegationEvidence">
                        <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.last_delegation_evidence")) }}</dt>
                        <dd class="col-sm-8 font-monospace mb-0">
                            <JsonViewer :value="dataServiceAccess.lastDelegationEvidence" expanded :expand-depth="10" />
                        </dd>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
