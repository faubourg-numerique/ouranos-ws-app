<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        woTActionInputPropertyProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            woTActionInputProperty: {
                minimum: null,
                maximum: null,
                enum: null,
                required: false,
            },
            enumeration: null
        };
    },
    watch: {
        "woTActionInputProperty.propertyType"() {
            if (this.woTActionInputProperty.propertyType !== "number") {
                this.woTActionInputProperty.minimum = null;
                this.woTActionInputProperty.maximum = null;
            }
            if (this.woTActionInputProperty.propertyType !== "number" && this.woTActionInputProperty.propertyType !== "string") {
                this.enumeration = null;
                this.woTActionInputProperty.enum = null;
            }
        },
        "woTActionInputProperty.minimum"() {
            if (this.woTActionInputProperty.minimum === "") {
                this.woTActionInputProperty.minimum = null;
            }
        },
        "woTActionInputProperty.maximum"() {
            if (this.woTActionInputProperty.maximum === "") {
                this.woTActionInputProperty.maximum = null;
            }
        },
        enumeration() {
            if (this.enumeration === "") {
                this.enumeration = null;
                this.woTActionInputProperty.enum = null;
            }
        },
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](workspaceId, woTActionId);

        this.woTActionInputProperty.hasWoTAction = this.woTAction.id;
        this.woTActionInputProperty.hasWoTThingDescription = this.woTThingDescription.id;
        this.woTActionInputProperty.hasWorkspace = this.workspace.id;
 
        if (this.woTActionInputPropertyProp) {
            this.update = true;
            Object.assign(this.woTActionInputProperty, this.woTActionInputPropertyProp);
        }

        if (this.woTActionInputProperty.enum) {
            this.enumeration = JSON.stringify(this.woTActionInputProperty.enum);
        }
    },
    methods: {
        async storeWoTActionInputProperty() {
            if (this.enumeration) {
                this.woTActionInputProperty.enum = JSON.parse(this.enumeration);
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.woTActionInputProperty = await this.$store.dispatch("woTActionInputProperties/storeWoTActionInputProperty", { workspaceId: this.workspace.id, woTActionInputProperty: this.woTActionInputProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_input_property_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTActionInputProperties.show", params: { woTActionInputPropertyId: this.woTActionInputProperty.id } });
        },
        async updateWoTActionInputProperty() {
            if (this.enumeration) {
                this.woTActionInputProperty.enum = JSON.parse(this.enumeration);
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("woTActionInputProperties/updateWoTActionInputProperty", { workspaceId: this.workspace.id, woTActionInputProperty: this.woTActionInputProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_input_property_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTActionInputProperties.show", params: { woTActionInputPropertyId: this.woTActionInputProperty.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateWoTActionInputProperty() : storeWoTActionInputProperty()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="woTActionInputProperty.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="woTActionInputProperty.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="type" class="form-label">{{ Utils.capitalize($t("main.type")) }}</label>
            <select id="type" v-model="woTActionInputProperty.propertyType" class="form-select" required>
                <option value="number">Number</option>
                <option value="string">String</option>
                <option value="boolean">Boolean</option>
            </select>
        </div>
        <template v-if="woTActionInputProperty.propertyType === 'number'">
            <div class="mb-3">
                <label for="minimum" class="form-label">{{ Utils.capitalize($t("main.minimum")) }}</label>
                <input id="minimum" v-model="woTActionInputProperty.minimum" type="number" class="form-control">
            </div>
            <div class="mb-3">
                <label for="maximum" class="form-label">{{ Utils.capitalize($t("main.maximum")) }}</label>
                <input id="maximum" v-model="woTActionInputProperty.maximum" type="number" class="form-control">
            </div>
        </template>
        <template v-if="woTActionInputProperty.propertyType === 'number' || woTActionInputProperty.propertyType === 'string'">
            <div class="mb-3">
                <label for="enum" class="form-label">{{ Utils.capitalize($t("main.enum")) }}</label>
                <input id="enum" v-model="enumeration" type="text" class="form-control">
            </div>
        </template>
        <div class="form-check mb-3">
            <input id="required" v-model="woTActionInputProperty.required" class="form-check-input" type="checkbox">
            <label for="required" class="form-check-label">{{ Utils.capitalize($t("main.required")) }}</label>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
