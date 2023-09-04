<script>
import { Entity } from "@/classes/Entity";

import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            entityId: null,
            type: null,
            typeId: null,
            workspace: null,
            ascendingType: null,
            ascendingEntityId: null,
            ascendingRelationshipPropertyId: null,
            descendingTypes: null,
            error: null
        };
    },
    watch: {
        entityId(entityId) {
            if (entityId === "") {
                delete this.entityId;
            }
        }
    },
    async created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

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
                active: true,
                name: this.Utils.capitalize(this.$t("main.create"))
            }
        ];

        this.ascendingEntityId = this.$route.query.ascendingEntityId;

        if (this.ascendingEntityId) {
            const ascendingTypeId = this.$route.query.ascendingTypeId;
            this.ascendingType = this.$store.getters["types/getType"](this.workspace.id, ascendingTypeId);

            this.descendingTypes = [];
            const types = Object.values(this.$store.getters["types/getTypes"](this.workspace.id))
            types.forEach(type => {
                const properties = Object.values(this.$store.getters["properties/getProperties"](this.workspace.id, type.id));
                properties.forEach(property => {
                    if (property.ngsiLdType !== "Relationship") return;
                    if (property.relationshipType !== this.ascendingType.id) return;
                    if (this.descendingTypes.includes(type)) return;
                    this.descendingTypes.push(type);
                });
            });
        } else {
            this.typeId = this.$route.query.typeId;
            this.type = this.$store.getters["types/getType"](this.workspace.id, this.typeId);
        }
    },
    methods: {
        async storeEntity() {
            var entity = new Entity();
            if (this.entityId) {
                entity.setId(this.entityId);
            }

            if (this.ascendingEntityId) {
                const type = this.$store.getters["types/getType"](this.workspace.id, this.typeId);
                entity.setType(type.name);

                const ascendingRelationshipProperty = this.$store.getters["properties/getProperty"](this.workspace.id, this.typeId, this.ascendingRelationshipPropertyId)
                entity.setRelationship(ascendingRelationshipProperty.name, this.ascendingEntityId);
            } else {
                entity.setType(this.type.name);
            }

            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                entity = await this.$store.dispatch("entities/storeEntity", { workspaceId: this.workspace.id, typeId: this.typeId, entity: entity });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.entity_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspace", params: { workspaceId: this.workspace.id }, query: { typeId: this.typeId, entityId: entity.getId() } });
        },
        getAscendingRelationshipProperties() {
            const ascendingRelationshipProperties = [];
            const properties = Object.values(this.$store.getters["properties/getProperties"](this.workspace.id, this.typeId));
            properties.forEach(property => {
                if (property.ngsiLdType !== "Relationship") return;
                if (property.relationshipType !== this.ascendingType.id) return;
                if (property.hasProperty) return;
                ascendingRelationshipProperties.push(property);
            });
            return ascendingRelationshipProperties;
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_an_entity")) }}</div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <form @submit.prevent="storeEntity">
                    <div class="mb-3">
                        <label for="entity-id" class="form-label">{{ Utils.capitalize($t("main.id")) }}</label>
                        <input id="entity-id" v-model="entityId" v-focus type="text" class="form-control">
                        <div class="form-text">{{ $t("dialogs.id_automatically_generated_if_not_provided") }}</div>
                    </div>
                    <template v-if="ascendingEntityId">
                        <div class="mb-3">
                            <label for="ascending-entity-id" class="form-label">{{ Utils.capitalize($t("main.ascending_entity_id")) }}</label>
                            <input id="ascending-entity-id" type="text" class="form-control" :value="ascendingEntityId" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="entity-type-id" class="form-label">{{ Utils.capitalize($t("main.type")) }}</label>
                            <select id="entity-type-id" v-model="typeId" class="form-select" required>
                                <option v-for="descendingType in descendingTypes" :key="descendingType.id" :value="descendingType.id">{{ descendingType.name }}</option>
                            </select>
                        </div>
                        <div v-if="typeId" class="mb-3">
                            <label for="ascending-relationship-property-id" class="form-label">{{ Utils.capitalize($t("main.ascending_property")) }}</label>
                            <select id="ascending-relationship-property-id" v-model="ascendingRelationshipPropertyId" class="form-select" required>
                                <option v-for="ascendingRelationshipProperty in getAscendingRelationshipProperties()" :key="ascendingRelationshipProperty.id" :value="ascendingRelationshipProperty.id">{{ ascendingRelationshipProperty.name }}</option>
                            </select>
                        </div>
                    </template>
                    <div v-else class="mb-3">
                        <label for="entity-type" class="form-label">{{ Utils.capitalize($t("main.type")) }}</label>
                        <input id="entity-type" type="text" class="form-control" :value="type.name" readonly>
                    </div>
                    <button type="submit" class="btn btn-primary">{{ Utils.capitalize($t("main.create")) }}</button>
                </form>
            </div>
        </div>
    </div>
</template>
