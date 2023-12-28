<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        woTEventProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            woTEvent: {
            }
        };
    },
    computed: {
        selectedWoTProperty() {
            if (!this.woTEvent.hasWoTProperty) {
                return null;
            }

            return this.$store.getters["woTProperties/getWoTProperty"](this.workspace.id, this.woTEvent.hasWoTProperty);
        },
        filteredDataServices() {
            return Object.values(this.dataServices).filter((dataService) => {
                const dataServiceActions = this.$store.getters["dataServiceActions/getDataServiceActionsByDataServiceId"](this.workspace.id, dataService.id);
                for (const dataServiceAction of dataServiceActions) {
                    const dataAction = this.$store.getters["dataActions/getDataAction"](dataServiceAction.hasDataAction);
                    if (dataAction.name.includes(":Notification")) {
                        return true;
                    }
                }
                return false;
            });
        }
    },
    watch: {
        "woTEvent.hasWoTProperty"(hasWoTProperty) {
            if (hasWoTProperty) {
                this.woTEvent.capacityType = this.selectedWoTProperty.capacityType;
                this.woTEvent.capacityValue = this.selectedWoTProperty.capacityValue;
            }
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        this.woTProperties = this.$store.getters["woTProperties/getWoTProperties"](this.workspace.id, this.woTThingDescription.id);
        this.dataServices = this.$store.getters["dataServices/getDataServices"](this.workspace.id);

        this.woTEvent.hasWorkspace = this.workspace.id;
        this.woTEvent.hasWoTThingDescription = this.woTThingDescription.id;

        if (this.woTEventProp) {
            this.update = true;
            Object.assign(this.woTEvent, this.woTEventProp);
        }
    },
    methods: {
        async storeWoTEvent() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.woTEvent = await this.$store.dispatch("woTEvents/storeWoTEvent", { workspaceId: this.workspace.id, woTEvent: this.woTEvent });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_event_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTEvents.show", params: { woTEventId: this.woTEvent.id } });
        },
        async updateWoTEvent() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("woTEvents/updateWoTEvent", { workspaceId: this.workspace.id, woTEvent: this.woTEvent });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_event_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTEvents.show", params: { woTEventId: this.woTEvent.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateWoTEvent() : storeWoTEvent()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="woTEvent.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="woTEvent.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="data-service" class="form-label">{{ Utils.capitalize($t("main.data_service")) }}</label>
            <select id="data-service" v-model="woTEvent.hasDataService" class="form-select" required>
                <option v-for="dataService in filteredDataServices" :key="dataService.id" :value="dataService.id">{{ dataService.id }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="wot-property" class="form-label">{{ Utils.capitalize($t("main.property")) }}</label>
            <select id="wot-property" v-model="woTEvent.hasWoTProperty" class="form-select" required>
                <option v-for="woTProperty in woTProperties" :key="woTProperty.id" :value="woTProperty.id">{{ woTProperty.name }}</option>
            </select>
        </div>
        <template v-if="selectedWoTProperty">
            <div class="mb-3">
                <label for="capacity-type" class="form-label">{{ Utils.capitalize($t("main.capacity_type")) }}</label>
                <select id="capacity-type" :value="selectedWoTProperty.capacityType" class="form-select" disabled>
                    <option value="FixedValue">FixedValue</option>
                    <option value="ListOfValues">ListOfValues</option>
                    <option value="Range">Range</option>
                    <option value="FreeText">FreeText</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="capacity-value" class="form-label">{{ Utils.capitalize($t("main.capacity_value")) }}</label>
                <textarea id="capacity-value" v-model="woTEvent.capacityValue" class="form-control" rows="3" required />
            </div>
        </template>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
