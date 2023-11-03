<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
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

        const dataServiceId = this.$route.params.dataServiceId;
        this.dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);

        this.dataServiceActions = this.$store.getters["dataServiceActions/getDataServiceActionsByDataServiceId"](this.workspace.id, this.dataService.id);
        this.dataServiceProperties = this.$store.getters["dataServiceProperties/getDataServicePropertiesByDataServiceId"](this.workspace.id, this.dataService.id);
        this.dataServiceOffers = this.$store.getters["dataServiceOffers/getDataServiceOffers"](this.workspace.id, this.dataService.id);
        this.dataServiceAccesses = this.$store.getters["dataServiceAccesses/getDataServiceAccesses"](this.workspace.id, this.dataService.id);

        this.type = this.$store.getters["types/getType"](this.workspace.id, this.dataService.hasEntityType);
        this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id);

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
                active: true,
                name: this.Utils.capitalize(this.$t("main.data_service"))
            }
        ];
    },
    methods: {
        getDataActionById(dataActionId) {
            return this.$store.getters["dataActions/getDataAction"](dataActionId);
        },
        getPropertyById(propertyId) {
            return this.$store.getters["properties/getProperty"](this.workspace.id, this.type.id, propertyId);
        },
        async destroyDataService() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.data_service_deletion_question"),
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
                await this.$store.dispatch("dataServices/destroyDataService", { workspaceId: this.workspace.id, dataService: this.dataService });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            const dataServiceActions = this.$store.getters["dataServiceActions/getDataServiceActionsByDataServiceId"](this.workspace.id, this.dataService.id);
            const dataServiceProperties = this.$store.getters["dataServiceProperties/getDataServicePropertiesByDataServiceId"](this.workspace.id, this.dataService.id);

            for (const dataServiceAction of dataServiceActions) {
                try {
                    await this.$store.dispatch("dataServiceActions/destroyDataServiceAction", { workspaceId: this.workspace.id, dataServiceAction });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_deletion_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            for (const dataServiceProperty of dataServiceProperties) {
                try {
                    await this.$store.dispatch("dataServiceProperties/destroyDataServiceProperty", { workspaceId: this.workspace.id, dataServiceProperty });
                } catch (error) {
                    this.$store.dispatch("setDisplayLoadingScreen", false);
                    this.error = error;
                    this.$swal.fire({
                        title: this.$t("dialogs.data_service_deletion_failure"),
                        icon: "error",
                        heightAuto: false
                    });
                    return;
                }
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServices.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ dataService.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateDataService(workspace.id, dataService.id)" :to="{ name: 'dataServices.edit', params: { name: dataService.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyDataService(workspace.id, dataService.id)" class="btn btn-danger btn-sm ms-3" @click="destroyDataService">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ dataService.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.type")) }}</dt>
                    <dd class="col-sm-8">
                        <RouterLink :to="{ name: 'types.show', params: { workspaceId: workspace.id, typeId: type.id } }">{{ type.name }}</RouterLink>
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.actions")) }}</dt>
                    <dd class="col-sm-8">
                        <span v-for="dataServiceAction in dataServiceActions" :key="dataServiceAction.id" class="badge text-bg-primary me-2">{{ getDataActionById(dataServiceAction.hasDataAction).name }}</span>
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.properties")) }}</dt>
                    <dd class="col-sm-8">
                        <span v-for="dataServiceProperty in dataServiceProperties" :key="dataServiceProperty.id" class="badge text-bg-primary me-2">{{ getPropertyById(dataServiceProperty.hasProperty).name }}</span>
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.is_demand")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="dataService.isDemand" />
                    </dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.is_offer")) }}</dt>
                    <dd class="col-sm-8 mb-0">
                        <BooleanIcon :value="dataService.isOffer" />
                    </dd>
                </dl>
            </div>
        </div>
        <div v-if="$authorization.canStoreDataServiceAccess(workspace.id)" class="card mt-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.data_service_accesses")) }}</span>
                <RouterLink v-if="!Object.values(dataServiceAccesses).length && $authorization.canStoreDataServiceAccess(workspace.id)" :to="{ name: 'dataServiceAccesses.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(dataServiceAccesses).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_data_service_access") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th />
                            <th>{{ Utils.capitalize($t("main.role_name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.verifiable_credential_type")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dataServiceAccess in dataServiceAccesses" :key="dataServiceAccess.id">
                            <td>
                                <RouterLink :to="{ name: 'dataServiceAccesses.show', params: { workspaceId: workspace.id, dataServiceId: dataService.id, dataServiceAccessId: dataServiceAccess.id } }" class="btn btn-light btn-sm">
                                    <i class="fa-solid fa-right-to-bracket" />
                                </RouterLink>
                            </td>
                            <td>{{ dataServiceAccess.roleName }}</td>
                            <td>{{ dataServiceAccess.verifiableCredentialType }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="(dataService.isDemand || dataService.isOffer) && dataServiceAccesses.length" class="card mt-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.offerings")) }}</span>
                <RouterLink v-if="$authorization.canStoreDataServiceOffer(workspace.id)" :to="{ name: 'dataServiceOffers.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(dataServiceOffers).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_offering") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.description")) }}</th>
                            <th>{{ Utils.capitalize($t("main.url")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dataServiceOffer in dataServiceOffers" :key="dataServiceOffer.id">
                            <td>
                                <RouterLink :to="{ name: 'dataServiceOffers.show', params: { workspaceId: workspace.id, dataServiceId: dataService.id, dataServiceOfferId: dataServiceOffer.id } }">{{ dataServiceOffer.description }}</RouterLink>
                            </td>
                            <td><a :href="dataServiceOffer.url" target="_blank">{{ dataServiceOffer.url }}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
