<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import EntityPropertyForm from "@/components/forms/EntityPropertyForm";
import SpinnerAnimation from "@/components/SpinnerAnimation";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav,
        EntityPropertyForm,
        SpinnerAnimation
    },
    data() {
        return {
            entity: null,
            properties: null,
            workspaceId: null,
            typeId: null,
            entityId: null,
            error: null,
            creatableProperties: null,
            propertyId: null,
            propertyValue: null,
            geoPropertyType: null,
            geoPropertyCoordinates: null,
            relationshipEntities: null,
            relationshipEntityId: null
        };
    },
    watch: {
        async propertyId(propertyId) {
            const property = this.properties[propertyId];

            if (property.ngsiLdType === "Relationship") {
                const type = this.$store.getters["types/getType"](this.workspaceId, property.relationshipType);
                const query = {
                    type: type.name
                };
                this.relationshipEntities = await this.$store.dispatch("entities/indexEntities", { workspaceId: this.workspaceId, query: query });
            }
        }
    },
    async created() {
        this.workspaceId = this.$route.params.workspaceId;
        this.entityId = this.$route.params.entityId;
        this.typeId = this.$route.params.typeId;
        this.parentPropertyId = this.$route.query.parentPropertyId;

        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.type = this.$store.getters["types/getType"](this.workspaceId, this.typeId);

        this.properties = this.$store.getters["properties/getProperties"](this.workspaceId, this.typeId);

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
                name: this.Utils.capitalize(this.$t("main.create_an_entity_property"))
            }
        ];

        this.entity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspaceId, entityId: this.entityId });

        this.creatableProperties = [];
        Object.values(this.properties).forEach(property => {
            if (this.parentPropertyId) {
                if (!property.hasProperty) {
                    return;
                }
                if (property.hasProperty !== this.parentPropertyId) {
                    return;
                }
            } else {
                if (property.hasProperty) {
                    return;
                }
            }
            const name = this.$store.getters["properties/getPropertyName"](this.workspaceId, this.typeId, property.id);
            if (this.entity.attributeExists(name)) return;
            this.creatableProperties.push(property);
        });
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_entity_property")) }}</div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <SpinnerAnimation v-if="!entity" />
                <div v-else>
                    <div>
                        <label for="property-id" class="form-label">{{ Utils.capitalize($t("main.property")) }}</label>
                        <select id="property-id" v-model="propertyId" class="form-select" required>
                            <option v-for="property in creatableProperties" :key="property.id" :value="property.id">{{ property.name }}</option>
                        </select>
                        <div v-if="propertyId && properties[propertyId].description" class="form-text">{{ properties[propertyId].description }}</div>
                    </div>
                    <EntityPropertyForm v-if="propertyId" class="mt-3" :update="false" :workspace-id="workspaceId" :type-id="typeId" :entity="entity" :properties="properties" :property-id="propertyId" />
                </div>
            </div>
        </div>
    </div>
</template>
