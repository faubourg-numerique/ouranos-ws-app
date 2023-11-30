<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        controlledPropertyProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            controlledProperty: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const capabilityId = this.$route.params.capabilityId;
        this.capability = this.$store.getters["capabilities/getCapability"](workspaceId, capabilityId);

        this.controlledProperty.hasWorkspace = this.workspace.id;
        this.controlledProperty.hasCapability = this.capability.id;

        this.propertiesByTypes = this.$store.getters["properties/getPropertiesByTypes"](this.workspace.id);

        if (this.controlledPropertyProp) {
            this.update = true;
            Object.assign(this.controlledProperty, this.controlledPropertyProp);
        }
    },
    methods: {
        async storeControlledProperty() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.controlledProperty = await this.$store.dispatch("controlledProperties/storeControlledProperty", { workspaceId: this.workspace.id, controlledProperty: this.controlledProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.controlled_property_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "controlledProperties.show", params: { controlledPropertyId: this.controlledProperty.id } });
        },
        async updateControlledProperty() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("controlledProperties/updateControlledProperty", { workspaceId: this.workspace.id, controlledProperty: this.controlledProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.controlled_property_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "controlledProperties.show", params: { controlledPropertyId: this.controlledProperty.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateControlledProperty() : storeControlledProperty()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="controlledProperty.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="controlledProperty.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="capacity-type" class="form-label">{{ Utils.capitalize($t("main.capacity_type")) }}</label>
            <select id="capacity-type" v-model="controlledProperty.capacityType" class="form-select" required>
                <option value="FixedValue">FixedValue</option>
                <option value="ListOfValues">ListOfValues</option>
                <option value="Range">Range</option>
                <option value="FreeText">FreeText</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="capacity-value" class="form-label">{{ Utils.capitalize($t("main.capacity_value")) }}</label>
            <textarea id="capacity-value" v-model="controlledProperty.capacityValue" class="form-control" rows="3" required />
        </div>
        <div class="mb-3">
            <label for="property" class="form-label">{{ Utils.capitalize($t("main.property")) }}</label>
            <select id="property" v-model="controlledProperty.hasProperty" class="form-select" required>
                <template v-for="(properties, typeId) in propertiesByTypes" :key="typeId">
                    <option v-for="property in properties" :key="property.id" :value="property.id">{{ $store.getters["types/getType"](workspace.id, typeId).name }} / {{ property.name }}</option>
                </template>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
