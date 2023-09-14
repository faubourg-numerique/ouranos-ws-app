<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.dataServices = this.$store.getters["dataServices/getDataServices"](this.workspace.id);
    },
    methods: {
        getTypeNameByDataServiceId(dataServiceId) {
            const dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);
            const type = this.$store.getters["types/getType"](this.workspace.id, dataService.hasEntityType);
            return type.name;
        },
        getDataActionNamesByDataServiceId(dataServiceId) {
            const dataServiceActions = this.$store.getters["dataServiceActions/getDataServiceActionsByDataServiceId"](this.workspace.id, dataServiceId);
            const dataActionNames = [];
            dataServiceActions.forEach(dataServiceAction => {
                const dataAction = this.$store.getters["dataActions/getDataAction"](dataServiceAction.hasDataAction);
                dataActionNames.push(dataAction.name);
            });
            return dataActionNames.join(", ");
        },
        getPropertyNamesByDataServiceId(dataServiceId) {
            const dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);
            const dataServiceProperties = this.$store.getters["dataServiceProperties/getDataServicePropertiesByDataServiceId"](this.workspace.id, dataService.id);
            const propertyNames = [];
            dataServiceProperties.forEach(dataServiceProperty => {
                const property = this.$store.getters["properties/getProperty"](this.workspace.id, dataService.hasEntityType, dataServiceProperty.hasProperty);
                propertyNames.push(property.name);
            });
            return propertyNames.join(", ");
        }
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.data_services")) }}</span>
                <RouterLink :to="{ name: 'dataServices.create' }" class="btn btn-primary btn-sm" v-if="$authorization.canStoreDataService(workspace.id)">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(dataServices).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_data_service") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th />
                            <th>{{ Utils.capitalize($t("main.type")) }}</th>
                            <th>{{ Utils.capitalize($t("main.actions")) }}</th>
                            <th>{{ Utils.capitalize($t("main.properties")) }}</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dataService in dataServices" :key="dataService.id">
                            <td>
                                <RouterLink :to="{ name: 'dataServices.show', params: { workspaceId: workspace.id, dataServiceId: dataService.id } }" class="btn btn-light btn-sm">
                                    <i class="fa-solid fa-right-to-bracket" />
                                </RouterLink>
                            </td>
                            <td>{{ getTypeNameByDataServiceId(dataService.id) }}</td>
                            <td>{{ getDataActionNamesByDataServiceId(dataService.id) }}</td>
                            <td>{{ getPropertyNamesByDataServiceId(dataService.id) }}</td>
                            <td class="text-center">
                                <template v-if="dataService.isDemand && dataService.isOffer">🡅🡇</template>
                                <template v-else-if="dataService.isDemand">🡇</template>
                                <template v-else-if="dataService.isOffer">🡅</template>
                                <template v-else>■</template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
