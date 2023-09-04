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

        const typeId = this.$route.params.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        const propertyId = this.$route.params.propertyId;
        this.property = this.$store.getters["properties/getProperty"](this.workspace.id, this.type.id, propertyId);

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
                name: this.type.name,
                route: {
                    name: "types.show",
                    params: {
                        workspaceId: this.workspace.id,
                        typeId: this.type.id
                    }
                }
            },
            {
                active: true,
                name: this.property.name
            }
        ];
    },
    methods: {
        async destroyProperty() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.property_deletion_question"),
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
                await this.$store.dispatch("properties/destroyProperty", { workspaceId: this.workspace.id, property: this.property });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.property_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "types.show", params: { workspaceId: this.workspace.id, typeId: this.type.id } });
        },
        getType(typeId) {
            return this.$store.getters["types/getType"](this.workspace.id, typeId);
        },
        getProperty(propertyId) {
            return this.$store.getters["properties/getProperty"](this.workspace.id, this.type.id, propertyId);
        },
        temporalService(temporalServiceId) {
            return this.$store.getters["temporalServices/getTemporalService"](temporalServiceId);
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ property.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateProperty(workspace.id, property.id)" :to="{ name: 'properties.edit', params: { workspaceId: workspace.id, typeId: type.id, propertyId: property.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyProperty(workspace.id, property.id)" class="btn btn-danger btn-sm ms-3" @click="destroyProperty">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ property.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ property.name }}</dd>
                    <template v-if="property.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ property.description }}</dd>
                    </template>
                    <template v-if="property.url">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.url")) }}</dt>
                        <dd class="col-sm-8"><a :href="property.url" target="_blank">{{ property.url }}</a></dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.ngsi_ld_type")) }}</dt>
                    <dd class="col-sm-8">{{ property.ngsiLdType }}</dd>
                    <template v-if="property.ngsiLdType == 'Property'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.property_ngsi_ld_value_type")) }}</dt>
                        <dd class="col-sm-8">{{ property.propertyNgsiLdValueType }}</dd>
                    </template>
                    <template v-else-if="property.ngsiLdType == 'Relationship'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.relationship_type")) }}</dt>
                        <dd class="col-sm-8">{{ getType(property.relationshipType).name }}</dd>
                    </template>
                    <template v-else-if="property.ngsiLdType == 'GeoProperty'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.geo_property_ngsi_ld_type")) }}</dt>
                        <dd class="col-sm-8">{{ property.geoPropertyNgsiLdType }}</dd>
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.geo_property_geographic")) }}</dt>
                        <dd class="col-sm-8">
                            <BooleanIcon :value="property.geoPropertyGeographic" />
                        </dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.standard")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="property.standard" />
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.mandatory")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="property.mandatory" />
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.temporal")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="property.temporal" />
                    </dd>
                    <template v-if="property.temporal">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.temporal_services")) }}</dt>
                        <dd class="col-sm-8">
                            <div v-for="temporalServiceId in property.temporalServices" :key="temporalServiceId">{{ temporalService(temporalServiceId).name }}</div>
                        </dd>
                    </template>
                    <template v-if="property.hasProperty">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.property")) }}</dt>
                        <dd class="col-sm-8">{{ getProperty(property.hasProperty).name }}</dd>
                    </template>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.multi_valued")) }}</dt>
                    <dd class="col-sm-8 mb-0">
                        <BooleanIcon :value="property.multiValued" />
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
