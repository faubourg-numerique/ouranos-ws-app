<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        woTPropertyProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            woTProperty: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](workspaceId, woTActionId);

        this.woTProperty.hasWoTThingDescription = this.woTThingDescription.id;
        this.woTProperty.hasWorkspace = this.workspace.id;

        this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.woTThingDescription.hasType);

        if (this.woTPropertyProp) {
            this.update = true;
            Object.assign(this.woTProperty, this.woTPropertyProp);
        }
    },
    methods: {
        async storeWoTProperty() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.woTProperty = await this.$store.dispatch("woTProperties/storeWoTProperty", { workspaceId: this.workspace.id, woTProperty: this.woTProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.property_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTProperties.show", params: { woTPropertyId: this.woTProperty.id } });
        },
        async updateWoTProperty() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("woTProperties/updateWoTProperty", { workspaceId: this.workspace.id, woTProperty: this.woTProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.property_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTProperties.show", params: { woTPropertyId: this.woTProperty.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateWoTProperty() : storeWoTProperty()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="woTProperty.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="woTProperty.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="capacity-type" class="form-label">{{ Utils.capitalize($t("main.capacity_type")) }}</label>
            <select id="capacity-type" v-model="woTProperty.capacityType" class="form-select" required>
                <option value="FixedValue">FixedValue</option>
                <option value="ListOfValues">ListOfValues</option>
                <option value="Range">Range</option>
                <option value="FreeText">FreeText</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="capacity-value" class="form-label">{{ Utils.capitalize($t("main.capacity_value")) }}</label>
            <textarea id="capacity-value" v-model="woTProperty.capacityValue" class="form-control" rows="3" required />
        </div>
        <div class="mb-3">
            <label for="property" class="form-label">{{ Utils.capitalize($t("main.property")) }}</label>
            <select id="property" v-model="woTProperty.hasProperty" class="form-select" required>
                <option v-for="property in properties" :key="property.id" :value="property.id">{{ property.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
