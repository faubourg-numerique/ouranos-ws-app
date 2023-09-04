<script>
import { Entity } from "@/classes/Entity";
import BooleanIcon from "@/components/BooleanIcon";

export default {
    components: {
        BooleanIcon
    },
    props: {
        workspaceId: {
            type: String,
            default: null,
            required: true
        },
        typeId: {
            type: String,
            default: null,
            required: true
        },
        entity: {
            type: Entity,
            default: null,
            required: true
        },
        properties: {
            type: Array,
            default: null,
            required: true
        }
    },
    created() {
        this.workspace = this.$store.getters["workspaces/getWorkspace"](this.workspaceId);
        this.type = this.$store.getters["types/getType"](this.workspace.id, this.typeId);
    },
    methods: {
        getPropertyName(propertyId) {
            return this.$store.getters["properties/getPropertyName"](this.workspace.id, this.type.id, propertyId);
        }
    }
}
</script>

<template>
    <table class="table font-monospace mb-0">
        <thead class="table-dark">
            <tr>
                <th>{{ Utils.capitalize($t("main.name")) }}</th>
                <th>{{ Utils.capitalize($t("main.value")) }}</th>
                <th>{{ Utils.capitalize($t("main.temporal")) }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="property in properties" :key="property.id">
                <td>
                    <RouterLink :to="{ name: 'entities.properties.show', params: { workspaceId: workspace.id, entityId: entity.getId(), typeId: type.id, propertyId: property.id } }">
                        {{ property.name }}
                    </RouterLink>
                </td>
                <td v-if="property.multiValued">{{ Utils.capitalize($t("main.multi_valued")) }}</td>
                <td v-else-if="property.ngsiLdType === 'Property'">
                    <span v-if="property.propertyNgsiLdValueType === 'String'">{{ String(entity.getProperty(getPropertyName(property.id))) }}</span>
                    <span v-else-if="property.propertyNgsiLdValueType === 'Number'">{{ Number(entity.getProperty(getPropertyName(property.id))) }}</span>
                    <span v-else-if="property.propertyNgsiLdValueType === 'Boolean'">
                        <BooleanIcon :value="Boolean(entity.getProperty(getPropertyName(property.id)))" />
                    </span>
                    <span v-else-if="property.propertyNgsiLdValueType === 'Object'">Object</span>
                    <span v-else-if="property.propertyNgsiLdValueType === 'Array'">Array</span>
                </td>
                <td v-else-if="property.ngsiLdType === 'GeoProperty'">{{ entity.getGeoProperty(getPropertyName(property.id))[0] }}</td>
                <td v-else-if="property.ngsiLdType === 'Relationship'">
                    <RouterLink :to="{ name: 'workspace', params: { workspaceId: workspace.id }, query: { typeId: property.relationshipType, entityId: entity.getRelationship(getPropertyName(property.id)) } }">
                        {{ entity.getRelationship(getPropertyName(property.id)) }}
                    </RouterLink>
                </td>
                <td>
                    <RouterLink v-if="property.temporal" :to="{ name: 'temporalEntities.properties.show', params: { workspaceId: workspace.id, entityId: entity.getId(), typeId: property.hasType, propertyId: property.id } }">
                        <i class="fa-solid fa-clock-rotate-left" />
                    </RouterLink>
                </td>
            </tr>
        </tbody>
    </table>
</template>
