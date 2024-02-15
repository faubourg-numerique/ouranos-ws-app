<script>
import { DataSet } from "vis-data";
import { Network } from "vis-network";

import DataModelOutdated from "@/components/DataModelOutdated";
import EntitiesTab from "@/components/tabs/EntitiesTab";
import MapTab from "@/components/tabs/MapTab";
import SubscriptionsTab from "@/components/tabs/SubscriptionsTab";

const ACTIVE_NODE_COLOR = "#00b894";
const INACTIVE_NODE_COLOR = "#b2bec3";
const EDGE_COLOR = "#b2bec3";

export default {
    components: {
        DataModelOutdated,
        EntitiesTab,
        MapTab,
        SubscriptionsTab
    },
    data() {
        return {
            activeTab: "entities",
            groups: {
                "equipment": {
                    color: {
                        background: "#a55eea"
                    },
                    hidden: false
                },
                "equipment-model": {
                    color: {
                        background: "#4b7bec"
                    },
                    hidden: false
                },
                "infrastructure": {
                    color: {
                        background: "#fc5c65"
                    },
                    hidden: false
                },
                "control": {
                    color: {
                        background: "#fd9644"
                    },
                    hidden: false
                },
                "observation-data-collection": {
                    color: {
                        background: "#45aaf2"
                    },
                    hidden: false
                }
            }
        };
    },
    watch: {
        "$route.query.typeId"() {
            const typeId = this.$route.query.typeId;
            if (!typeId) return;
            this.setActiveNode(typeId);
        },
        "$route.query.activeTab"() {
            const activeTab = this.$route.query.activeTab;
            if (!activeTab) return;
            this.setActiveTab(activeTab);
        },
        groups: {
            deep: true,
            handler() {
                this.network.setOptions({
                    groups: this.groups
                });
                this.network.body.emitter.emit("_dataChanged");
            }
        }
    },
    created() {
        const activeTab = this.$route.query.activeTab;
        if (activeTab) {
            this.setActiveTab(activeTab);
        }

        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.types = this.$store.getters["types/getTypes"](this.workspace.id);

        this.buildNetwork();
    },
    mounted() {
        const container = document.getElementById("data-model");
        const data = {
            nodes: this.nodes,
            edges: this.edges
        };
        const options = {
            nodes: {
                borderWidth: 0,
                chosen: false,
                color: {
                    background: INACTIVE_NODE_COLOR
                },
                font: {
                    size: 16
                },
                margin: 8,
                shape: "box"
            },
            edges: {
                arrows: "to",
                chosen: false,
                color: {
                    color: EDGE_COLOR
                },
                smooth: {
                    type: "continuous"
                }
            },
            groups: this.groups,
            layout: {
                randomSeed: 0
            },
            physics: false
        };
        this.network = new Network(container, data, options);

        this.network.on("dragEnd", properties => {
            if (properties.nodes.length !== 1) {
                return;
            }
            const typeId = properties.nodes[0];
            const position = this.network.getPosition(typeId);
            const positionInChart = Object.values(position);
            try {
                this.$store.dispatch("types/updatePositionInChart", { workspaceId: this.workspace.id, typeId, positionInChart });
            } catch (error) {
                undefined;
            }
        });

        this.network.on("click", properties => {
            if (properties.nodes.length !== 1) {
                return;
            }
            this.setType(properties.nodes[0]);
        });

        this.network.on("doubleClick", properties => {
            if (properties.nodes.length !== 1) {
                return;
            }
            const typeId = properties.nodes[0];
            this.$router.push({ name: "types.show", params: { workspaceId: this.workspace.id, typeId } });
        });
    },
    methods: {
        setActiveTab(tab) {
            this.activeTab = tab;
        },
        setActiveNode(nodeId) {
            for (const node of this.nodes.get()) {
                const group = node.group && this.groups[node.group] ? this.groups[node.group] : null;
                node.color = {
                    background: node.id === nodeId ? ACTIVE_NODE_COLOR : (group && group.color && group.color.background ? group.color.background : INACTIVE_NODE_COLOR)
                };
                this.nodes.update(node);
            }
        },
        setType(typeId) {
            this.$router.push({ name: "workspace", params: { workspaceId: this.workspace.id }, query: { typeId: typeId, activeTab: this.activeTab } });
        },
        async buildNetwork() {
            const typeId = this.$route.query.typeId;

            const nodes = [];
            const edges = [];
            for (const type of Object.values(this.types)) {
                const node = {
                    id: type.id,
                    label: type.name
                };

                const hasDataServices = this.$store.getters["dataServices/hasDataServicesByTypeId"](this.workspace.id, type.id);
                const hasDemandDataServices = this.$store.getters["dataServices/hasDemandDataServicesByTypeId"](this.workspace.id, type.id);
                const hasOfferDataServices = this.$store.getters["dataServices/hasOfferDataServicesByTypeId"](this.workspace.id, type.id);

                if (hasDataServices) {
                    if (hasDemandDataServices && hasOfferDataServices) {
                        node.label += " 🡅🡇";
                    } else if (hasDemandDataServices) {
                        node.label += " 🡇";
                    } else if (hasOfferDataServices) {
                        node.label += " 🡅";
                    } else {
                        node.label += " ■";
                    }
                }

                if (typeId === type.id) {
                    node.color = {
                        background: ACTIVE_NODE_COLOR
                    };
                }
                if (type.positionInChart) {
                    node.x = type.positionInChart[0];
                    node.y = type.positionInChart[1];
                }
                if (type.dataModelGroup) {
                    node.group = type.dataModelGroup;
                }
                nodes.push(node);
                const properties = this.$store.getters["properties/getProperties"](this.workspace.id, type.id);
                Object.values(properties).forEach(property => {
                    if (property.ngsiLdType !== "Relationship") {
                        return;
                    }
                    edges.push({
                        from: property.relationshipType,
                        to: property.hasType
                    });
                });
            }
            this.nodes = new DataSet(nodes);
            this.edges = new DataSet(edges);
        }
    }
}
</script>

<template>
    <div id="data-model-groups-filters-modal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">{{ Utils.capitalize($t("main.data_model_group")) }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" />
                </div>
                <div class="modal-body">
                    <div class="form-check form-switch mb-3">
                        <input id="equipment" v-model="groups['equipment'].hidden" class="form-check-input" type="checkbox" :true-value="false" :false-value="true">
                        <label style="color: #a55eea;" for="equipment" class="form-check-label">{{ Utils.capitalize($t("main.equipment")) }}</label>
                    </div>
                    <div class="form-check form-switch mb-3">
                        <input id="equipment-model" v-model="groups['equipment-model'].hidden" class="form-check-input" type="checkbox" :true-value="false" :false-value="true">
                        <label style="color: #4b7bec;" for="equipment-model" class="form-check-label">{{ Utils.capitalize($t("main.equipment_model")) }}</label>
                    </div>
                    <div class="form-check form-switch mb-3">
                        <input id="infrastructure" v-model="groups['infrastructure'].hidden" class="form-check-input" type="checkbox" :true-value="false" :false-value="true">
                        <label style="color: #fc5c65;" for="infrastructure" class="form-check-label">{{ Utils.capitalize($t("main.infrastructure")) }}</label>
                    </div>
                    <div class="form-check form-switch mb-3">
                        <input id="control" v-model="groups['control'].hidden" class="form-check-input" type="checkbox" :true-value="false" :false-value="true">
                        <label style="color: #fd9644;" for="control" class="form-check-label">{{ Utils.capitalize($t("main.control")) }}</label>
                    </div>
                    <div class="form-check form-switch">
                        <input id="observation-data-collection" v-model="groups['observation-data-collection'].hidden" class="form-check-input" type="checkbox" :true-value="false" :false-value="true">
                        <label style="color: #45aaf2;" for="observation-data-collection" class="form-check-label">{{ Utils.capitalize($t("main.observation_data_collection")) }}</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ Utils.capitalize($t("main.close")) }}</button>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid my-5">
        <div class="row">
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>{{ workspace.name }}</span>
                        <span>
                            <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'woTThingDescriptions.index', params: { workspaceId: workspace.id } }">
                                <i class="fa-solid fa-tower-cell" />
                            </RouterLink>
                            <RouterLink class="btn btn-primary btn-sm ms-3" :to="{ name: 'types.index', params: { workspaceId: workspace.id } }">
                                <i class="fa-solid fa-gears" />
                            </RouterLink>
                            <button class="btn btn-primary btn-sm ms-3" data-bs-toggle="modal" data-bs-target="#data-model-groups-filters-modal">
                                <i class="fa-solid fa-filter" />
                            </button>
                        </span>
                    </div>
                    <div class="card-body">
                        <div id="data-model-container">
                            <div id="data-model" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-8 mb-4">
                <DataModelOutdated v-if="!workspace.dataModelUpToDate" />
                <template v-else>
                    <div class="mb-4">
                        <button class="btn me-3" :class="{ 'btn-primary': activeTab === 'entities', 'btn-outline-primary': activeTab !== 'entities' }" @click="setActiveTab('entities')">{{ Utils.capitalize($t("main.data_browser")) }}</button>
                        <RouterLink class="btn btn-outline-primary me-3" :to="{ name: 'dataServices.index' }">{{ Utils.capitalize($t("main.data_services")) }}</RouterLink>
                        <RouterLink class="btn btn-outline-primary me-3" :to="{ name: 'contracts.index' }">{{ Utils.capitalize($t("main.contracts")) }}</RouterLink>
                        <RouterLink class="btn btn-outline-primary" :to="{ name: 'roles.index' }">{{ Utils.capitalize($t("main.roles")) }}</RouterLink>
                    </div>

                    <EntitiesTab v-if="activeTab === 'entities'" />
                    <SubscriptionsTab v-else-if="activeTab === 'subscriptions'" />
                    <MapTab v-else-if="activeTab === 'map'" />
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
#data-model-container {
    position: relative;
    padding-top: 100%;
}

#data-model {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
