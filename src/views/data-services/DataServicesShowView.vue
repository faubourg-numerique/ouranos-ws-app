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

        const dataServiceId = this.$route.params.dataServiceId;
        this.dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);

        this.dataServiceActions = this.$store.getters["dataServiceActions/getDataServiceActionsByDataServiceId"](this.workspace.id, this.dataService.id);
        this.dataServiceProperties = this.$store.getters["dataServiceProperties/getDataServicePropertiesByDataServiceId"](this.workspace.id, this.dataService.id);

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
                name: this.dataService.id
            }
        ];
    },
    methods: {
        getDataActionById(dataActionId) {
            return this.$store.getters["dataActions/getDataAction"](dataActionId);
        },
        getPropertyById(propertyId) {
            return this.$store.getters["properties/getProperty"](this.workspace.id, this.type.id, propertyId);
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
                        <span class="badge text-bg-primary me-2" v-for="dataServiceAction in dataServiceActions" :key="dataServiceAction.id">{{ getDataActionById(dataServiceAction.hasDataAction).name }}</span>
                    </dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.properties")) }}</dt>
                    <dd class="col-sm-8 mb-0">
                        <span class="badge text-bg-primary me-2" v-for="dataServiceProperty in dataServiceProperties" :key="dataServiceProperty.id">{{ getPropertyById(dataServiceProperty.hasProperty).name }}</span>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
