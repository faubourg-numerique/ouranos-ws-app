<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { dataModelsUrl } from "@/config.js";

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

        const typeId = this.$route.params.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        this.properties = {};
        var properties = Object.values(this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id));
        properties = this.Utils.sortEntitiesByName(properties);
        properties.forEach(property => {
            this.properties[property.id] = property;
        });

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.types")),
                route: {
                    name: "types.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.type.name
            }
        ];
    },
    methods: {
        async destroyType() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.type_deletion_question"),
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
                await this.$store.dispatch("types/destroyType", { workspaceId: this.workspace.id, type: this.type });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.type_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "types.index", params: { workspaceId: this.workspace.id } });

            this.breadcrumbItems = [
                {
                    name: this.Utils.capitalize(this.$t("main.types")),
                    route: {
                        name: "types.index",
                        params: {
                            workspaceId: this.workspace.id
                        }
                    }
                },
                {
                    active: true,
                    name: this.type.name
                }
            ];
        },
        dataModelUrl() {
            return `${dataModelsUrl}/${this.workspace.dataModelName}/${this.workspace.dataModelVersion}/${this.type.name}/context.jsonld`;
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ type.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateType(workspace.id, type.id)" :to="{ name: 'types.edit', params: { workspaceId: workspace.id, typeId: type.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyType(workspace.id, type.id)" class="btn btn-danger btn-sm ms-3" @click="destroyType">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ type.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ type.name }}</dd>
                    <template v-if="type.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ type.description }}</dd>
                    </template>
                    <template v-if="type.url">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.url")) }}</dt>
                        <dd class="col-sm-8"><a :href="type.url" target="_blank">{{ type.url }}</a></dd>
                    </template>
                    <template v-if="type.dataModelGroup">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.data_model_group")) }}</dt>
                        <dd class="col-sm-8">{{ Utils.capitalize($t("main." + type.dataModelGroup.replaceAll("-", "_"))) }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.standard_data_model_based")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="type.standardDataModelBased" />
                    </dd>
                    <template v-if="type.standardDataModelBased">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.standard_data_model_type")) }}</dt>
                        <dd class="col-sm-8">{{ type.standardDataModelType }}</dd>
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.standard_data_model_definition_url")) }}</dt>
                        <dd class="col-sm-8"><a :href="type.standardDataModelDefinitionUrl" target="_blank">{{ type.standardDataModelDefinitionUrl }}</a></dd>
                    </template>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.data_model_url")) }}</dt>
                    <dd class="col-sm-8 mb-0"><a :href="dataModelUrl()" target="_blank">{{ dataModelUrl() }}</a></dd>
                </dl>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.properties")) }}</span>
                <span>
                    <template v-if="type.standardDataModelBased">
                        <RouterLink :to="{ name: 'properties.import', params: { workspaceId: workspace.id, typeId: type.id } }" class="btn btn-primary btn-sm">
                            <i class="fa-solid fa-arrow-down" />
                        </RouterLink>
                    </template>
                    <RouterLink v-if="$authorization.canStoreProperty(workspace.id)" :to="{ name: 'properties.create', params: { workspaceId: workspace.id, typeId: type.id } }" class="btn btn-primary btn-sm ms-3">
                        <i class="fa-solid fa-plus" />
                    </RouterLink>
                </span>
            </div>
            <div class="card-body">
                <div v-if="!Object.values(properties).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_property") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.description")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="property in properties" :key="property.id">
                            <td>
                                <span v-if="property.hasProperty" class="me-2">{{ properties[property.hasProperty].name }} /</span>
                                <RouterLink :to="{ name: 'properties.show', params: { workspaceId: workspace.id, typeId: type.id, propertyId: property.id } }">{{ property.name }}</RouterLink>
                            </td>
                            <td>{{ property.description }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
