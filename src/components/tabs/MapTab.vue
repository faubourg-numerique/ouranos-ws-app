<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import SpinnerAnimation from "@/components/SpinnerAnimation";

export default {
    components: {
        ApiErrorAlert,
        SpinnerAnimation
    },
    data() {
        return {
            error: null,
            type: null,
            properties: null,
            entities: null,
            center: null,
            points: [],
            polygons: [],
            polygonOptions: {
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "#FF0000",
                fillOpacity: 0.35
            }
        };
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.init();
    },
    methods: {
        init() {
            this.error = null;
            this.type = null;
            this.properties = null;
            this.entities = null;
            this.center = { lat: 48.856613, lng: 2.352222 };
            this.points = [];

            const typeId = this.$route.query.typeId;
            if (!typeId) return;

            this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);
            this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id);

            this.loadEntities();
        },
        async loadEntities() {
            const query = {
                type: this.type.name
            };
            try {
                this.entities = await this.$store.dispatch("entities/indexEntities", { workspaceId: this.workspace.id, query });
            } catch (error) {
                this.error = error;
                return;
            }

            const properties = [];
            Object.values(this.properties).forEach(property => {
                if (property.ngsiLdType !== "GeoProperty") return;
                if (property.hasProperty) return;
                properties.push(property.name);
            });

            if (!properties.length) {
                return;
            }

            Object.values(this.entities).forEach(entity => {
                properties.forEach(property => {
                    if (!entity.geoPropertyExists(property)) return;
                    const geoProperty = entity.getGeoProperty(property);
                    switch (geoProperty[0]) {
                        case "Point": {
                            const point = {
                                entityId: entity.getId(),
                                position: {
                                    lat: geoProperty[1][1],
                                    lng: geoProperty[1][0]
                                }
                            };
                            this.points.push(point);
                            break;
                        }
                        case "Polygon": {
                            const paths = [];
                            geoProperty[1][0].forEach(point => {
                                paths.push({
                                    lat: point[1],
                                    lng: point[0]
                                });
                            });
                            const polygon = {
                                entityId: entity.getId(),
                                paths: paths
                            };
                            this.polygons.push(polygon);
                            break;
                        }
                    }
                });
            });

            if (this.points.length) {
                this.center = this.points[0].position;
            } else if (this.polygons.length) {
                this.center = this.polygons[0].paths[0];
            }
        },
        openEntity(entityId) {
            this.$router.push({ name: "workspace", params: { workspaceId: this.workspace.id }, query: { typeId: this.type.id, entityId, activeTab: "entities" } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <div v-else-if="!type" class="alert alert-info mb-0">
        <h5 class="alert-heading">{{ $t("dialogs.no_type_selected_title") }}</h5>
        <p class="mb-0">{{ $t("dialogs.no_type_selected_message") }}</p>
    </div>
    <template v-else>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.map")) }}</span>
            </div>
            <div class="card-body">
                <SpinnerAnimation v-if="!entities" />
                <GMapMap v-else :center="center" :zoom="10" map-type-id="roadmap" style="height: 60vh" class="w-100">
                    <GMapCluster>
                        <GMapMarker v-for="(point, index) in points" :key="index" :position="point.position" :clickable="true" @click="openEntity(point.entityId)" />
                        <GMapPolygon v-for="(polygon, index) in polygons" :key="index" :paths="polygon.paths" :options="polygonOptions" />
                    </GMapCluster>
                </GMapMap>
            </div>
        </div>
    </template>
</template>
