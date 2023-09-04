<script>
import moment from "moment";

import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import SpinnerAnimation from "@/components/SpinnerAnimation";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav,
        SpinnerAnimation
    },
    data() {
        return {
            error: null,
            temporalEntityProperty: null,
            temporalServiceId: null,
            beginDate: null,
            beginTime: null,
            endDate: null,
            endTime: null
        };
    },
    watch: {
        temporalServiceId() {
            this.loadTemporalEntityProperty();
        }
    },
    created() {
        this.beginDate = moment().subtract(1, "hours").utc().format("YYYY-MM-DD");
        this.beginTime = moment().subtract(1, "hours").utc().format("HH:mm:ss");

        this.endDate = moment().utc().format("YYYY-MM-DD");
        this.endTime = moment().utc().format("HH:mm:ss");

        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const typeId = this.$route.params.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        const propertyId = this.$route.params.propertyId;
        this.property = this.$store.getters["properties/getProperty"](this.workspace.id, this.type.id, propertyId);

        this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id);

        this.propertiesOfPropertiesNames = [];
        Object.values(this.properties).forEach(property => {
            if (property.hasProperty === this.property.id) {
                this.propertiesOfPropertiesNames.push(property.name);
            }
        });

        if (this.property.temporalServices.length) {
            this.temporalServiceId = this.property.temporalServices[0];
        }

        this.entityId = this.$route.params.entityId;

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
    },
    methods: {
        temporalService(temporalServiceId) {
            return this.$store.getters["temporalServices/getTemporalService"](temporalServiceId);
        },
        async loadTemporalEntityProperty() {
            if (!this.temporalServiceId) {
                return;
            }

            this.temporalEntityProperty = null;

            const fromTime = moment(`${this.beginDate}T${this.beginTime}Z`).unix();
            const toTime = moment(`${this.endDate}T${this.endTime}Z`).unix();

            var temporalEntityProperty;
            try {
                temporalEntityProperty = await this.$store.dispatch("temporalEntityProperties/showTemporalEntityProperty", { workspaceId: this.workspace.id, entityId: this.entityId, propertyId: this.property.id, temporalServiceId: this.temporalServiceId, fromTime, toTime });
            } catch (error) {
                this.error = error;
            }

            if (!Array.isArray(temporalEntityProperty.data)) {
                temporalEntityProperty.data = [temporalEntityProperty.data];
            }

            temporalEntityProperty.data.sort(function (a, b) {
                if (a.observedAt < b.observedAt) {
                    return 1;
                }
                if (a.observedAt > b.observedAt) {
                    return -1;
                }
                return 0;
            });

            this.temporalEntityProperty = temporalEntityProperty;
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.temporal_entity_property")) }}</div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <select v-model="temporalServiceId" class="form-select">
                    <option v-for="temporalServiceId in property.temporalServices" :key="temporalServiceId" :value="temporalServiceId">{{ temporalService(temporalServiceId).name }}</option>
                </select>
                <SpinnerAnimation v-if="temporalServiceId && !temporalEntityProperty" class="mt-3" />
                <template v-if="temporalEntityProperty">
                    <div class="row align-items-end mt-3">
                        <div class="col-5">
                            <div class="row align-items-end">
                                <div class="col">
                                    <label for="begin-date" class="form-label">{{ Utils.capitalize($t("main.begin_date")) }}</label>
                                    <input id="begin-date" v-model="beginDate" type="date" class="form-control">
                                </div>
                                <div class="col">
                                    <input id="begin-time" v-model="beginTime" type="time" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="row align-items-end">
                                <div class="col">
                                    <label for="end-date" class="form-label">{{ Utils.capitalize($t("main.end_date")) }}</label>
                                    <input id="end-date" v-model="endDate" type="date" class="form-control">
                                </div>
                                <div class="col">
                                    <input id="end-time" v-model="endTime" type="time" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <button class="btn btn-primary w-100" @click="loadTemporalEntityProperty">{{ Utils.capitalize($t("main.apply")) }}</button>
                        </div>
                    </div>
                    <div style="max-height: 500px;" class="table-responsive mt-3">
                        <table class="table table-sm mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>{{ Utils.capitalize($t("main.date")) }}</th>
                                    <th>{{ Utils.capitalize($t("main.value")) }}</th>
                                    <th v-for="(name, index) in propertiesOfPropertiesNames" :key="index">{{ name }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in temporalEntityProperty.data" :key="index">
                                    <td>{{ row.observedAt }}</td>
                                    <td>{{ row.value }}</td>
                                    <th v-for="(name, index) in propertiesOfPropertiesNames" :key="index">
                                        <template v-if="row[name]">{{ row[name].value }}</template>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
