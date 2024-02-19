<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const dataServiceAccessId = this.$route.params.dataServiceAccessId;
        this.dataServiceAccess = this.$store.getters["dataServiceAccesses/getDataServiceAccess"](this.workspace.id, dataServiceAccessId);

        this.role = this.$store.getters["roles/getRole"](this.workspace.id, this.dataServiceAccess.hasRole);
        this.dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, this.dataServiceAccess.hasDataService);

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
                name: this.role.name,
                route: {
                    name: "roles.show",
                    params: {
                        workspaceId: this.workspace.id,
                        roleId: this.role.id
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
            this.$router.push({ name: "roles.show", params: { workspaceId: this.workspace.id, roleId: this.role.id } });
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
                    <RouterLink v-if="$authorization.canUpdateDataServiceAccess(workspace.id, dataServiceAccess.id)" :to="{ name: 'dataServiceAccesses.edit', params: { name: dataServiceAccess.id } }" class="btn btn-primary btn-sm">
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
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.data_service")) }}</dt>
                    <dd class="col-sm-8 mb-0">
                        <RouterLink :to="{ name: 'dataServices.show', params: { dataServiceId: dataServiceAccess.hasDataService } }">{{ dataService.name || dataService.id }}</RouterLink>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
