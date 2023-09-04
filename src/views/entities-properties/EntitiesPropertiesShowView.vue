<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import PropertiesTable from "@/components/PropertiesTable";
import SpinnerAnimation from "@/components/SpinnerAnimation";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav,
        PropertiesTable,
        SpinnerAnimation
    },
    data() {
        return {
            error: null,
            property: null,
            propertiesOfProperties: null,
            entity: null
        };
    },
    async created() {
        this.workspaceId = this.$route.params.workspaceId;
        this.entityId = this.$route.params.entityId;
        this.propertyId = this.$route.params.propertyId;
        this.typeId = this.$route.params.typeId;

        this.workspace = this.$store.getters["workspaces/getWorkspace"](this.workspaceId);
        this.type = this.$store.getters["types/getType"](this.workspace.id, this.typeId);
        this.properties = this.$store.getters["properties/getProperties"](this.workspaceId, this.typeId);
        this.property = this.properties[this.propertyId];

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.entities")),
                route: {
                    name: "workspace",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.entityId,
                route: {
                    name: "workspace",
                    params: {
                        workspaceId: this.workspace.id
                    },
                    query: {
                        typeId: this.type.id,
                        entityId: this.entityId
                    }
                }
            },
            {
                active: true,
                name: this.property.name
            }
        ];

        this.entity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspaceId, entityId: this.entityId });

        this.propertiesOfProperties = [];
        Object.values(this.properties).forEach(property => {
            if (!property.hasProperty) return;
            if (property.hasProperty !== this.property.id) return;
            if (!this.entity.attributeExists(this.getPropertyName(property.id))) return;
            this.propertiesOfProperties.push(property);
        });
    },
    methods: {
        async destroyAttribute() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.entity_attribute_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            const name = this.$store.getters["properties/getPropertyName"](this.workspaceId, this.typeId, this.propertyId);
            this.entity.deleteAttribute(name);
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.entity = await this.$store.dispatch("entities/updateEntity", { workspaceId: this.workspaceId, typeId: this.typeId, entity: this.entity });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.entity_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspace", params: { workspaceId: this.workspaceId }, query: { typeId: this.typeId, entityId: this.entity.getId() } });
        },
        getPropertyName(propertyId) {
            return this.$store.getters["properties/getPropertyName"](this.workspaceId, this.typeId, propertyId);
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ property? property.name : null }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateEntity(workspace.id, entityId)" :to="{ name: 'entities.properties.create', params: { workspaceId: workspaceId, entityId: entityId }, query: { typeId: typeId, parentPropertyId: propertyId } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-plus" />
                    </RouterLink>
                    <RouterLink v-if="$authorization.canUpdateEntity(workspace.id, entityId)" :to="{ name: 'entities.properties.edit', params: { workspaceId: workspaceId, entityId: entityId, propertyId: propertyId }, query: { typeId: typeId } }" class="btn btn-primary btn-sm ms-3">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canUpdateEntity(workspace.id, entityId)" class="btn btn-danger btn-sm ms-3" @click="destroyAttribute">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <SpinnerAnimation v-if="!entity" />
                <div v-else>
                    <template v-if="property.multiValued">
                        <table v-if="property.ngsiLdType === 'Property'" class="table mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>{{ Utils.capitalize($t("main.dataset_id")) }}</th>
                                    <th>{{ Utils.capitalize($t("main.value")) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(attribute, index) in entity.getMultiValuedAttribute(property.name)" :key="index">
                                    <td class="font-monospace">{{ attribute.datasetId }}</td>
                                    <td>{{ attribute.value }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table v-else-if="property.ngsiLdType === 'Relationship'" class="table mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>{{ Utils.capitalize($t("main.dataset_id")) }}</th>
                                    <th>{{ Utils.capitalize($t("main.id")) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(attribute, index) in entity.getMultiValuedAttribute(property.name)" :key="index">
                                    <td class="font-monospace">{{ attribute.datasetId }}</td>
                                    <td class="font-monospace">
                                        <RouterLink :to="{ name: 'workspace', params: { workspaceId: workspaceId }, query: { typeId: property.relationshipType, entityId: attribute.object } }">
                                            {{ attribute.object }}
                                        </RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                    <template v-else>
                        <div v-if="property.ngsiLdType === 'Property'">
                            <div v-if="property.propertyNgsiLdValueType === 'String' || property.propertyNgsiLdValueType === 'Number'">{{ entity.getProperty(property.name) }}</div>
                            <div v-else-if="property.propertyNgsiLdValueType === 'Boolean'"><i class="fa-solid" :class="{ 'fa-circle-check text-success': entity.getProperty(property.name), 'fa-circle-xmark text-danger': !entity.getProperty(property.name) }" /></div>
                            <div v-else-if="property.propertyNgsiLdValueType === 'Object' || property.propertyNgsiLdValueType === 'Array'" style="white-space: pre-wrap;">
                                {{ JSON.stringify(entity.getProperty(property.name), null, 4) }}
                            </div>
                        </div>
                        <div v-else-if="property.ngsiLdType === 'GeoProperty'" />
                        <div v-else-if="property.ngsiLdType === 'Relationship'">
                            <RouterLink :to="{ name: 'workspace', params: { workspaceId: workspaceId }, query: { typeId: typeId, entityId: entityId } }">
                                {{ entity.getRelationship(property.name) }}
                            </RouterLink>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div v-if="propertiesOfProperties && propertiesOfProperties.length" class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.properties_of_properties")) }}</div>
            <div class="card-body">
                <PropertiesTable :workspace-id="workspaceId" :type-id="typeId" :entity="entity" :properties="propertiesOfProperties" />
            </div>
        </div>
    </div>
</template>
